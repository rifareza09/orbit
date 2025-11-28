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
    return Inertia::render('welcome', [
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
