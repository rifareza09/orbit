<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LaporanKegiatan;
use App\Models\PengajuanKegiatan;
use App\Models\Dokumentasi;
use App\Models\JadwalLatihan;
use App\Models\Prestasi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LandingController extends Controller
{
    /**
     * Show landing page with ormawa list and latest activities
     */
    public function index()
    {
        // Get all ormawa (non-puskaka users)
        $ormawaUsers = User::where('role', '!=', 'puskaka')
            ->orderBy('name')
            ->get();

        // Map ormawa with their data
        $ormawas = $ormawaUsers->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'logo_url' => $user->logo_path ? asset('storage/' . $user->logo_path) : null,
            ];
        });

        // Get latest kegiatan (LaporanKegiatan yang sudah disetujui)
        $latestKegiatan = LaporanKegiatan::with(['pengajuanKegiatan.programKerja', 'user'])
            ->where('status', 'Disetujui')
            ->orderBy('updated_at', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($laporan) {
                $pengajuan = $laporan->pengajuanKegiatan;
                return [
                    'id' => $laporan->id,
                    'nama_kegiatan' => $pengajuan->nama_kegiatan ?? '-',
                    'ormawa' => $laporan->user->name ?? '-',
                    'tanggal_pelaksanaan' => $pengajuan && $pengajuan->tanggal_pelaksanaan
                        ? (is_string($pengajuan->tanggal_pelaksanaan)
                            ? $pengajuan->tanggal_pelaksanaan
                            : $pengajuan->tanggal_pelaksanaan->format('d/m/Y'))
                        : '-',
                    'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan ?? 'Kampus YARSI',
                    'status' => $laporan->status,
                ];
            });

        return Inertia::render('landing/index', [
            'ormawas' => $ormawas,
            'latestKegiatan' => $latestKegiatan,
            'canRegister' => config('fortify.registration'),
        ]);
    }

    /**
     * Show detail organisasi dengan kegiatan, jadwal latihan, dan dokumentasi
     */
    public function showOrmawa($id)
    {
        $user = User::where('id', $id)
            ->where('role', '!=', 'puskaka')
            ->firstOrFail();

        // Get kegiatan dari laporan kegiatan yang disetujui
        $kegiatan = LaporanKegiatan::with('pengajuanKegiatan')
            ->where('user_id', $id)
            ->where('status', 'Disetujui')
            ->orderBy('updated_at', 'desc')
            ->get()
            ->map(function ($laporan) {
                $pengajuan = $laporan->pengajuanKegiatan;
                return [
                    'id' => $laporan->id,
                    'nama_kegiatan' => $pengajuan->nama_kegiatan ?? '-',
                    'tanggal_pelaksanaan' => $pengajuan && $pengajuan->tanggal_pelaksanaan
                        ? (is_string($pengajuan->tanggal_pelaksanaan)
                            ? $pengajuan->tanggal_pelaksanaan
                            : $pengajuan->tanggal_pelaksanaan->format('d/m/Y'))
                        : '-',
                    'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan ?? '-',
                    'deskripsi' => $pengajuan->deskripsi ?? '-',
                ];
            });

        // Get jadwal latihan
        $jadwalLatihan = JadwalLatihan::where('user_id', $id)
            ->orderBy('hari', 'asc')
            ->get()
            ->map(function ($jadwal) {
                return [
                    'id' => $jadwal->id,
                    'divisi' => $jadwal->divisi,
                    'hari' => $jadwal->hari,
                    'pukul' => $jadwal->pukul,
                    'tempat' => $jadwal->tempat ?? 'TBD',
                ];
            });

        // Get dokumentasi
        $dokumentasi = Dokumentasi::where('user_id', $id)
            ->orderBy('tanggal_kegiatan', 'desc')
            ->get()
            ->map(function ($doc) {
                return [
                    'id' => $doc->id,
                    'nama_kegiatan' => $doc->nama_kegiatan,
                    'tanggal_kegiatan' => $doc->tanggal_kegiatan ? (is_string($doc->tanggal_kegiatan) ? $doc->tanggal_kegiatan : $doc->tanggal_kegiatan->format('d/m/Y')) : '-',
                    'foto_url' => $doc->foto_path ? asset('storage/' . $doc->foto_path) : null,
                ];
            });

        // Get prestasi
        $prestasi = Prestasi::where('user_id', $id)
            ->orderBy('tanggal_perolehan', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama_prestasi' => $p->nama_prestasi,
                    'jenis_prestasi' => $p->jenis_prestasi,
                    'tingkat_kejuaraan' => $p->tingkat_kejuaraan,
                    'nama_peraih' => $p->nama_peraih,
                    'tanggal_perolehan' => $p->tanggal_perolehan ? (is_string($p->tanggal_perolehan) ? $p->tanggal_perolehan : $p->tanggal_perolehan->format('d/m/Y')) : '-',
                    'bukti_path' => $p->bukti_path ? asset('storage/' . $p->bukti_path) : null,
                ];
            });

        return Inertia::render('landing/ormawa-detail', [
            'ormawa' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
                'deskripsi' => $user->deskripsi ?? 'Organisasi mahasiswa yang aktif mengadakan kegiatan.',
            ],
            'kegiatan' => $kegiatan,
            'jadwalLatihan' => $jadwalLatihan,
            'dokumentasi' => $dokumentasi,
            'prestasi' => $prestasi,
        ]);
    }
}
