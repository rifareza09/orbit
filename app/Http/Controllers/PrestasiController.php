<?php

namespace App\Http\Controllers;

use App\Models\Prestasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index()
    {
        $prestasis = Prestasi::where('user_id', Auth::id())
            ->orderBy('tanggal_perolehan', 'desc')
            ->get();

        return Inertia::render('prestasi/index', [
            'prestasis' => $prestasis,
        ]);
    }

    public function create()
    {
        return Inertia::render('prestasi/TambahPrestasi');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_prestasi' => 'required|string|max:255',
            'jenis_prestasi' => 'required|string|max:255',
            'tingkat_kejuaraan' => 'required|string|max:255',
            'nama_peraih' => 'required|string|max:255',
            'tanggal_perolehan' => 'required|date',
            'bukti' => 'nullable|file|mimes:pdf|max:5120', // 5MB max
        ]);

        $buktiPath = null;
        if ($request->hasFile('bukti')) {
            $buktiPath = $request->file('bukti')->store('prestasi/bukti', 'public');
        }

        Prestasi::create([
            'user_id' => Auth::id(),
            'nama_prestasi' => $validated['nama_prestasi'],
            'jenis_prestasi' => $validated['jenis_prestasi'],
            'tingkat_kejuaraan' => $validated['tingkat_kejuaraan'],
            'nama_peraih' => $validated['nama_peraih'],
            'tanggal_perolehan' => $validated['tanggal_perolehan'],
            'bukti_path' => $buktiPath,
        ]);

        return redirect()->route('prestasi.index')
            ->with('success', 'Prestasi berhasil ditambahkan!');
    }

    public function destroy($id)
    {
        $prestasi = Prestasi::where('user_id', Auth::id())->findOrFail($id);

        // Hapus file bukti jika ada
        if ($prestasi->bukti_path) {
            Storage::disk('public')->delete($prestasi->bukti_path);
        }

        $prestasi->delete();

        return redirect()->route('prestasi.index')
            ->with('success', 'Prestasi berhasil dihapus!');
    }

    public function download($id)
    {
        $prestasi = Prestasi::where('user_id', Auth::id())->findOrFail($id);

        if (!$prestasi->bukti_path || !Storage::disk('public')->exists($prestasi->bukti_path)) {
            abort(404, 'File bukti tidak ditemukan');
        }

        $filePath = storage_path('app/public/' . $prestasi->bukti_path);
        $fileName = 'Bukti_' . $prestasi->nama_prestasi . '.pdf';

        return response()->download($filePath, $fileName);
    }
}
