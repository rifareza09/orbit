<?php

namespace Database\Seeders;

use App\Models\LaporanKegiatan;
use App\Models\PengajuanKegiatan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LaporanKegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil pengajuan kegiatan pertama
        $pengajuan = PengajuanKegiatan::first();

        if ($pengajuan) {
            LaporanKegiatan::create([
                'user_id' => $pengajuan->user_id,
                'pengajuan_kegiatan_id' => $pengajuan->id,
                'anggaran_disetujui' => 1000000,
                'anggaran_realisasi' => 950000,
                'ringkasan' => 'Kegiatan telah terlaksana dengan baik. Semua agenda berjalan sesuai rencana dan target peserta tercapai.',
                'status' => 'Belum Diajukan',
                'lpj_file' => null,
                'bukti_pengeluaran' => [],
                'dokumentasi' => [],
            ]);

            $this->command->info('Sample laporan kegiatan created successfully!');
        } else {
            $this->command->error('No pengajuan kegiatan found. Please create pengajuan kegiatan first.');
        }
    }
}
