<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ProfileOrmawaController extends Controller
{
    /**
     * Show the form for editing the profile.
     */
    public function edit(): Response
    {
        $user = Auth::user();

        return Inertia::render('profile/edit-ormawa', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'periode' => $user->periode,
                'deskripsi' => $user->deskripsi,
                'logo_path' => $user->logo_path,
                'logo_url' => $user->logo_path ? asset('storage/' . $user->logo_path) : null,
            ],
        ]);
    }

    /**
     * Update the profile.
     */
    public function update(Request $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'periode' => 'nullable|string|max:255',
            'deskripsi' => 'nullable|string',
            'logo' => 'nullable|image|mimes:png,jpg,jpeg|max:5120', // 5MB
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($user->logo_path) {
                Storage::disk('public')->delete($user->logo_path);
            }

            // Store new logo
            $logoPath = $request->file('logo')->store('logos', 'public');
            $validated['logo_path'] = $logoPath;
        }

        // Remove logo from validated data as we handle it separately
        unset($validated['logo']);

        // Update user
        $user->update($validated);

        return redirect()->route('profile.ormawa')
            ->with('success', 'Profil berhasil diperbarui!');
    }
}
