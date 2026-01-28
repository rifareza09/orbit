<?php

namespace App\Http\Controllers;

use App\Models\LaporanKegiatan;
use App\Models\PengajuanKegiatan;
use App\Http\Requests\StoreLaporanRequest;
use App\Http\Requests\UpdateLaporanRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\NotificationService;

class LaporanKegiatanController extends Controller
{
    public function index()
    {
        // Get pengajuan kegiatan yang sudah disetujui atau selesai
        $pengajuanKegiatan = PengajuanKegiatan::where('user_id', Auth::id())
            ->whereIn('status', ['Disetujui', 'Selesai'])  // Filter: yang disetujui atau sudah selesai
            ->orderBy('tanggal_pelaksanaan', 'desc')
            ->get();

        // Map dengan informasi laporan kegiatan
        $pengajuanWithLaporan = $pengajuanKegiatan->map(function($pengajuan) {
            // Query laporan secara manual untuk menghindari N+1
            $laporan = LaporanKegiatan::where('pengajuan_kegiatan_id', $pengajuan->id)
                ->where('user_id', Auth::id())
                ->first();

            return [
                'id' => $pengajuan->id,
                'nama_kegiatan' => $pengajuan->nama_kegiatan,
                'ketua_pelaksana' => $pengajuan->ketua_pelaksana,
                'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan,
                'jumlah_peserta' => $pengajuan->jumlah_peserta,
                'tanggal_pelaksanaan' => $pengajuan->tanggal_pelaksanaan,
                'dana_digunakan' => $pengajuan->total_anggaran,
                'status' => $pengajuan->status,
                'hasLaporan' => $laporan ? true : false,
                'laporanStatus' => $laporan ? $laporan->status : 'Belum Diajukan',
                'laporanId' => $laporan ? $laporan->id : null,
            ];
        });

        return Inertia::render('laporan-kegiatan/index', [
            'pengajuan' => $pengajuanWithLaporan,
        ]);
    }

    public function create($pengajuanId)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
            ->where('id', $pengajuanId)
            ->firstOrFail();

        // Check apakah pengajuan sudah disetujui
        if ($pengajuan->status !== 'Disetujui') {
            return back()->with('error', 'Laporan kegiatan hanya bisa dibuat setelah pengajuan kegiatan disetujui oleh Puskaka');
        }

        // Check if laporan already exists for this pengajuan
        $existingLaporan = LaporanKegiatan::where('pengajuan_kegiatan_id', $pengajuanId)
            ->where('user_id', Auth::id())
            ->first();

        // If laporan exists, load it for editing
        if ($existingLaporan) {
            return Inertia::render('laporan-kegiatan/buatLaporanKegiatan', [
                'isEdit' => true,
                'laporanId' => $existingLaporan->id,
                'prefill' => [
                    'pengajuan_kegiatan_id' => $pengajuan->id,
                    'nama_kegiatan' => $pengajuan->nama_kegiatan,
                    'ketua_pelaksana' => $pengajuan->ketua_pelaksana,
                    'tanggal_pelaksanaan' => $pengajuan->tanggal_pelaksanaan,
                    'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan,
                    'jumlah_peserta' => $pengajuan->jumlah_peserta,
                    'anggaran_disetujui' => $pengajuan->total_anggaran,
                ],
                'existing' => [
                    'anggaran_realisasi' => $existingLaporan->anggaran_realisasi,
                    'ringkasan' => $existingLaporan->ringkasan,
                    'lpj_file' => $existingLaporan->lpj_file,
                    'bukti_pengeluaran' => $existingLaporan->bukti_pengeluaran,
                    'dokumentasi' => $existingLaporan->dokumentasi,
                    'status' => $existingLaporan->status,
                ]
            ]);
        }

