<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProgramKerjaController;
use App\Http\Controllers\PengajuanKegiatanController;
use App\Http\Controllers\LaporanKegiatanController;
use App\Http\Controllers\DokumentasiController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\KepengurusanController;
use App\Http\Controllers\JadwalLatihanController;
use App\Http\Controllers\ProfileOrmawaController;

/*
|--------------------------------------------------------------------------
| Public Route
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    // Public landing showcasing Ormawa documentation and schedules
    $ormawaUsers = \App\Models\User::where('role', '!=', 'puskaka')
        ->orderBy('name')
        ->limit(8)
        ->get();

    $showcases = $ormawaUsers->map(function ($user) {
        $photos = \App\Models\Dokumentasi::where('user_id', $user->id)
            ->orderBy('tanggal_kegiatan', 'desc')
            ->limit(4)
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id,
                    'nama_kegiatan' => $d->nama_kegiatan,
                    'tanggal' => optional($d->tanggal_kegiatan)->format('Y-m-d'),
                    'foto_url' => $d->foto_path ? asset('storage/' . $d->foto_path) : null,
                ];
            });

        // Simple schedule: upcoming items from PengajuanKegiatan (if date fields exist), otherwise empty
        $schedules = \App\Models\PengajuanKegiatan::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'kegiatan' => $p->kegiatan ?? $p->judul ?? 'Kegiatan',
                    'waktu' => method_exists($p, 'getAttribute') && $p->getAttribute('tanggal_pelaksanaan')
                        ? optional($p->tanggal_pelaksanaan)->format('Y-m-d')
                        : (optional($p->created_at)->format('Y-m-d')),
                ];
            });

        return [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
            ],
            'photos' => $photos,
            'schedules' => $schedules,
        ];
    });

    return Inertia::render('landing/index', [
        'showcases' => $showcases,
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'puskaka') {
            return redirect()->route('dashboard.puskaka');
        }
        return Inertia::render('dashboard/index');
    })->name('dashboard');

    Route::get('/dashboard/puskaka', function () {
        if (Auth::user()->role !== 'puskaka') abort(403);

        // Fetch ALL program kerja dari semua ormawa (tidak filter status dulu)
        $programKerjas = \App\Models\ProgramKerja::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($pk) {
                return [
                    'id' => $pk->id,
                    'program_kerja' => $pk->program_kerja,
                    'kegiatan' => $pk->kegiatan,
                    'deskripsi_kegiatan' => $pk->deskripsi_kegiatan,
                    'jenis_kegiatan' => $pk->jenis_kegiatan,
                    'estimasi_anggaran' => $pk->estimasi_anggaran,
                    'status' => $pk->status,
                    'ormawa' => $pk->user->name ?? '-',
                    'created_at' => $pk->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('dashboard/puskaka', [
            'programKerjas' => $programKerjas
        ]);
    })->name('dashboard.puskaka');

    // Profil Ormawa (User menu)
    Route::get('/profil', function () {
        $user = Auth::user();

        $unit = [
            'nama' => $user->name ?? 'Unit Kegiatan Mahasiswa',
            'periode' => $user->periode ?? '2025/2026',
        ];

        $deskripsi = $user->deskripsi ?? '';

        // Get kepengurusan dari database
        $kepengurusan = \App\Models\Kepengurusan::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc')
            ->get();

        // Get jadwal latihan dari database
        $jadwal = \App\Models\JadwalLatihan::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('profile/ormawa', [
            'unit' => $unit,
            'deskripsi' => $deskripsi,
            'kepengurusan' => $kepengurusan,
            'jadwal' => $jadwal,
            'logo_url' => $user->logo_path ? asset('storage/' . $user->logo_path) : null,
        ]);
    })->name('profile.ormawa');

    // Edit Profil Ormawa
    Route::get('/profil/edit', [ProfileOrmawaController::class, 'edit'])->name('profile.ormawa.edit');
    Route::post('/profil/update', [ProfileOrmawaController::class, 'update'])->name('profile.ormawa.update');

    // Manajemen Kegiatan (Puskaka Only)
    Route::get('/manajemen-kegiatan', function () {
        if (Auth::user()->role !== 'puskaka') abort(403);
        return Inertia::render('manajemen-kegiatan/index');
    })->name('manajemen.kegiatan');

    Route::get('/manajemen-kegiatan/detail/{id}', function () {
    return Inertia::render('manajemen-kegiatan/detail');

    });

    Route::middleware(['auth', 'verified'])->get('/evaluasi-laporan', function () {
    if (Auth::user()->role !== 'puskaka') abort(403);
    return Inertia::render('evaluasi-laporan/index');
})->name('evaluasi.laporan');


Route::middleware(['auth', 'verified'])->get('/evaluasi-laporan/detail/{id}', function ($id) {
    if (Auth::user()->role !== 'puskaka') abort(403);

    return Inertia::render('evaluasi-laporan/detail', [
        'id' => $id
    ]);
});

Route::middleware(['auth', 'verified'])->get('/data-ormawa', function () {
    if (Auth::user()->role !== 'puskaka') abort(403);

    return Inertia::render('data-ormawa/index');
})->name('data.ormawa');

Route::middleware(['auth', 'verified'])->get('/data-ormawa/detail/{id}', function ($id) {
    if (Auth::user()->role !== 'puskaka') abort(403);

    return Inertia::render('data-ormawa/detail', [
        'id' => $id
    ]);
})->name('data.ormawa.detail');

Route::middleware(['auth', 'verified'])->get('/program-kerja/indexPuskaka', function () {
    if (Auth::user()->role !== 'puskaka') abort(403);

    // Fetch program kerja dengan status Diajukan
    $programKerjas = \App\Models\ProgramKerja::with('user')
        ->where('status', 'Diajukan')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($pk) {
            return [
                'id' => $pk->id,
                'program_kerja' => $pk->program_kerja,
                'kegiatan' => $pk->kegiatan,
                'deskripsi_kegiatan' => $pk->deskripsi_kegiatan,
                'jenis_kegiatan' => $pk->jenis_kegiatan,
                'estimasi_anggaran' => $pk->estimasi_anggaran,
                'status' => $pk->status,
                'ormawa' => $pk->user->name ?? '-',
                'user_id' => $pk->user_id,
                'created_at' => $pk->created_at->format('d M Y'),
            ];
        });

    return Inertia::render('program-kerja/indexPuskaka', [
        'programKerjas' => $programKerjas
    ]);
})->name('program-kerja.indexPuskaka');

Route::middleware(['auth', 'verified'])->get('/program-kerja/{id}/detail-puskaka', function ($id) {
    if (Auth::user()->role !== 'puskaka') abort(403);

    $programKerja = \App\Models\ProgramKerja::with('user')->findOrFail($id);

    return Inertia::render('program-kerja/detailPuskaka', [
        'programKerja' => [
            'id' => $programKerja->id,
            'program_kerja' => $programKerja->program_kerja,
            'kegiatan' => $programKerja->kegiatan,
            'deskripsi_kegiatan' => $programKerja->deskripsi_kegiatan,
            'jenis_kegiatan' => $programKerja->jenis_kegiatan,
            'estimasi_anggaran' => $programKerja->estimasi_anggaran,
            'status' => $programKerja->status,
            'catatan_puskaka' => $programKerja->catatan_puskaka,
            'ormawa' => $programKerja->user->name ?? '-',
            'user_id' => $programKerja->user_id,
            'created_at' => $programKerja->created_at->format('d/m/Y H:i'),
        ]
    ]);
})->name('program-kerja.detailPuskaka');

Route::middleware(['auth', 'verified'])->post('/program-kerja/{id}/update-status', [
    \App\Http\Controllers\PuskakaController::class,
    'updateStatusProgramKerja'
])->name('program-kerja.updateStatus');

// Manajemen Kegiatan Routes (Puskaka)
Route::middleware(['auth', 'verified'])->get('/manajemen-kegiatan', [
    \App\Http\Controllers\ManajemenKegiatanController::class,
    'index'
])->name('manajemen-kegiatan.index');

Route::middleware(['auth', 'verified'])->get('/manajemen-kegiatan/detail/{id}', [
    \App\Http\Controllers\ManajemenKegiatanController::class,
    'show'
])->name('manajemen-kegiatan.detail');

Route::middleware(['auth', 'verified'])->post('/manajemen-kegiatan/{id}/update-review', [
    \App\Http\Controllers\ManajemenKegiatanController::class,
    'updateReview'
])->name('manajemen-kegiatan.updateReview');

/*
|--------------------------------------------------------------------------
| Evaluasi & Laporan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->get('/evaluasi-laporan', [
    \App\Http\Controllers\EvaluasiLaporanController::class,
    'index'
])->name('evaluasi-laporan.index');

Route::middleware(['auth', 'verified'])->get('/evaluasi-laporan/detail/{id}', [
    \App\Http\Controllers\EvaluasiLaporanController::class,
    'show'
])->name('evaluasi-laporan.detail');

Route::middleware(['auth', 'verified'])->post('/evaluasi-laporan/{id}/update-status', [
    \App\Http\Controllers\EvaluasiLaporanController::class,
    'updateStatus'
])->name('evaluasi-laporan.updateStatus');

});


/*
|--------------------------------------------------------------------------
| Program Kerja
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('program-kerja')->group(function () {
    // Route untuk menampilkan daftar program kerja
    Route::get('/', [ProgramKerjaController::class, 'index'])->name('program-kerja.index');

    // Route untuk menambahkan program kerja
    Route::get('/tambah', [ProgramKerjaController::class, 'create'])->name('program-kerja.tambah');
    Route::post('/', [ProgramKerjaController::class, 'store'])->name('program-kerja.store');

    // Route untuk menampilkan detail program kerja
    Route::get('/detail/{id}', [ProgramKerjaController::class, 'show'])->name('program-kerja.detail');

    // Route untuk edit program kerja
    Route::get('/edit/{id}', [ProgramKerjaController::class, 'edit'])->name('program-kerja.edit');
    Route::put('/{id}', [ProgramKerjaController::class, 'update'])->name('program-kerja.update');

    // Menambahkan route untuk tombol ajukan
Route::put('/ajukan/{id}', [ProgramKerjaController::class, 'ajukan'])->name('program-kerja.ajukan');

    // Route untuk menghapus program kerja
    Route::delete('/{id}', [ProgramKerjaController::class, 'destroy'])->name('program-kerja.destroy');

});

/*
|--------------------------------------------------------------------------
| Routes Lain (Jika perlu ditutup auth, silakan dipindah)
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Pengajuan Kegiatan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('pengajuan-kegiatan')->group(function () {
    Route::get('/', [PengajuanKegiatanController::class, 'index'])->name('pengajuan.kegiatan.index');
    Route::get('/detail/{id}', [PengajuanKegiatanController::class, 'show'])->name('pengajuan.kegiatan.detail');
    Route::get('/buatProposal', [PengajuanKegiatanController::class, 'create'])->name('pengajuan.kegiatan.buatProposal');
    Route::post('/', [PengajuanKegiatanController::class, 'store'])->name('pengajuan.kegiatan.store');
    Route::get('/edit/{id}', [PengajuanKegiatanController::class, 'edit'])->name('pengajuan.kegiatan.edit');
    Route::put('/{id}', [PengajuanKegiatanController::class, 'update'])->name('pengajuan.kegiatan.update');
    Route::put('/ajukan/{id}', [PengajuanKegiatanController::class, 'ajukan'])->name('pengajuan.kegiatan.ajukan');
    Route::delete('/{id}', [PengajuanKegiatanController::class, 'destroy'])->name('pengajuan.kegiatan.destroy');
});

/*
|--------------------------------------------------------------------------
| Laporan Kegiatan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('laporan-kegiatan')->group(function () {
    Route::get('/', [LaporanKegiatanController::class, 'index'])->name('laporan.index');

    // Create routes (specific paths first)
    Route::get('/buatlaporanKegiatan/{pengajuan}', [LaporanKegiatanController::class, 'create'])->name('laporan.create');
    Route::post('/', [LaporanKegiatanController::class, 'store'])->name('laporan.store');

    // Detail, Edit, Download routes (specific paths first)
    Route::get('/detail/{id}', [LaporanKegiatanController::class, 'show'])->name('laporan.detail');
    Route::get('/edit/{id}', [LaporanKegiatanController::class, 'edit'])->name('laporan.edit');
    Route::get('/download/{id}/{type}', [LaporanKegiatanController::class, 'download'])->name('laporan.download');

    // Update and Delete routes (general patterns last)
    Route::put('/update/{id}', [LaporanKegiatanController::class, 'update'])->name('laporan.update');
    Route::delete('/delete/{id}', [LaporanKegiatanController::class, 'destroy'])->name('laporan.destroy');

    // Ajukan laporan
    Route::post('/ajukan/{id}', [LaporanKegiatanController::class, 'ajukan'])->name('laporan.ajukan');
});

/*
|--------------------------------------------------------------------------
| Dokumentasi & Prestasi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('dokumentasi')->group(function () {
    Route::get('/', [DokumentasiController::class, 'index'])->name('dokumentasi.index');
    Route::get('/buat', [DokumentasiController::class, 'create'])->name('dokumentasi.create');
    Route::post('/', [DokumentasiController::class, 'store'])->name('dokumentasi.store');
    Route::delete('/{id}', [DokumentasiController::class, 'destroy'])->name('dokumentasi.destroy');
});

/*
|--------------------------------------------------------------------------
| Prestasi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('prestasi')->group(function () {
    Route::get('/', [PrestasiController::class, 'index'])->name('prestasi.index');
    Route::get('/tambah', [PrestasiController::class, 'create'])->name('prestasi.create');
    Route::post('/', [PrestasiController::class, 'store'])->name('prestasi.store');
    Route::delete('/{id}', [PrestasiController::class, 'destroy'])->name('prestasi.destroy');
    Route::get('/download/{id}', [PrestasiController::class, 'download'])->name('prestasi.download');
});

/*
|--------------------------------------------------------------------------
| Kepengurusan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('profile/kepengurusan')->group(function () {
    Route::get('/create', [KepengurusanController::class, 'create'])->name('kepengurusan.create');
    Route::post('/', [KepengurusanController::class, 'store'])->name('kepengurusan.store');
    Route::get('/{kepengurusan}', [KepengurusanController::class, 'show'])->name('kepengurusan.show');
    Route::get('/{kepengurusan}/edit', [KepengurusanController::class, 'edit'])->name('kepengurusan.edit');
    Route::put('/{kepengurusan}', [KepengurusanController::class, 'update'])->name('kepengurusan.update');
    Route::delete('/{kepengurusan}', [KepengurusanController::class, 'destroy'])->name('kepengurusan.destroy');
});

/*
|--------------------------------------------------------------------------
| Jadwal Latihan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('profile/jadwal-latihan')->group(function () {
    Route::get('/create', [JadwalLatihanController::class, 'create'])->name('jadwal-latihan.create');
    Route::post('/', [JadwalLatihanController::class, 'store'])->name('jadwal-latihan.store');
    Route::get('/{jadwalLatihan}', [JadwalLatihanController::class, 'show'])->name('jadwal-latihan.show');
    Route::get('/{jadwalLatihan}/edit', [JadwalLatihanController::class, 'edit'])->name('jadwal-latihan.edit');
    Route::put('/{jadwalLatihan}', [JadwalLatihanController::class, 'update'])->name('jadwal-latihan.update');
    Route::delete('/{jadwalLatihan}', [JadwalLatihanController::class, 'destroy'])->name('jadwal-latihan.destroy');
});

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
