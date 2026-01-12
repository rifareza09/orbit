<?php

namespace App\Http\Controllers;

use App\Models\Dokumentasi;
use App\Models\LaporanKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DokumentasiController extends Controller
{
    public function index()
    {
        // Dokumentasi manual yang dibuat user
        $dokumentasiManual = Dokumentasi::where('user_id', Auth::id())
            ->orderBy('tanggal_kegiatan', 'desc')
            ->get()
            ->map(function($item) {
                $fotoUrl = null;
                if ($item->foto_path) {
                    $fotoUrl = asset('storage/' . $item->foto_path);
                }

                return [
                    'id' => $item->id,
                    'nama_kegiatan' => $item->nama_kegiatan,
                    'tanggal_kegiatan' => $item->tanggal_kegiatan->format('Y-m-d'),
                    'foto_url' => $fotoUrl,
                    'source' => 'manual',
                ];
            });

        // Dokumentasi dari Laporan Kegiatan
        $dokumentasiLaporan = LaporanKegiatan::where('user_id', Auth::id())
            ->whereNotNull('dokumentasi')
            ->with('pengajuanKegiatan')
            ->get()
            ->flatMap(function($laporan) {
                $docs = [];
                $dokumentasiFiles = $laporan->dokumentasi ?? [];

                foreach ($dokumentasiFiles as $file) {
                    $docs[] = [
                        'id' => 'laporan_' . $laporan->id . '_' . md5($file),
                        'nama_kegiatan' => $laporan->pengajuanKegiatan->nama_kegiatan ?? 'Kegiatan',
                        'tanggal_kegiatan' => $laporan->pengajuanKegiatan->tanggal_pelaksanaan ?? $laporan->created_at->format('Y-m-d'),
                        'foto_url' => asset('storage/' . $file),
                        'source' => 'laporan',
                    ];
                }

                return $docs;
            });

        // Gabungkan kedua sumber dokumentasi
        $allDokumentasi = $dokumentasiManual->concat($dokumentasiLaporan)
            ->sortByDesc('tanggal_kegiatan')
            ->values();

        return Inertia::render('dokumentasi/index', [
            'dokumentasi' => $allDokumentasi
        ]);
    }

    public function create()
    {
        return Inertia::render('dokumentasi/buatDokumentasi');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kegiatan' => 'required|string|max:255',
            'tanggal_kegiatan' => 'required|date',
            'foto' => 'required|image|mimes:png,jpg,jpeg|max:5120', // max 5MB
        ]);

        // Handle foto upload
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('dokumentasi', 'public');
        }

        Dokumentasi::create([
            'user_id' => Auth::id(),
            'nama_kegiatan' => $validated['nama_kegiatan'],
            'tanggal_kegiatan' => $validated['tanggal_kegiatan'],
            'foto_path' => $fotoPath,
        ]);

        return redirect()->route('dokumentasi.index')
            ->with('success', 'Dokumentasi berhasil ditambahkan');
    }

    public function destroy($id)
    {
        $dokumentasi = Dokumentasi::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        // Delete foto file
        if ($dokumentasi->foto_path) {
            Storage::disk('public')->delete($dokumentasi->foto_path);
        }

        $dokumentasi->delete();

        return redirect()->route('dokumentasi.index')
            ->with('success', 'Dokumentasi berhasil dihapus');
    }
}
