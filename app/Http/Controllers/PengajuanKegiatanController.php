<?php

namespace App\Http\Controllers;

use App\Models\PengajuanKegiatan;
use App\Models\ItemPengajuanDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengajuanKegiatanController extends Controller
{
    public function index()
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
            ->with(['itemPengajuanDana', 'programKerja'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Ambil program kerja yang sudah diajukan untuk dropdown
        $programKerjasDiajukan = \App\Models\ProgramKerja::where('status', 'Diajukan')
            ->where('user_id', Auth::id())
            ->select('id', 'program_kerja', 'kegiatan', 'estimasi_anggaran', 'status')
            ->get();

        return Inertia::render('pengajuan-kegiatan/index', [
            'pengajuan' => $pengajuan,
            'programKerjasDiajukan' => $programKerjasDiajukan
        ]);
    }

    public function show($id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
            ->with('itemPengajuanDana')
            ->findOrFail($id);

        return Inertia::render('pengajuan-kegiatan/detail', [
            'pengajuan' => $pengajuan
        ]);
    }

    public function create()
    {
        // Ambil program kerja yang sudah diajukan
        $programKerjasDiajukan = \App\Models\ProgramKerja::where('status', 'Diajukan')
            ->where('user_id', Auth::id())
            ->select('id', 'program_kerja', 'kegiatan', 'estimasi_anggaran', 'status')
            ->get();

        return Inertia::render('pengajuan-kegiatan/buatProposal', [
            'programKerjasDiajukan' => $programKerjasDiajukan
        ]);
    }

    public function store(Request $request)
    {
        // Parse items JSON string to array
        $items = json_decode($request->input('items'), true);
        $request->merge(['items' => $items]);

        $validated = $request->validate([
            'program_kerja_id' => 'required|exists:program_kerjas,id',
            'ketua_pelaksana' => 'required|string|max:255',
            'tempat_pelaksanaan' => 'required|string|max:255',
            'jumlah_peserta' => 'required|integer|min:1',
            'tanggal_pelaksanaan' => 'required|date',
            'deskripsi' => 'nullable|string',
            'proposal' => 'nullable|file|mimes:pdf|max:10000',
            'items' => 'required|array|min:1',
            'items.*.nama_item' => 'required|string|max:255',
            'items.*.deskripsi_item' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        // Handle file upload
        $proposalPath = null;
        if ($request->hasFile('proposal')) {
            $proposalPath = $request->file('proposal')->store('proposals', 'public');
        }

        // Get program kerja untuk ambil nama kegiatan
        $programKerja = \App\Models\ProgramKerja::findOrFail($validated['program_kerja_id']);

        // Create pengajuan kegiatan
        $pengajuan = PengajuanKegiatan::create([
            'user_id' => Auth::id(),
            'program_kerja_id' => $validated['program_kerja_id'],
            'nama_kegiatan' => $programKerja->kegiatan, // Mengambil dari field 'kegiatan'
            'ketua_pelaksana' => $validated['ketua_pelaksana'],
            'tempat_pelaksanaan' => $validated['tempat_pelaksanaan'],
            'jumlah_peserta' => $validated['jumlah_peserta'],
            'tanggal_pelaksanaan' => $validated['tanggal_pelaksanaan'],
            'deskripsi' => $validated['deskripsi'],
            'proposal_path' => $proposalPath,
            'status' => 'Belum Diajukan',
        ]);

        // Create items
        foreach ($validated['items'] as $item) {
            ItemPengajuanDana::create([
                'pengajuan_kegiatan_id' => $pengajuan->id,
                'nama_item' => $item['nama_item'],
                'deskripsi_item' => $item['deskripsi_item'],
                'quantity' => $item['quantity'],
                'harga_satuan' => $item['harga_satuan'],
            ]);
        }

        return redirect('/pengajuan-kegiatan')
            ->with('success', 'Proposal kegiatan berhasil dibuat!');
    }

    public function edit($id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
            ->with(['itemPengajuanDana', 'programKerja'])
            ->findOrFail($id);

        // Ambil program kerja yang sudah diajukan
        $programKerjasDiajukan = \App\Models\ProgramKerja::where('status', 'Diajukan')
            ->where('user_id', Auth::id())
            ->select('id', 'program_kerja', 'kegiatan', 'estimasi_anggaran', 'status')
            ->get();

        return Inertia::render('pengajuan-kegiatan/buatProposal', [
            'pengajuan' => $pengajuan,
            'programKerjasDiajukan' => $programKerjasDiajukan
        ]);
    }

    public function update(Request $request, $id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())->findOrFail($id);

        // Parse items JSON string to array
        $items = json_decode($request->input('items'), true);
        $request->merge(['items' => $items]);

        $validated = $request->validate([
            'program_kerja_id' => 'required|exists:program_kerjas,id',
            'ketua_pelaksana' => 'required|string|max:255',
            'tempat_pelaksanaan' => 'required|string|max:255',
            'jumlah_peserta' => 'required|integer|min:1',
            'tanggal_pelaksanaan' => 'required|date',
            'deskripsi' => 'nullable|string',
            'proposal' => 'nullable|file|mimes:pdf|max:10000',
            'items' => 'required|array|min:1',
            'items.*.nama_item' => 'required|string|max:255',
            'items.*.deskripsi_item' => 'nullable|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
        ]);

        // Handle file upload
        $updateData = [];
        if ($request->hasFile('proposal')) {
            // Delete old file if exists
            if ($pengajuan->proposal_path) {
                Storage::disk('public')->delete($pengajuan->proposal_path);
            }
            $updateData['proposal_path'] = $request->file('proposal')->store('proposals', 'public');
        }

        // Get program kerja untuk ambil nama kegiatan
        $programKerja = \App\Models\ProgramKerja::findOrFail($validated['program_kerja_id']);

        // Update pengajuan kegiatan
        $pengajuan->update([
            'program_kerja_id' => $validated['program_kerja_id'],
            'nama_kegiatan' => $programKerja->kegiatan, // Mengambil dari field 'kegiatan'
            'ketua_pelaksana' => $validated['ketua_pelaksana'],
            'tempat_pelaksanaan' => $validated['tempat_pelaksanaan'],
            'jumlah_peserta' => $validated['jumlah_peserta'],
            'tanggal_pelaksanaan' => $validated['tanggal_pelaksanaan'],
            'deskripsi' => $validated['deskripsi'],
            ...$updateData
        ]);

        // Delete existing items and create new ones
        $pengajuan->itemPengajuanDana()->delete();

        foreach ($validated['items'] as $item) {
            ItemPengajuanDana::create([
                'pengajuan_kegiatan_id' => $pengajuan->id,
                'nama_item' => $item['nama_item'],
                'deskripsi_item' => $item['deskripsi_item'],
                'quantity' => $item['quantity'],
                'harga_satuan' => $item['harga_satuan'],
            ]);
        }

        return redirect('/pengajuan-kegiatan')
            ->with('success', 'Proposal kegiatan berhasil diperbarui!');
    }

    public function ajukan($id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())->findOrFail($id);
        $pengajuan->update(['status' => 'Diajukan']);

        return redirect('/pengajuan-kegiatan')
            ->with('success', 'Proposal kegiatan berhasil diajukan!');
    }

    public function destroy($id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())->findOrFail($id);
        $pengajuan->delete();

        return redirect('/pengajuan-kegiatan')
            ->with('success', 'Proposal kegiatan berhasil dihapus!');
    }
}
