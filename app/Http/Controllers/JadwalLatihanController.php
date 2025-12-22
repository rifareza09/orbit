<?php

namespace App\Http\Controllers;

use App\Models\JadwalLatihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class JadwalLatihanController extends Controller
{
    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('profile/jadwal-latihan/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'divisi' => 'required|string|max:255',
            'hari' => 'required|string|max:255',
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'required|date_format:H:i|after:waktu_mulai',
            'tempat' => 'required|string|max:255',        ], [
            'waktu_selesai.after' => 'Waktu selesai harus lebih besar dari waktu mulai.',
            'waktu_mulai.required' => 'Waktu mulai wajib diisi.',
            'waktu_selesai.required' => 'Waktu selesai wajib diisi.',
            'waktu_mulai.date_format' => 'Format waktu mulai tidak valid.',
            'waktu_selesai.date_format' => 'Format waktu selesai tidak valid.',        ], [
            'waktu_selesai.after' => 'Waktu selesai harus lebih besar dari waktu mulai.',
            'waktu_mulai.required' => 'Waktu mulai wajib diisi.',
            'waktu_selesai.required' => 'Waktu selesai wajib diisi.',
            'waktu_mulai.date_format' => 'Format waktu mulai tidak valid.',
            'waktu_selesai.date_format' => 'Format waktu selesai tidak valid.',
        ]);

        // Gabungkan waktu_mulai dan waktu_selesai menjadi format "HH:MM - HH:MM"
        $pukul = $validated['waktu_mulai'] . ' - ' . $validated['waktu_selesai'];

        JadwalLatihan::create([
            'user_id' => auth()->user()->id,
            'divisi' => $validated['divisi'],
            'hari' => $validated['hari'],
            'pukul' => $pukul,
            'tempat' => $validated['tempat'],
        ]);

        return redirect()->route('profile.ormawa')
            ->with('success', 'Jadwal latihan berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(JadwalLatihan $jadwalLatihan): Response
    {
        // Pastikan user hanya bisa lihat data miliknya sendiri
        if ($jadwalLatihan->user_id !== auth()->user()->id) {
            abort(403);
        }

        return Inertia::render('profile/jadwal-latihan/show', [
            'jadwal' => $jadwalLatihan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JadwalLatihan $jadwalLatihan): Response
    {
        // Pastikan user hanya bisa edit data miliknya sendiri
        if ($jadwalLatihan->user_id !== auth()->user()->id) {
            abort(403);
        }

        return Inertia::render('profile/jadwal-latihan/edit', [
            'jadwal' => $jadwalLatihan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JadwalLatihan $jadwalLatihan): RedirectResponse
    {
        // Pastikan user hanya bisa update data miliknya sendiri
        if ($jadwalLatihan->user_id !== auth()->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'divisi' => 'required|string|max:255',
            'hari' => 'required|string|max:255',
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'required|date_format:H:i|after:waktu_mulai',
            'tempat' => 'required|string|max:255',
        ], [
            'waktu_selesai.after' => 'Waktu selesai harus lebih besar dari waktu mulai.',
            'waktu_mulai.required' => 'Waktu mulai wajib diisi.',
            'waktu_selesai.required' => 'Waktu selesai wajib diisi.',
            'waktu_mulai.date_format' => 'Format waktu mulai tidak valid.',
            'waktu_selesai.date_format' => 'Format waktu selesai tidak valid.',
        ]);

        // Gabungkan waktu_mulai dan waktu_selesai menjadi format "HH:MM - HH:MM"
        $pukul = $validated['waktu_mulai'] . ' - ' . $validated['waktu_selesai'];

        $jadwalLatihan->update([
            'divisi' => $validated['divisi'],
            'hari' => $validated['hari'],
            'pukul' => $pukul,
            'tempat' => $validated['tempat'],
        ]);

        return redirect()->route('profile.ormawa')
            ->with('success', 'Jadwal latihan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JadwalLatihan $jadwalLatihan): RedirectResponse
    {
        // Pastikan user hanya bisa delete data miliknya sendiri
        if ($jadwalLatihan->user_id !== auth()->user()->id) {
            abort(403);
        }

        $jadwalLatihan->delete();

        return redirect()->route('profile.ormawa')
            ->with('success', 'Jadwal latihan berhasil dihapus!');
    }
}
