<?php

namespace App\Http\Controllers;

use App\Models\ProgramKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PuskakaController extends Controller
{
    /**
     * Update status program kerja dari Puskaka
     */
    public function updateStatusProgramKerja(Request $request, $id)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Validasi input
        $validated = $request->validate([
            'status' => 'required|in:Belum Diajukan,Diajukan,Direview,Disetujui,Ditolak,Direvisi',
            'catatan_puskaka' => 'nullable|string|max:1000',
        ]);

        // Find program kerja
        $programKerja = ProgramKerja::findOrFail($id);

        // Update status dan catatan
        $programKerja->status = $validated['status'];
        $programKerja->catatan_puskaka = $validated['catatan_puskaka'] ?? null;
        $programKerja->reviewed_at = now();
        $programKerja->save();

        // Redirect back to index dengan success message
        return redirect()
            ->route('program-kerja.indexPuskaka')
            ->with('success', 'Status program kerja berhasil diperbarui');
    }
}
