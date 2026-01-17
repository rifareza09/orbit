<?php

namespace App\Http\Controllers;

use App\Models\PengajuanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\NotificationService;

class ManajemenKegiatanController extends Controller
{
    /**
     * Display list of all pengajuan kegiatan from all ormawa with filters and statistics
     */
    public function index(Request $request)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Build query
        $query = PengajuanKegiatan::with(['user', 'programKerja']);

        // Filter: Tampilkan pengajuan yang sudah DIAJUKAN (semua status kecuali "Belum Diajukan")
        $query->where('status', '!=', 'Belum Diajukan');

        // Filter by tahun akademik (dari tanggal pelaksanaan)
        if ($request->filled('tahun_akademik')) {
            $tahun = $request->tahun_akademik;
            $query->whereYear('tanggal_pelaksanaan', $tahun);
        }

        // Filter by ormawa
        if ($request->filled('ormawa')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', $request->ormawa);
            });
        }

        // Search by nama kegiatan
        if ($request->filled('search')) {
            $query->where('nama_kegiatan', 'like', '%' . $request->search . '%');
        }

        $pengajuanKegiatan = $query
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pk) {
                return [
                    'id' => $pk->id,
                    'nama_kegiatan' => $pk->nama_kegiatan,
                    'ormawa' => $pk->user->name ?? '-',
                    'jenis' => $pk->programKerja->jenis_kegiatan ?? 'Lainnya',
                    'program_kerja' => $pk->programKerja->program_kerja ?? '-',
                    'ketua_pelaksana' => $pk->ketua_pelaksana,
                    'tanggal_pelaksanaan' => is_string($pk->tanggal_pelaksanaan) ? $pk->tanggal_pelaksanaan : $pk->tanggal_pelaksanaan->format('d/m/Y'),
                    'total_anggaran' => $pk->total_anggaran,
                    'status_review' => $pk->status_review,
                    'reviewed_at' => $pk->reviewed_at ? (is_string($pk->reviewed_at) ? $pk->reviewed_at : $pk->reviewed_at->format('d M Y')) : null,
                ];
            });

        // Calculate statistics - semua pengajuan yang sudah disubmit
        $totalPengajuan = PengajuanKegiatan::where('status', '!=', 'Belum Diajukan')->count();
        $perluDireview = PengajuanKegiatan::where('status', 'Diajukan')->count();
        $disetujui = PengajuanKegiatan::where('status', 'Disetujui')->count();
        $ditolak = PengajuanKegiatan::where('status', 'Ditolak')->count();

        // Get list of ormawa for filter
        $ormawaList = \App\Models\User::where('role', '!=', 'puskaka')
            ->select('name')
            ->distinct()
            ->orderBy('name')
            ->pluck('name');

        // Get tahun akademik options from existing data
        $tahunList = PengajuanKegiatan::selectRaw('DISTINCT YEAR(tanggal_pelaksanaan) as tahun')
            ->orderBy('tahun', 'desc')
            ->pluck('tahun')
            ->filter();

        return Inertia::render('manajemen-kegiatan/index', [
            'pengajuanKegiatan' => $pengajuanKegiatan,
            'statistik' => [
                'total_pengajuan' => $totalPengajuan,
                'perlu_direview' => $perluDireview,
                'disetujui' => $disetujui,
                'ditolak' => $ditolak,
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
     * Show detail of pengajuan kegiatan
     */
    public function show($id)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        $pengajuan = PengajuanKegiatan::with(['user', 'programKerja', 'itemPengajuanDana'])
            ->findOrFail($id);

        return Inertia::render('manajemen-kegiatan/detail', [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'nama_kegiatan' => $pengajuan->nama_kegiatan,
                'ormawa' => $pengajuan->user->name ?? '-',
                'program_kerja' => $pengajuan->programKerja->program_kerja ?? '-',
                'ketua_pelaksana' => $pengajuan->ketua_pelaksana,
                'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan,
                'jumlah_peserta' => $pengajuan->jumlah_peserta,
                'tanggal_pelaksanaan' => is_string($pengajuan->tanggal_pelaksanaan) ? $pengajuan->tanggal_pelaksanaan : $pengajuan->tanggal_pelaksanaan->format('d/m/Y'),
                'deskripsi' => $pengajuan->deskripsi,
                'total_anggaran' => $pengajuan->total_anggaran,
                'status_review' => $pengajuan->status_review,
                'catatan_puskaka' => $pengajuan->catatan_puskaka,
                'proposal_path' => $pengajuan->proposal_path,
                'created_at' => is_string($pengajuan->created_at) ? $pengajuan->created_at : $pengajuan->created_at->format('d/m/Y H:i'),
                'item_pengajuan_dana' => $pengajuan->itemPengajuanDana->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'nama_item' => $item->nama_item,
                        'kuantitas' => $item->kuantitas,
                        'harga_satuan' => $item->harga_satuan,
                        'total' => $item->kuantitas * $item->harga_satuan,
                    ];
                }),
            ]
        ]);
    }

    /**
     * Update status review and catatan
     */
    public function updateReview(Request $request, $id)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Validasi input
        $validated = $request->validate([
            'status_review' => 'required|in:Disetujui,Ditolak,Direvisi',
            'catatan_puskaka' => 'nullable|string|max:2000',
        ]);

        // Find pengajuan kegiatan
        $pengajuan = PengajuanKegiatan::findOrFail($id);

        // Update BOTH status dan status_review fields
        $pengajuan->update([
            'status' => $validated['status_review'],
            'status_review' => $validated['status_review'],
            'catatan_puskaka' => $validated['catatan_puskaka'] ?? null,
            'reviewed_at' => now(),
        ]);

        // Send notification to Ormawa
        NotificationService::notifyPengajuanKegiatanStatus(
            $pengajuan->user_id,
            $validated['status_review'],
            $pengajuan->nama_kegiatan,
            $pengajuan->id,
            $validated['catatan_puskaka'] ?? null
        );

        // Jika disetujui: auto-create LaporanKegiatan
        if ($pengajuan->status === 'Disetujui') {
            \App\Models\LaporanKegiatan::firstOrCreate(
                [
                    'pengajuan_kegiatan_id' => $pengajuan->id,
                    'user_id' => $pengajuan->user_id,
                ],
                [
                    'status' => 'Belum Diajukan',
                    'judul' => $pengajuan->nama_kegiatan,
                    'deskripsi' => $pengajuan->deskripsi,
                ]
            );
        }

        // Redirect dengan success message
        return redirect()
            ->route('manajemen-kegiatan.index')
            ->with('success', 'Review berhasil disimpan');
    }

    /**
     * Export data pengajuan kegiatan to Excel/CSV
     */
    public function export(Request $request)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Build query with same filters as index
        $query = PengajuanKegiatan::with(['user', 'programKerja']);
        $query->where('status', '!=', 'Belum Diajukan');

        if ($request->filled('tahun_akademik')) {
            $query->whereYear('tanggal_pelaksanaan', $request->tahun_akademik);
        }

        if ($request->filled('ormawa')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', $request->ormawa);
            });
        }

        if ($request->filled('search')) {
            $query->where('nama_kegiatan', 'like', '%' . $request->search . '%');
        }

        $data = $query->orderBy('created_at', 'desc')->get();

        // Generate CSV content
        $csvContent = "\xEF\xBB\xBF"; // BOM for UTF-8 Excel compatibility
        $csvContent .= "No,Nama Kegiatan,Ormawa,Jenis Kegiatan,Program Kerja,Ketua Pelaksana,Tanggal Pelaksanaan,Total Anggaran,Status Review\n";

        foreach ($data as $index => $pk) {
            $tanggal = is_string($pk->tanggal_pelaksanaan) ? $pk->tanggal_pelaksanaan : $pk->tanggal_pelaksanaan->format('d/m/Y');
            $csvContent .= implode(',', [
                $index + 1,
                '"' . str_replace('"', '""', $pk->nama_kegiatan) . '"',
                '"' . str_replace('"', '""', $pk->user->name ?? '-') . '"',
                '"' . str_replace('"', '""', $pk->programKerja->jenis_kegiatan ?? 'Lainnya') . '"',
                '"' . str_replace('"', '""', $pk->programKerja->program_kerja ?? '-') . '"',
                '"' . str_replace('"', '""', $pk->ketua_pelaksana) . '"',
                '"' . $tanggal . '"',
                $pk->total_anggaran ?? 0,
                '"' . ($pk->status_review ?? '-') . '"',
            ]) . "\n";
        }

        $filename = 'pengajuan_kegiatan_' . date('Y-m-d_His') . '.csv';

        return response($csvContent)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}
