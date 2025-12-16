<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ProgramKerja;
use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DataOrmawaController extends Controller
{
    /**
     * Reset akun ormawa: password baru + hapus semua data
     */
    public function resetAkun(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // Check if user is puskaka
        if (auth()->user()->role !== 'puskaka') {
            return response()->json([
                'error' => 'Anda tidak memiliki izin untuk melakukan reset akun.'
            ], 403);
        }

        // Generate random password (8 chars: mix uppercase, lowercase, number, special)
        $newPassword = Str::random(4) . strtoupper(Str::random(2)) . random_int(10, 99) . '!';

        // Hapus semua data ormawa
        ProgramKerja::where('user_id', $user->id)->delete();
        PengajuanKegiatan::where('user_id', $user->id)->delete();
        LaporanKegiatan::where('user_id', $user->id)->delete();

        // Update password user
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Akun {$user->name} berhasil direset!",
            'newPassword' => $newPassword,
            'username' => $user->username,
        ]);
    }
}
