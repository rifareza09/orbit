<?php

namespace App\Http\Controllers;

use App\Models\PengajuanKegiatan;
use App\Models\ItemPengajuanDana;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\NotificationService;

class PengajuanKegiatanController extends Controller
{
    public function index()
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
            ->with(['itemPengajuanDana', 'programKerja'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama_kegiatan' => $p->nama_kegiatan,
                    'ketua_pelaksana' => $p->ketua_pelaksana,
                    'tempat_pelaksanaan' => $p->tempat_pelaksanaan,
                    'jumlah_peserta' => $p->jumlah_peserta,
                    'tanggal_pelaksanaan' => $p->tanggal_pelaksanaan,
                    'total_anggaran' => $p->total_anggaran,
                    'status' => $p->status,
                    'status_review' => $p->status_review,
                    'catatan_puskaka' => $p->catatan_puskaka,
                    'reviewed_at' => $p->reviewed_at ? (is_string($p->reviewed_at) ? $p->reviewed_at : $p->reviewed_at->format('d/m/Y H:i')) : null,
                ];
            });

        // Ambil program kerja yang sudah disetujui untuk dropdown
        $programKerjasDiajukan = \App\Models\ProgramKerja::where('status', 'Disetujui')
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
            ->with(['itemPengajuanDana', 'programKerja'])
            ->findOrFail($id);

        return Inertia::render('pengajuan-kegiatan/detail', [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'nama_kegiatan' => $pengajuan->nama_kegiatan,
                'ketua_pelaksana' => $pengajuan->ketua_pelaksana,
                'tempat_pelaksanaan' => $pengajuan->tempat_pelaksanaan,
                'jumlah_peserta' => $pengajuan->jumlah_peserta,
                'tanggal_pelaksanaan' => $pengajuan->tanggal_pelaksanaan,
                'estimasi_anggaran' => $pengajuan->programKerja->estimasi_anggaran ?? 0,
                'total_anggaran' => $pengajuan->total_anggaran,
                'status' => $pengajuan->status,
                'status_review' => $pengajuan->status_review,
                'catatan_puskaka' => $pengajuan->catatan_puskaka,
                'reviewed_at' => $pengajuan->reviewed_at ? (is_string($pengajuan->reviewed_at) ? $pengajuan->reviewed_at : $pengajuan->reviewed_at->format('d/m/Y H:i')) : null,
                'deskripsi' => $pengajuan->deskripsi,
                'proposal_path' => $pengajuan->proposal_path,
                'program_kerja' => $pengajuan->programKerja,
                'item_pengajuan_dana' => $pengajuan->itemPengajuanDana,
            ]
        ]);
    }

    public function create()
    {
        // Ambil program kerja yang sudah disetujui
        $programKerjasDiajukan = \App\Models\ProgramKerja::where('status', 'Disetujui')
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
            'proposal' => 'nullable|file|mimes:pdf|max:102400', // max 100MB
            'items' => 'nullable|array',
            'items.*.nama_item' => 'nullable|string|max:255',
            'items.*.deskripsi_item' => 'nullable|string',
            'items.*.quantity' => 'nullable|integer|min:1',
            'items.*.harga_satuan' => 'nullable|numeric|min:0',
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
            'total_anggaran' => 0,
        ]);

        // Create items (hanya jika ada item yang valid) and calculate total
        $totalAnggaran = 0;
        $itemsToCreate = $validated['items'] ?? [];
        foreach ($itemsToCreate as $item) {
            // Skip item yang kosong
            if (empty($item['nama_item'])) continue;

            $quantity = $item['quantity'] ?? 1;
            $hargaSatuan = $item['harga_satuan'] ?? 0;

            ItemPengajuanDana::create([
                'pengajuan_kegiatan_id' => $pengajuan->id,
                'nama_item' => $item['nama_item'],
                'deskripsi_item' => $item['deskripsi_item'] ?? null,
                'quantity' => $quantity,
                'harga_satuan' => $hargaSatuan,
            ]);

            $totalAnggaran += ($quantity * $hargaSatuan);
        }

        // Update total_anggaran
        $pengajuan->update(['total_anggaran' => $totalAnggaran]);

        return redirect('/pengajuan-kegiatan')
            ->with('success', 'Proposal kegiatan berhasil dibuat!');
    }

    public function edit($id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
            ->with(['itemPengajuanDana', 'programKerja'])
            ->findOrFail($id);

        // Check if pengajuan can be edited (Belum Diajukan or Direvisi)
        // Cek status_review untuk status revisi dari Puskaka
        if ($pengajuan->status !== 'Belum Diajukan' && $pengajuan->status_review !== 'Direvisi' && $pengajuan->status_review !== 'Ditolak') {
            return redirect('/pengajuan-kegiatan')
                ->with('error', 'Pengajuan ini tidak dapat diedit.');
        }

        // Ambil program kerja yang sudah disetujui
        $programKerjasDiajukan = \App\Models\ProgramKerja::where('status', 'Disetujui')
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
            'proposal' => 'nullable|file|mimes:pdf|max:102400', // max 100MB
            'items' => 'nullable|array',
            'items.*.nama_item' => 'nullable|string|max:255',
            'items.*.deskripsi_item' => 'nullable|string',
            'items.*.quantity' => 'nullable|integer|min:1',
            'items.*.harga_satuan' => 'nullable|numeric|min:0',
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
            'catatan_puskaka' => null, // Clear previous feedback
            'reviewed_at' => null, // Clear review timestamp
            ...$updateData
        ]);

        // Delete existing items and create new ones
        $pengajuan->itemPengajuanDana()->delete();

        $totalAnggaran = 0;
        $itemsToCreate = $validated['items'] ?? [];
        foreach ($itemsToCreate as $item) {
            // Skip item yang kosong
            if (empty($item['nama_item'])) continue;

            $quantity = $item['quantity'] ?? 1;
            $hargaSatuan = $item['harga_satuan'] ?? 0;

            ItemPengajuanDana::create([
                'pengajuan_kegiatan_id' => $pengajuan->id,
                'nama_item' => $item['nama_item'],
                'deskripsi_item' => $item['deskripsi_item'] ?? null,
                'quantity' => $quantity,
                'harga_satuan' => $hargaSatuan,
            ]);

            $totalAnggaran += ($quantity * $hargaSatuan);
        }

        // Update total_anggaran field
        $pengajuan->update(['total_anggaran' => $totalAnggaran]);

        return redirect('/pengajuan-kegiatan')
            ->with('success', 'Proposal kegiatan berhasil diperbarui!');
    }

    public function ajukan($id)
    {
        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())->findOrFail($id);
        // Update status dan status_review ke Diajukan (untuk pengajuan baru atau re-submit dari revisi)
        $pengajuan->update([
            'status' => 'Diajukan',
            'status_review' => 'Menunggu Review'
        ]);

        // Send notification to Puskaka
        $user = Auth::user();
        NotificationService::notifyPuskakaNewPengajuan(
            $user->name,
            $pengajuan->nama_kegiatan,
            $pengajuan->id
        );

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
