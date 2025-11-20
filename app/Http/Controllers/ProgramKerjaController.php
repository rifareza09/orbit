<?php

namespace App\Http\Controllers;

use App\Models\ProgramKerja;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProgramKerjaController extends Controller
{
    public function index()
    {
        $programs = ProgramKerja::where('user_id', Auth::id())->get();

        return Inertia::render('program-kerja/index', [
            'programs' => $programs
        ]);
    }

    public function create()
    {
        return Inertia::render('program-kerja/tambah');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_kerja'        => 'required|string|max:255',
            'kegiatan'             => 'required|string|max:255',
            'deskripsi_kegiatan'   => 'required|string',
            'jenis_kegiatan'       => 'required|string',
            'estimasi_anggaran'    => 'required|numeric|min:0',
        ]);

        ProgramKerja::create([
            'user_id'             => Auth::id(),
            'program_kerja'       => $validated['program_kerja'],
            'kegiatan'            => $validated['kegiatan'],
            'deskripsi_kegiatan'  => $validated['deskripsi_kegiatan'],
            'jenis_kegiatan'      => $validated['jenis_kegiatan'],
            'estimasi_anggaran'   => $validated['estimasi_anggaran'],
            'status'              => 'Diajukan',
        ]);

        return redirect()
            ->route('program-kerja.index')
            ->with('success', 'Program Kerja berhasil dibuat!');
    }
   public function show($id)
    {
        // Menampilkan detail program kerja berdasarkan ID
        $program = ProgramKerja::where('user_id', Auth::id())
                ->findOrFail($id);

        return Inertia::render('program-kerja/detail', [
            'item' => [
                'id' => $program->id,
                'programKerja' => $program->program_kerja,
                'kegiatan' => $program->kegiatan,
                'deskripsiKegiatan' => $program->deskripsi_kegiatan,
                'jenisKegiatan' => $program->jenis_kegiatan,
                'estimasiKegiatan' => "Rp. " . number_format($program->estimasi_anggaran, 0, ',', '.'),
                'status' => $program->status ?? 'Belum Diajukan',
            ]
        ]);
    }

   public function edit($id)
{
    $program = ProgramKerja::findOrFail($id);

    return Inertia::render('program-kerja/editProgramKerja', [
        'item' => [
            'id' => $program->id,
            'programKerja' => $program->program_kerja,
            'kegiatan' => $program->kegiatan,
            'deskripsiKegiatan' => $program->deskripsi_kegiatan,
            'jenisKegiatan' => $program->jenis_kegiatan,
            'estimasiKegiatan' => "Rp. " . number_format($program->estimasi_anggaran, 0, ',', '.'),
            'status' => $program->status ?? 'Diajukan',
        ]
    ]);
}

    public function update(Request $request, $id)
    {
        // Log data yang diterima
        Log::info('Request Data:', $request->all());

        // Update data program kerja berdasarkan ID
        $program = ProgramKerja::findOrFail($id);

        // Validasi input
        $validated = $request->validate([
            'program_kerja'        => 'required|string|max:255',
            'kegiatan'             => 'required|string|max:255',
            'deskripsi_kegiatan'   => 'required|string',
            'jenis_kegiatan'       => 'required|string',
            'estimasi_anggaran'    => 'required|numeric|min:0',
        ]);

        // Log data setelah validasi
        Log::info('Validated Data:', $validated);

        $program->update([
            'program_kerja'       => $validated['program_kerja'],
            'kegiatan'            => $validated['kegiatan'],
            'deskripsi_kegiatan'  => $validated['deskripsi_kegiatan'],
            'jenis_kegiatan'      => $validated['jenis_kegiatan'],
            'estimasi_anggaran'   => $validated['estimasi_anggaran'],
            'status'              => 'Diajukan', // status default
        ]);

        // Log data setelah update
Log::info('Updated Program Kerja:', $program->toArray()); // Pastikan objek menjadi array

        return redirect()
            ->route('program-kerja.index')
            ->with('success', 'Program Kerja berhasil diperbarui!');
    }


public function destroy($id)
{
    // Menemukan program kerja berdasarkan ID dan menghapusnya
    $program = ProgramKerja::findOrFail($id);
    $program->delete();

    // Mengarahkan kembali ke halaman program kerja dengan pesan sukses
    return redirect()->route('program-kerja.index')->with('success', 'Program Kerja berhasil dihapus!');
}

}
