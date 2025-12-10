<?php

namespace App\Http\Controllers;

use App\Models\JadwalLatihan;
use Illuminate\Http\Request;
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
            'pukul' => 'required|string|max:255',
            'tempat' => 'required|string|max:255',
        ]);

        JadwalLatihan::create([
            'user_id' => auth()->user()->id,
            'divisi' => $validated['divisi'],
            'hari' => $validated['hari'],
            'pukul' => $validated['pukul'],
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
            'pukul' => 'required|string|max:255',
            'tempat' => 'required|string|max:255',
        ]);

        $jadwalLatihan->update($validated);

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
