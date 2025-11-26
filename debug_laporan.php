<?php

require_once 'bootstrap/app.php';

use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
use Illuminate\Support\Facades\Auth;

// Login as user 1 (assuming this is your user)
Auth::loginUsingId(1);

$pengajuan = PengajuanKegiatan::where('user_id', Auth::id())->get();

echo "Debug Laporan Kegiatan Data:\n";
echo "===========================\n";

foreach ($pengajuan as $p) {
    $laporan = LaporanKegiatan::where('pengajuan_kegiatan_id', $p->id)->first();
    $hasLaporan = $laporan ? true : false;

    echo "ID: {$p->id}\n";
    echo "Nama: {$p->nama_kegiatan}\n";
    echo "Status: {$p->status}\n";
    echo "HasLaporan: " . ($hasLaporan ? 'true' : 'false') . "\n";
    if ($laporan) {
        echo "Laporan ID: {$laporan->id}\n";
    }
    echo "---\n";
}

echo "\nController Index Method Simulation:\n";
echo "===================================\n";

// Simulate controller index method
$pengajuan = PengajuanKegiatan::where('user_id', Auth::id())
    ->with('laporanKegiatan')
    ->get()
    ->map(function ($item) {
        return [
            'id' => $item->id,
            'nama_kegiatan' => $item->nama_kegiatan,
            'status' => $item->status,
            'hasLaporan' => $item->laporanKegiatan !== null,
            'laporanId' => $item->laporanKegiatan ? $item->laporanKegiatan->id : null,
        ];
    });

foreach ($pengajuan as $p) {
    echo "Pengajuan ID: {$p['id']}\n";
    echo "Nama: {$p['nama_kegiatan']}\n";
    echo "Status: {$p['status']}\n";
    echo "HasLaporan: " . ($p['hasLaporan'] ? 'true' : 'false') . "\n";
    echo "LaporanId: " . ($p['laporanId'] ?? 'null') . "\n";
    echo "---\n";
}
