<?php

namespace App\Http\Controllers;

use App\Models\ProgramKerja;
use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
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

        // Validasi input: hanya Disetujui, Ditolak, Direvisi
        $validated = $request->validate([
            'status' => 'required|in:Disetujui,Ditolak,Direvisi',
            'catatan_puskaka' => 'nullable|string|max:1000',
        ]);

        // Find program kerja
        $programKerja = ProgramKerja::findOrFail($id);

        $newStatus = $validated['status'];

        // Jika Ditolak atau Direvisi, catatan wajib
        if (in_array($newStatus, ['Ditolak', 'Direvisi']) && empty($validated['catatan_puskaka'])) {
            return back()->withErrors(['catatan_puskaka' => 'Catatan wajib diisi ketika menolak atau merevisi.']);
        }

        // Update status dan catatan
        $programKerja->status = $newStatus;
        $programKerja->catatan_puskaka = $validated['catatan_puskaka'] ?? null;
        $programKerja->reviewed_at = now();
        $programKerja->save();

        // Jika disetujui: buat/siapkan PengajuanKegiatan terkait agar ormawa bisa lanjut
        if ($newStatus === 'Disetujui') {
            \App\Models\PengajuanKegiatan::firstOrCreate(
                [
                    'program_kerja_id' => $programKerja->id,
                    'user_id' => $programKerja->user_id,
                ],
                [
                    'status' => 'Belum Diajukan',
                    'nama_kegiatan' => $programKerja->kegiatan ?? $programKerja->program_kerja,
                    'ketua_pelaksana' => '-', // Placeholder, bisa diedit ormawa nanti
                    'tempat_pelaksanaan' => '-', // Placeholder, bisa diedit ormawa nanti
                    'tanggal_pelaksanaan' => now()->addMonth(), // Default 1 bulan ke depan
                    'deskripsi' => $programKerja->deskripsi_kegiatan,
                    'total_anggaran' => $programKerja->estimasi_anggaran,
                ]
            );
        }

        // Redirect back to index dengan success message
        return redirect()
            ->route('program-kerja.detailPuskaka', ['id' => $programKerja->id])
            ->with('success', 'Status program kerja diperbarui menjadi ' . $programKerja->status);
    }

    /**
     * Update status pengajuan kegiatan dari Puskaka
     */
    public function updateStatusPengajuanKegiatan(Request $request, $id)
    {
        // Cek role puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        // Validasi input: hanya Disetujui, Ditolak, Direvisi
        $validated = $request->validate([
            'status' => 'required|in:Disetujui,Ditolak,Direvisi',
            'catatan_puskaka' => 'nullable|string|max:1000',
        ]);

        // Find pengajuan kegiatan
        $pengajuan = PengajuanKegiatan::findOrFail($id);

        $newStatus = $validated['status'];

        // Jika Ditolak atau Direvisi, catatan wajib
        if (in_array($newStatus, ['Ditolak', 'Direvisi']) && empty($validated['catatan_puskaka'])) {
            return back()->withErrors(['catatan_puskaka' => 'Catatan wajib diisi ketika menolak atau merevisi.']);
        }

        // Update status dan catatan
        $pengajuan->status = $newStatus;
        $pengajuan->catatan_puskaka = $validated['catatan_puskaka'] ?? null;
        $pengajuan->reviewed_at = now();
        $pengajuan->save();

        // Jika disetujui: auto-create LaporanKegiatan
        if ($newStatus === 'Disetujui') {
            LaporanKegiatan::firstOrCreate(
                [
                    'pengajuan_kegiatan_id' => $pengajuan->id,
                    'user_id' => $pengajuan->user_id,
                ],
                [
                    'status' => 'Belum Diajukan',
                    'judul' => $pengajuan->nama_kegiatan,
                    'deskripsi' => $pengajuan->deskripsi,
                ]
            );
        }

        // Redirect back dengan success message
        return redirect()
            ->back()
            ->with('success', 'Status pengajuan kegiatan diperbarui menjadi ' . $pengajuan->status);
    }
}
