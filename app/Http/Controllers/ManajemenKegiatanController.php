<?php

namespace App\Http\Controllers;

use App\Models\PengajuanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
                    'jenis' => 'Akademik', // Default, bisa disesuaikan
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
}