        // Create new laporan
        return Inertia::render('laporan-kegiatan/buatLaporanKegiatan', [
            'isEdit' => false,
            'laporanId' => null,
            'prefill' => [
                'pengajuan_kegiatan_id' => $pengajuan->id,
                'nama_kegiatan' => $pengajuan->nama_kegiatan,
                'ketua_pelaksana' => $pengajuan->ketua_pelaksana,
                'tanggal_pelaksanaan' => $pengajuan->tanggal_pelaksanaan,
                'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan,
                'jumlah_peserta' => $pengajuan->jumlah_peserta,
                'anggaran_disetujui' => $pengajuan->total_anggaran,
            ],
            'existing' => null
        ]);
    }

    public function store(StoreLaporanRequest $request)
    {
        $validated = $request->validated();

        // Verify pengajuan belongs to user
        PengajuanKegiatan::where('id', $validated['pengajuan_kegiatan_id'])
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Handle LPJ file upload
        $lpjPath = null;
        if ($request->hasFile('lpj')) {
            $lpjPath = $request->file('lpj')->store('laporan/lpj', 'public');
        }

        // Handle Bukti Pengeluaran files upload
        $buktiPaths = [];
        if ($request->hasFile('bukti_pengeluaran')) {
            foreach ($request->file('bukti_pengeluaran') as $file) {
                $buktiPaths[] = $file->store('laporan/bukti', 'public');
            }
        }

        // Handle Dokumentasi files upload
        $dokPaths = [];
        if ($request->hasFile('dokumentasi')) {
            foreach ($request->file('dokumentasi') as $file) {
                $dokPaths[] = $file->store('laporan/dok', 'public');
            }
        }

        LaporanKegiatan::create([
            'user_id'               => Auth::id(),
            'pengajuan_kegiatan_id' => $validated['pengajuan_kegiatan_id'],
            'anggaran_disetujui'    => $validated['anggaran_disetujui'] ?? null,
            'anggaran_realisasi'    => $validated['anggaran_realisasi'] ?? null,
            'ringkasan'             => $validated['ringkasan'] ?? null,
            'status'                => 'Belum Diajukan',
            'lpj_file'              => $lpjPath,
            'bukti_pengeluaran'     => $buktiPaths,
            'dokumentasi'           => $dokPaths,
        ]);

        return redirect()->route('laporan.index')
            ->with('success', 'Laporan kegiatan berhasil dibuat!');
    }

    public function show($id)
    {
        $laporan = LaporanKegiatan::where('user_id', Auth::id())
            ->with(['pengajuanKegiatan.programKerja', 'user'])
            ->findOrFail($id);

        return Inertia::render('laporan-kegiatan/detail', [
            'item' => [
                'id' => $laporan->id,
                'pengajuan_kegiatan_id' => $laporan->pengajuan_kegiatan_id,
                'namaKegiatan' => $laporan->pengajuanKegiatan->nama_kegiatan ?? '-',
                'ketuaPelaksana' => $laporan->pengajuanKegiatan->ketua_pelaksana ?? '-',
                'tempatPelaksanaan' => $laporan->pengajuanKegiatan->tempat_pelaksanaan ?? '-',
                'tanggalPelaksanaan' => $laporan->pengajuanKegiatan->tanggal_pelaksanaan ?? null,
                'jumlahPeserta' => $laporan->pengajuanKegiatan->jumlah_peserta ?? 0,
                'estimasiAnggaran' => $laporan->pengajuanKegiatan->programKerja->estimasi_anggaran ?? 0,
                'anggaranDisetujui' => $laporan->pengajuanKegiatan->total_anggaran ?? 0,
                'anggaranRealisasi' => $laporan->anggaran_realisasi,
                'ringkasan' => $laporan->ringkasan,
                'catatan' => $laporan->catatan,
                'status' => $laporan->status,
                'catatan_puskaka' => $laporan->catatan_puskaka,
                'reviewed_at' => $laporan->reviewed_at ? (is_string($laporan->reviewed_at) ? $laporan->reviewed_at : $laporan->reviewed_at->format('d/m/Y H:i')) : null,
                'lpjFile' => $laporan->lpj_file,
                'buktiPengeluaran' => $laporan->bukti_pengeluaran ?? [],
                'dokumentasi' => $laporan->dokumentasi ?? [],
                'createdAt' => $laporan->created_at->format('d/m/Y H:i'),
                'updatedAt' => $laporan->updated_at->format('d/m/Y H:i'),
            ]
        ]);
    }

    public function edit($id)
    {
        $laporan = LaporanKegiatan::where('user_id', Auth::id())
            ->with('pengajuanKegiatan')
            ->findOrFail($id);

        return Inertia::render('laporan-kegiatan/edit', [
            'laporan' => [
                'id' => $laporan->id,
                'pengajuan_kegiatan_id' => $laporan->pengajuan_kegiatan_id,
                'ringkasan' => $laporan->ringkasan,
                'catatan' => $laporan->catatan,
                'status' => $laporan->status,
                'catatan_puskaka' => $laporan->catatan_puskaka,
                'reviewed_at' => $laporan->reviewed_at ? (is_string($laporan->reviewed_at) ? $laporan->reviewed_at : $laporan->reviewed_at->format('d/m/Y H:i')) : null,
                'lpj_file' => $laporan->lpj_file,
                'bukti_pengeluaran' => $laporan->bukti_pengeluaran ?? [],
                'dokumentasi' => $laporan->dokumentasi ?? [],
            ],
            'pengajuan' => [
                'id' => $laporan->pengajuanKegiatan->id,
                'nama_kegiatan' => $laporan->pengajuanKegiatan->nama_kegiatan ?? '-',
                'ketua_pelaksana' => $laporan->pengajuanKegiatan->ketua_pelaksana ?? '-',
                'tempat_pelaksanaan' => $laporan->pengajuanKegiatan->tempat_pelaksanaan ?? '-',
                'tanggal_pelaksanaan' => $laporan->pengajuanKegiatan->tanggal_pelaksanaan ?? null,
                'jumlah_peserta' => $laporan->pengajuanKegiatan->jumlah_peserta ?? 0,
                'anggaran_disetujui' => $laporan->pengajuanKegiatan->total_anggaran ?? 0,
            ]
        ]);
    }

    public function update(UpdateLaporanRequest $request, $id)
    {
        $laporan = LaporanKegiatan::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validated();

        $updateData = [
            'anggaran_realisasi' => $validated['anggaran_realisasi'] ?? $laporan->anggaran_realisasi,
            'ringkasan' => $validated['ringkasan'] ?? $laporan->ringkasan,
            'catatan' => $validated['catatan'] ?? $laporan->catatan,
        ];

        // Jika ada parameter 'submit' = true, ubah status Direvisi menjadi Diajukan untuk direview ulang
        // Jika tidak ada parameter 'submit', berarti hanya save tanpa mengubah status
        if ($request->has('submit') && $request->input('submit') === 'true' && $laporan->status === 'Direvisi') {
            $updateData['status'] = 'Diajukan';
        }

        // Handle LPJ file
        if ($request->hasFile('lpj')) {
            if ($laporan->lpj_file) {
                Storage::disk('public')->delete($laporan->lpj_file);
            }
            $updateData['lpj_file'] = $request->file('lpj')->store('laporan/lpj', 'public');
        }

        // Handle Bukti Pengeluaran files
        $currentBukti = $laporan->bukti_pengeluaran ?? [];

        // Remove selected files
        if ($request->has('remove_bukti') && is_array($request->input('remove_bukti'))) {
            foreach ($request->input('remove_bukti') as $filename) {
                $key = array_search($filename, $currentBukti);
                if ($key !== false) {
                    Storage::disk('public')->delete($currentBukti[$key]);
                    unset($currentBukti[$key]);
                }
            }
            $currentBukti = array_values($currentBukti); // Re-index array
        }

        // Add new files
        if ($request->hasFile('bukti_pengeluaran')) {
            foreach ($request->file('bukti_pengeluaran') as $file) {
                $currentBukti[] = $file->store('laporan/bukti', 'public');
            }
        }
        $updateData['bukti_pengeluaran'] = $currentBukti;

        // Handle Dokumentasi files
        $currentDok = $laporan->dokumentasi ?? [];

        // Remove selected files
        if ($request->has('remove_dokumentasi') && is_array($request->input('remove_dokumentasi'))) {
            foreach ($request->input('remove_dokumentasi') as $filename) {
                $key = array_search($filename, $currentDok);
                if ($key !== false) {
                    Storage::disk('public')->delete($currentDok[$key]);
                    unset($currentDok[$key]);
                }
            }
            $currentDok = array_values($currentDok); // Re-index array
        }

        // Add new files
        if ($request->hasFile('dokumentasi')) {
            foreach ($request->file('dokumentasi') as $file) {
                $currentDok[] = $file->store('laporan/dok', 'public');
            }
        }
        $updateData['dokumentasi'] = $currentDok;

        $laporan->update($updateData);

        return redirect()->route('laporan.index')->with('success', 'Laporan kegiatan berhasil diperbarui!');
    }

    public function ajukan($id)
    {
        $laporan = LaporanKegiatan::where('user_id', Auth::id())->findOrFail($id);

        // Update status to Diajukan
        $laporan->update(['status' => 'Diajukan']);

        // Send notification to Puskaka
        $user = Auth::user();
        $pengajuan = $laporan->pengajuanKegiatan;

        NotificationService::notifyPuskakaNewLaporan(
            $user->name,
            $pengajuan->nama_kegiatan ?? 'Laporan Kegiatan',
            $laporan->id
        );

        return redirect()->route('laporan.index')
            ->with('success', 'Laporan kegiatan berhasil diajukan!');
    }

    public function destroy($id)
    {
        $laporan = LaporanKegiatan::where('user_id', Auth::id())->findOrFail($id);

        // Delete all associated files
        if ($laporan->lpj_file) {
            Storage::disk('public')->delete($laporan->lpj_file);
        }

        if ($laporan->bukti_pengeluaran) {
            foreach ($laporan->bukti_pengeluaran as $file) {
                Storage::disk('public')->delete($file);
            }
        }

        if ($laporan->dokumentasi) {
            foreach ($laporan->dokumentasi as $file) {
                Storage::disk('public')->delete($file);
            }
        }

        $laporan->delete();

        return redirect()->route('laporan.index')
            ->with('success', 'Laporan kegiatan berhasil dihapus!');
    }

    public function download($id, $type)
    {
        $laporan = LaporanKegiatan::where('user_id', Auth::id())->findOrFail($id);

        if ($type === 'lpj') {
            if (!$laporan->lpj_file || !Storage::disk('public')->exists($laporan->lpj_file)) {
                abort(404, 'File LPJ tidak ditemukan');
            }

            $filePath = storage_path('app/public/' . $laporan->lpj_file);
            $fileName = 'LPJ_' . $laporan->pengajuanKegiatan->nama_kegiatan . '.pdf';

            return response()->download($filePath, $fileName);
        }

        $index = request()->query('index', 0);

        if ($type === 'bukti') {
            $files = $laporan->bukti_pengeluaran ?? [];
            if (!isset($files[$index]) || !Storage::disk('public')->exists($files[$index])) {
                abort(404, 'File bukti pengeluaran tidak ditemukan');
            }

            $filePath = storage_path('app/public/' . $files[$index]);
            $fileName = 'Bukti_Pengeluaran_' . ($index + 1) . '_' . $laporan->pengajuanKegiatan->nama_kegiatan;

            return response()->download($filePath, $fileName);
        }

        if ($type === 'dokumentasi') {
            $files = $laporan->dokumentasi ?? [];
            if (!isset($files[$index]) || !Storage::disk('public')->exists($files[$index])) {
                abort(404, 'File dokumentasi tidak ditemukan');
            }

            $filePath = storage_path('app/public/' . $files[$index]);
            $fileName = 'Dokumentasi_' . ($index + 1) . '_' . $laporan->pengajuanKegiatan->nama_kegiatan;

            return response()->download($filePath, $fileName);
        }

        abort(404, 'Tipe file tidak valid');
    }
}
