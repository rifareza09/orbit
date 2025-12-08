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
        return Inertia::render('dashboard/puskaka');
    })->name('dashboard.puskaka');

    // Profil Ormawa (User menu)
    Route::get('/profil', function () {
        $user = Auth::user();
        // Demo data; replace with real fields when available
        $unit = [
            'nama' => $user->name ?? 'Unit Kegiatan Mahasiswa',
            'periode' => '2025/2026',
        ];
        $deskripsi = 'Smarakaryadhwani adalah UKM yang berfokus pada pengembangan di bidang seni, memiliki 5 divisi yaitu: Tari, Cinematography, Paduan Suara, Band, dan Perkusi.';
        $kepengurusan = [
            ['jabatan' => 'Ketua', 'nama' => 'Dilva Alya', 'prodi' => 'Psikologi', 'npm' => '1608223000'],
            ['jabatan' => 'Wakil Ketua', 'nama' => 'Yahdillah', 'prodi' => 'Teknik Informatika', 'npm' => '1408223000'],
            ['jabatan' => 'Sekretaris 1', 'nama' => 'Siti Zahrwa Ramadhani', 'prodi' => 'Perpustakaan dan Sains Informasi', 'npm' => '1508223000'],
            ['jabatan' => 'Sekretaris 2', 'nama' => 'Vania Al-Zena Salsabila Putri', 'prodi' => 'Perpustakaan dan Sains Informasi', 'npm' => '1008223000'],
            ['jabatan' => 'Bendahara', 'nama' => 'Naquita Aurora', 'prodi' => 'Ilmu Hukum', 'npm' => '1008223000'],
        ];
        $jadwal = [
            ['divisi' => 'Tari', 'hari' => 'Rabu', 'tempat' => 'Sekre Senam LLS', 'pukul' => '16:00 - 18:00'],
            ['divisi' => 'Cinematography', 'hari' => 'Kamis', 'tempat' => 'Lab Studio YARSI TV LLS', 'pukul' => '16:00 - 18:00'],
            ['divisi' => 'Paduan Suara', 'hari' => 'Rabu', 'tempat' => 'Sekre SMAKA LLS', 'pukul' => '16:00 - 18:00'],
            ['divisi' => 'Band', 'hari' => 'Selasa', 'tempat' => 'Sekre SMAKA LLS', 'pukul' => '16:00 - 18:00'],
            ['divisi' => 'Perkusi', 'hari' => 'Kamis', 'tempat' => 'Sekre Senam LLS', 'pukul' => '16:00 - 18:00'],
        ];

        return Inertia::render('profile/ormawa', [
            'unit' => $unit,
            'deskripsi' => $deskripsi,
            'kepengurusan' => $kepengurusan,
            'jadwal' => $jadwal,
        ]);
    })->name('profil.ormawa');

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

Route::middleware(['auth', 'verified'])->get('/program-kerja/indexPuskaka', function () {
    if (Auth::user()->role !== 'puskaka') abort(403);

    return Inertia::render('program-kerja/indexPuskaka');
})->name('program-kerja.indexPuskaka');

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
| Settings
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
