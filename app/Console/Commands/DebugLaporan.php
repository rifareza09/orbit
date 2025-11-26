<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
use Illuminate\Support\Facades\Auth;

class DebugLaporan extends Command
{
    protected $signature = 'debug:laporan';
    protected $description = 'Debug laporan kegiatan data';

    public function handle()
    {
        // Login as user 1
        Auth::loginUsingId(1);

        $this->info('Debug Laporan Kegiatan Data:');
        $this->info('===========================');

        $pengajuan = PengajuanKegiatan::where('user_id', Auth::id())->get();

        foreach ($pengajuan as $p) {
            $laporan = LaporanKegiatan::where('pengajuan_kegiatan_id', $p->id)->first();
            $hasLaporan = $laporan ? true : false;

            $this->info("ID: {$p->id}");
            $this->info("Nama: {$p->nama_kegiatan}");
            $this->info("Status: {$p->status}");
            $this->info("HasLaporan: " . ($hasLaporan ? 'true' : 'false'));
            if ($laporan) {
                $this->info("Laporan ID: {$laporan->id}");
            }
            $this->info("---");
        }

        $this->info("\nController Index Method Simulation:");
        $this->info("===================================");

        // Simulate controller index method
        $pengajuanData = PengajuanKegiatan::where('user_id', Auth::id())
            ->with('laporanKegiatan')
            ->get();

        $mappedData = [];
        foreach ($pengajuanData as $item) {
            $mappedData[] = [
                'id' => $item->id,
                'nama_kegiatan' => $item->nama_kegiatan,
                'status' => $item->status,
                'hasLaporan' => $item->laporanKegiatan !== null,
                'laporanId' => $item->laporanKegiatan ? $item->laporanKegiatan->id : null,
            ];
        }

        foreach ($mappedData as $p) {
            $this->info("Pengajuan ID: {$p['id']}");
            $this->info("Nama: {$p['nama_kegiatan']}");
            $this->info("Status: {$p['status']}");
            $this->info("HasLaporan: " . ($p['hasLaporan'] ? 'true' : 'false'));
            $this->info("LaporanId: " . ($p['laporanId'] ?? 'null'));
            $this->info("---");
        }

        return 0;
    }
}
