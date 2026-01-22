<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ProgramKerja;
use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
use App\Models\ArsipTahunan;
use App\Models\Kepengurusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Str;

class DataOrmawaController extends Controller
{
    /**
     * Reset akun ormawa: password baru + arsipkan & hapus data yang belum selesai
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

        try {
            DB::beginTransaction();

            // Validasi password baru dari puskaka
            $validated = $request->validate([
                'newPassword' => 'required|string|min:8',
                'catatan' => 'nullable|string',
            ]);

            $newPassword = $validated['newPassword'];

            // === ARSIPKAN DATA SEBELUM DIHAPUS ===

            // Ambil SEMUA data (tidak peduli status - fresh account)
            $programKerjaToDelete = ProgramKerja::where('user_id', $user->id)
                ->get()
                ->map(function($pk) {
                    return [
                        'id' => $pk->id,
                        'program_kerja' => $pk->program_kerja,
                        'kegiatan' => $pk->kegiatan,
                        'estimasi_anggaran' => $pk->estimasi_anggaran,
                        'status' => $pk->status,
                        'created_at' => $pk->created_at->format('Y-m-d H:i:s'),
                    ];
                })
                ->toArray();

            $pengajuanToDelete = PengajuanKegiatan::with('itemPengajuanDana')
                ->where('user_id', $user->id)
                ->get()
                ->map(function($p) {
                    return [
                        'id' => $p->id,
                        'nama_kegiatan' => $p->nama_kegiatan,
                        'ketua_pelaksana' => $p->ketua_pelaksana,
                        'tempat_pelaksanaan' => $p->tempat_pelaksanaan,
                        'tanggal_pelaksanaan' => $p->tanggal_pelaksanaan,
                        'jumlah_peserta' => $p->jumlah_peserta,
                        'deskripsi' => $p->deskripsi,
                        'status' => $p->status,
                        'status_review' => $p->status_review,
                        'item_pengajuan_dana' => $p->itemPengajuanDana->map(function($item) {
                            return [
                                'nama_item' => $item->nama_item,
                                'deskripsi_item' => $item->deskripsi_item,
                                'quantity' => $item->quantity,
                                'harga_satuan' => $item->harga_satuan,
                            ];
                        })->toArray(),
                        'created_at' => $p->created_at->format('Y-m-d H:i:s'),
                    ];
                })
                ->toArray();

            $laporanToDelete = LaporanKegiatan::with('pengajuanKegiatan')
                ->where('user_id', $user->id)
                ->get()
                ->map(function($l) {
                    return [
                        'id' => $l->id,
                        'nama_kegiatan' => $l->pengajuanKegiatan->nama_kegiatan ?? '-',
                        'ringkasan' => $l->ringkasan,
                        'catatan' => $l->catatan,
                        'status' => $l->status,
                        'created_at' => $l->created_at->format('Y-m-d H:i:s'),
                    ];
                })
                ->toArray();

            // Simpan ke arsip jika ada data yang dihapus
            if (!empty($programKerjaToDelete) || !empty($pengajuanToDelete) || !empty($laporanToDelete)) {
                ArsipTahunan::create([
                    'user_id' => $user->id,
                    'nama_ormawa' => $user->name,
                    'tahun_arsip' => now()->year,
                    'tanggal_reset' => now(),
                    'reset_by' => Auth::user()->username,
                    'data_program_kerja' => $programKerjaToDelete,
                    'data_pengajuan_kegiatan' => $pengajuanToDelete,
                    'data_laporan_kegiatan' => $laporanToDelete,
                    'catatan' => $request->catatan ?? null,
                ]);
            }

            // === HAPUS DATA ===

            // Hapus SEMUA Program Kerja (fresh account)
            ProgramKerja::where('user_id', $user->id)->delete();

            // Hapus SEMUA Pengajuan Kegiatan (fresh account)
            PengajuanKegiatan::where('user_id', $user->id)->delete();

            // Hapus SEMUA Laporan Kegiatan (fresh account)
            LaporanKegiatan::where('user_id', $user->id)->delete();

            // Update password user
            $user->update([
                'password' => Hash::make($newPassword),
            ]);

            DB::commit();

            $jumlahDiarsipkan = count($programKerjaToDelete) + count($pengajuanToDelete) + count($laporanToDelete);

            return response()->json([
                'success' => true,
                'message' => "Akun {$user->name} berhasil direset! {$jumlahDiarsipkan} data diarsipkan. Dokumentasi dan Prestasi tetap tersimpan.",
                'newPassword' => $newPassword,
                'username' => $user->username,
                'arsip_count' => $jumlahDiarsipkan,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Reset akun error: ' . $e->getMessage());

            return response()->json([
                'error' => 'Terjadi kesalahan saat reset akun: ' . $e->getMessage()
            ], 500);
        }
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
    }

    /**
     * Export data ormawa ke Excel (CSV format)
     */
    public function export()
    {
        // Query data ormawa
        $ormawaList = User::where('role', '!=', 'puskaka')
            ->orderBy('name')
            ->get();

        // Siapkan data untuk CSV
        $csvData = [];
        
        // Header
        $csvData[] = [
            'No',
            'Nama Organisasi',
            'Username',
            'Jenis',
            'Ketua',
            'Jumlah Anggota',
            'Status',
            'Periode',
            'Deskripsi'
        ];

        // Data rows
        $no = 1;
        foreach ($ormawaList as $user) {
            // Ambil nama ketua
            $ketuaKepengurusan = Kepengurusan::where('user_id', $user->id)
                ->where('jabatan', 'Ketua')
                ->first();
            $namaKetua = $ketuaKepengurusan ? $ketuaKepengurusan->nama : '-';

            // Jumlah anggota
            $jumlahAnggota = Kepengurusan::where('user_id', $user->id)->count();

            $csvData[] = [
                $no++,
                $user->name,
                $user->username,
                ucfirst($user->role),
                $namaKetua,
                $jumlahAnggota,
                $user->status ?? 'Aktif',
                $user->periode ?? '-',
                $user->deskripsi ?? '-'
            ];
        }

        // Generate CSV
        $filename = 'Data_Ormawa_' . date('Y-m-d_His') . '.csv';
        
        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            
            // UTF-8 BOM untuk Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            
            fclose($file);
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Update periode ormawa
     */
    public function updatePeriode(Request $request, $userId)
    {
        $user = User::findOrFail($userId);

        // Check if user is puskaka
        if (Auth::user()->role !== 'puskaka') {
            return response()->json([
                'error' => 'Anda tidak memiliki izin untuk mengubah periode.'
            ], 403);
        }

        // Validasi periode
        $validated = $request->validate([
            'periode' => 'required|string|max:255',
        ]);

        try {
            $user->periode = $validated['periode'];
            $user->save();

            return redirect()->back()->with('success', 'Periode berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating periode: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengubah periode');
        }
    }
}
