<?php

namespace App\Http\Controllers;

use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EvaluasiLaporanController extends Controller
{
    /**
     * Display list of all laporan kegiatan from all ormawa with filters and statistics
     */
    public function index(Request $request)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Build query
        $query = LaporanKegiatan::with(['user', 'pengajuanKegiatan']);

        // Filter by tahun akademik (dari tanggal laporan)
        if ($request->filled('tahun_akademik')) {
            $tahun = $request->tahun_akademik;
            $query->whereYear('created_at', $tahun);
        }

        // Filter by ormawa
        if ($request->filled('ormawa')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', $request->ormawa);
            });
        }

        // Search by nama kegiatan (from pengajuan_kegiatan)
        if ($request->filled('search')) {
            $query->whereHas('pengajuanKegiatan', function($q) use ($request) {
                $q->where('nama_kegiatan', 'like', '%' . $request->search . '%');
            });
        }

        $laporanKegiatan = $query
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($laporan) {
                $pengajuan = $laporan->pengajuanKegiatan;
                return [
                    'id' => $laporan->id,
                    'nama_kegiatan' => $pengajuan->nama_kegiatan ?? '-',
                    'ormawa' => $laporan->user->name ?? '-',
                    'jenis' => 'Akademik', // Default, bisa disesuaikan
                    'tanggal_pelaksanaan' => $pengajuan && $pengajuan->tanggal_pelaksanaan
                        ? (is_string($pengajuan->tanggal_pelaksanaan)
                            ? $pengajuan->tanggal_pelaksanaan
                            : $pengajuan->tanggal_pelaksanaan->format('d/m/Y'))
                        : '-',
                    'status' => $laporan->status,
                    'anggaran_disetujui' => $laporan->anggaran_disetujui,
                    'anggaran_realisasi' => $laporan->anggaran_realisasi,
                    'created_at' => is_string($laporan->created_at)
                        ? $laporan->created_at
                        : $laporan->created_at->format('d/m/Y'),
                ];
            });

        // Calculate statistics
        $kegiatanTerdaftar = LaporanKegiatan::count();
        $laporanMasuk = LaporanKegiatan::where('status', 'Diajukan')->count();
        $laporanDireview = LaporanKegiatan::where('status', 'Direview')->count();
        $laporanSelesai = LaporanKegiatan::where('status', 'Disetujui')->count();

        // Get list of ormawa for filter
        $ormawaList = \App\Models\User::where('role', '!=', 'puskaka')
            ->select('name')
            ->distinct()
            ->orderBy('name')
            ->pluck('name');

        // Get tahun akademik options from existing data, atau gunakan tahun sekarang dan sebelumnya
        $tahunListFromDb = LaporanKegiatan::selectRaw('DISTINCT YEAR(created_at) as tahun')
            ->orderBy('tahun', 'desc')
            ->pluck('tahun')
            ->filter();

        // Jika tidak ada data, gunakan tahun sekarang dan 2 tahun sebelumnya
        if ($tahunListFromDb->isEmpty()) {
            $currentYear = date('Y');
            $tahunList = collect([$currentYear, $currentYear - 1, $currentYear - 2]);
        } else {
            $tahunList = $tahunListFromDb;
        }

        return Inertia::render('evaluasi-laporan/index', [
            'laporanKegiatan' => $laporanKegiatan,
            'statistik' => [
                'kegiatan_terdaftar' => $kegiatanTerdaftar,
                'laporan_masuk' => $laporanMasuk,
                'laporan_direview' => $laporanDireview,
                'laporan_selesai' => $laporanSelesai,
            ],
            'filters' => [
                'tahun_akademik' => $request->tahun_akademik,
                'ormawa' => $request->ormawa,
                'search' => $request->search,
            ],
            'ormawaList' => $ormawaList,
            'tahunList' => $tahunList,
        ]);
    }

    /**
     * Show detail of laporan kegiatan
     */
    public function show($id)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        $laporan = LaporanKegiatan::with(['user', 'pengajuanKegiatan.itemPengajuanDana'])
            ->findOrFail($id);

        $pengajuan = $laporan->pengajuanKegiatan;

        return Inertia::render('evaluasi-laporan/detail', [
            'laporan' => [
                'id' => $laporan->id,
                'nama_kegiatan' => $pengajuan->nama_kegiatan ?? '-',
                'ormawa' => $laporan->user->name ?? '-',
                'ketua_pelaksana' => $pengajuan->ketua_pelaksana ?? '-',
                'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan ?? '-',
                'jumlah_peserta' => $pengajuan->jumlah_peserta ?? 0,
                'tanggal_pelaksanaan' => $pengajuan && $pengajuan->tanggal_pelaksanaan
                    ? (is_string($pengajuan->tanggal_pelaksanaan)
                        ? $pengajuan->tanggal_pelaksanaan
                        : $pengajuan->tanggal_pelaksanaan->format('d/m/Y'))
                    : '-',
                'anggaran_disetujui' => $laporan->anggaran_disetujui,
                'anggaran_realisasi' => $laporan->anggaran_realisasi,
                'ringkasan' => $laporan->ringkasan,
                'status' => $laporan->status,
                'catatan_puskaka' => $laporan->catatan_puskaka,
                'reviewed_at' => $laporan->reviewed_at ? (is_string($laporan->reviewed_at) ? $laporan->reviewed_at : $laporan->reviewed_at->format('d/m/Y H:i')) : null,
                'lpj_file' => $laporan->lpj_file,
                'bukti_pengeluaran' => $laporan->bukti_pengeluaran,
                'dokumentasi' => $laporan->dokumentasi,
                'created_at' => is_string($laporan->created_at)
                    ? $laporan->created_at
                    : $laporan->created_at->format('d/m/Y H:i'),
            ]
        ]);
    }

    /**
     * Update status laporan kegiatan
     */
    public function updateStatus(Request $request, $id)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Validasi input
        $validated = $request->validate([
            'status' => 'required|in:Belum Diajukan,Diajukan,Direview,Disetujui,Direvisi,Ditolak',
            'catatan_puskaka' => 'nullable|string|max:2000',
        ]);

        // Find laporan kegiatan
        $laporan = LaporanKegiatan::findOrFail($id);

        // Cek: jika status sudah Selesai (final), tidak boleh di-ubah lagi
        if ($laporan->status === 'Selesai') {
            return back()->withErrors(['status' => 'Laporan yang sudah selesai tidak bisa diubah statusnya lagi.']);
        }

        // Jika status "Disetujui", ubah menjadi "Selesai" untuk laporan
        $finalStatus = $validated['status'] === 'Disetujui' ? 'Selesai' : $validated['status'];

        // Update status, catatan, and reviewed_at
        $laporan->update([
            'status' => $finalStatus,
            'catatan_puskaka' => $validated['catatan_puskaka'] ?? $laporan->catatan_puskaka,
            'reviewed_at' => now(),
        ]);

        // Redirect ke index dengan success message
        return redirect()
            ->route('evaluasi-laporan.index')
            ->with('success', 'Status laporan berhasil diperbarui!');
    }
}

