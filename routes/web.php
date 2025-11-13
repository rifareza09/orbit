<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
// Laravel: Lewatkan sementara middleware auth
Route::get('/dashboard', function () {
    return Inertia::render('dashboard/index');
});

Route::get('/dashboard', fn() => Inertia::render('dashboard/index'))->name('dashboard');
Route::get('/program-kerja', fn() => Inertia::render('program-kerja/index'))->name('program.kerja');
Route::get('/pengajuan-kegiatan', fn() => Inertia::render('pengajuan-kegiatan/index'))->name('pengajuan.kegiatan');
Route::get('/laporan-kegiatan', action: fn() => Inertia::render('laporan-kegiatan/index'))->name('laporan.kegiatan');
Route::get('/dokumentasi', fn() => Inertia::render('dokumentasi/index'))->name('dokumentasi');
Route::get('/prestasi', action: fn() => Inertia::render('prestasi/index'))->name('prestasi');
Route::get('/program-kerja', fn() => Inertia::render('program-kerja/index'))->name('program.kerja');
Route::get('/program-kerja/tambah', fn() => Inertia::render('program-kerja/tambah'))->name('program.kerja.tambah');


require __DIR__.'/settings.php';
