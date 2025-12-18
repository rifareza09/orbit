<?php

namespace App\Http\Controllers;

use App\Models\ArsipTahunan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ArsipTahunanController extends Controller
{
    /**
     * Display listing of arsip tahunan (Puskaka only)
     */
    public function index(Request $request)
    {
        // Check if user is puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        $query = ArsipTahunan::with('user')
            ->orderBy('tanggal_reset', 'desc');

        // Filter by ormawa
        if ($request->filled('ormawa_id')) {
            $query->where('user_id', $request->ormawa_id);
        }

        // Filter by tahun
        if ($request->filled('tahun')) {
            $query->where('tahun_arsip', $request->tahun);
        }

        $arsip = $query->paginate(20)->through(function ($item) {
            return [
                'id' => $item->id,
                'nama_ormawa' => $item->nama_ormawa,
                'tahun_arsip' => $item->tahun_arsip,
                'tanggal_reset' => $item->tanggal_reset->format('d/m/Y H:i'),
                'reset_by' => $item->reset_by,
                'jumlah_program_kerja' => count($item->data_program_kerja ?? []),
                'jumlah_pengajuan' => count($item->data_pengajuan_kegiatan ?? []),
                'jumlah_laporan' => count($item->data_laporan_kegiatan ?? []),
                'catatan' => $item->catatan,
            ];
        });

        // Get list ormawa for filter
        $ormawaList = User::where('role', '!=', 'puskaka')
            ->orderBy('name')
            ->get(['id', 'name']);

        // Get available years
        $availableYears = ArsipTahunan::selectRaw('DISTINCT tahun_arsip')
            ->orderBy('tahun_arsip', 'desc')
            ->pluck('tahun_arsip');

        return Inertia::render('puskaka/arsip-tahunan/index', [
            'arsip' => $arsip,
            'ormawaList' => $ormawaList,
            'availableYears' => $availableYears,
            'filters' => [
                'ormawa_id' => $request->ormawa_id,
                'tahun' => $request->tahun,
            ],
        ]);
    }

    /**
     * Display detail arsip tahunan
     */
    public function show($id)
    {
        // Check if user is puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        $arsip = ArsipTahunan::with('user')->findOrFail($id);

        return Inertia::render('puskaka/arsip-tahunan/detail', [
            'arsip' => [
                'id' => $arsip->id,
                'nama_ormawa' => $arsip->nama_ormawa,
                'tahun_arsip' => $arsip->tahun_arsip,
                'tanggal_reset' => $arsip->tanggal_reset->format('d/m/Y H:i:s'),
                'reset_by' => $arsip->reset_by,
                'catatan' => $arsip->catatan,
                'data_program_kerja' => $arsip->data_program_kerja ?? [],
                'data_pengajuan_kegiatan' => $arsip->data_pengajuan_kegiatan ?? [],
                'data_laporan_kegiatan' => $arsip->data_laporan_kegiatan ?? [],
            ],
        ]);
    }

    /**
     * Delete arsip (optional, if needed)
     */
    public function destroy($id)
    {
        // Check if user is puskaka
        if (Auth::user()->role !== 'puskaka') {
            abort(403, 'Unauthorized');
        }

        $arsip = ArsipTahunan::findOrFail($id);
        $arsip->delete();

        return redirect()->route('puskaka.arsip-tahunan.index')
            ->with('success', 'Arsip berhasil dihapus');
    }
}
