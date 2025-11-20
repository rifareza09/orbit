<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProgramKerjaController;

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
    Route::get('/dashboard', fn () => Inertia::render('dashboard/index'))->name('dashboard');
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
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/pengajuan-kegiatan', fn() => Inertia::render('pengajuan-kegiatan/index'))->name('pengajuan.kegiatan');
    Route::get('/pengajuan-kegiatan/detail', fn() => Inertia::render('pengajuan-kegiatan/detail'))->name('pengajuan.kegiatan.detail');
    Route::get('/pengajuan-kegiatan/buatProposal', fn() => Inertia::render('pengajuan-kegiatan/buatProposal'))->name('pengajuan.kegiatan.buatProposal');

    Route::get('/laporan-kegiatan', fn() => Inertia::render('laporan-kegiatan/index'))->name('laporan.kegiatan');

    Route::get('/dokumentasi', fn() => Inertia::render('dokumentasi/index'))->name('dokumentasi');
    Route::get('/prestasi', fn() => Inertia::render('prestasi/index'))->name('prestasi');
});

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
