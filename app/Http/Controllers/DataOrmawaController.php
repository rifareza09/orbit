<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ProgramKerja;
use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DataOrmawaController extends Controller
{
    /**
     * Reset akun ormawa: password baru + hapus data yang belum selesai
     */
    public function resetAkun(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // Check if user is puskaka
        if (Auth::user()->role !== 'puskaka') {
            return response()->json([
                'error' => 'Anda tidak memiliki izin untuk melakukan reset akun.'
            ], 403);
        }

        // Generate random password (8 chars: mix uppercase, lowercase, number, special)
        $newPassword = Str::random(4) . strtoupper(Str::random(2)) . random_int(10, 99) . '!';

        // Hapus hanya data yang belum selesai (status != Disetujui/Selesai)
        // Program Kerja yang belum disetujui
        ProgramKerja::where('user_id', $user->id)
            ->whereNotIn('status', ['Disetujui', 'Selesai'])
            ->delete();

        // Pengajuan Kegiatan yang belum disetujui
        PengajuanKegiatan::where('user_id', $user->id)
            ->whereNotIn('status', ['Disetujui', 'Selesai'])
            ->delete();

        // Laporan Kegiatan yang belum selesai
        LaporanKegiatan::where('user_id', $user->id)
            ->whereNotIn('status', ['Disetujui', 'Selesai'])
            ->delete();

        // Update password user
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Akun {$user->name} berhasil direset! Data yang sudah selesai tetap tersimpan.",
            'newPassword' => $newPassword,
            'username' => $user->username,
        ]);
    }
    /**
     * Toggle status ormawa (Aktif/Nonaktif)
     */
    public function toggleStatus(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);

            // Check if user is puskaka
            if (Auth::user()->role !== 'puskaka') {
                return response()->json([
                    'error' => 'Anda tidak memiliki izin untuk mengubah status ormawa.'
                ], 403);
            }

            // Validate request
            $validated = $request->validate([
                'status' => ['required', 'in:Aktif,Nonaktif'],
            ]);

            // Update status
            $user->update([
                'status' => $validated['status'],
            ]);

            return response()->json([
                'success' => true,
                'message' => "Status {$user->name} berhasil diubah menjadi {$validated['status']}!",
                'newStatus' => $validated['status'],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Ormawa tidak ditemukan.'
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => collect($e->errors())->flatten()->first() ?? 'Validasi gagal'
            ], 422);
        } catch (\Exception $e) {
            Log::error('Toggle status error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }}
