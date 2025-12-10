<?php

namespace App\Http\Controllers;

use App\Models\Kepengurusan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class KepengurusanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $kepengurusan = Kepengurusan::where('user_id', auth()->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Profile/Kepengurusan/Index', [
            'kepengurusan' => $kepengurusan,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('profile/kepengurusan/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'jabatan' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'prodi' => 'required|string|max:255',
            'npm' => 'required|string|max:255',
        ]);

        Kepengurusan::create([
            'user_id' => auth()->user()->id,
            'jabatan' => $validated['jabatan'],
            'nama' => $validated['nama'],
            'prodi' => $validated['prodi'],
            'npm' => $validated['npm'],
        ]);

        return redirect()->route('profile.ormawa')
            ->with('success', 'Data kepengurusan berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Kepengurusan $kepengurusan): Response
    {
        // Pastikan user hanya bisa lihat data miliknya sendiri
        if ($kepengurusan->user_id !== auth()->user()->id) {
            abort(403);
        }

        return Inertia::render('profile/kepengurusan/show', [
            'kepengurusan' => $kepengurusan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kepengurusan $kepengurusan): Response
    {
        // Pastikan user hanya bisa edit data miliknya sendiri
        if ($kepengurusan->user_id !== auth()->user()->id) {
            abort(403);
        }

        return Inertia::render('profile/kepengurusan/edit', [
            'kepengurusan' => $kepengurusan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Kepengurusan $kepengurusan): RedirectResponse
    {
        // Pastikan user hanya bisa update data miliknya sendiri
        if ($kepengurusan->user_id !== auth()->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'jabatan' => 'required|string|max:255',
            'nama' => 'required|string|max:255',
            'prodi' => 'required|string|max:255',
            'npm' => 'required|string|max:255',
        ]);

        $kepengurusan->update($validated);

        return redirect()->route('profile.ormawa')
            ->with('success', 'Data kepengurusan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kepengurusan $kepengurusan): RedirectResponse
    {
        // Pastikan user hanya bisa delete data miliknya sendiri
        if ($kepengurusan->user_id !== auth()->user()->id) {
            abort(403);
        }

        $kepengurusan->delete();

        return redirect()->route('profile.ormawa')
            ->with('success', 'Data kepengurusan berhasil dihapus!');
    }
}
