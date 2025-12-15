<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ResetOrmawaData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reset:ormawa-data {--confirm}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset semua data ormawa (kegiatan, laporan, dokumentasi, dll) namun keep user accounts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->option('confirm')) {
            $this->warn('⚠️  PERINGATAN! Perintah ini akan MENGHAPUS:');
            $this->line('  - Program Kerja');
            $this->line('  - Pengajuan Kegiatan');
            $this->line('  - Laporan Kegiatan');
            $this->line('  - Item Pengajuan Dana');
            $this->line('  - Dokumentasi');
            $this->line('  - Jadwal Latihan');
            $this->line('  - Kepengurusan');
            $this->line('  - Prestasi');
            $this->line('');
            $this->info('✓ Akun user TIDAK akan dihapus');
            $this->line('');

            if (!$this->confirm('Lanjutkan reset data ormawa?')) {
                $this->info('Dibatalkan.');
                return;
            }
        }

        try {
            // Disable foreign key checks untuk truncate tanpa constraint error
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            $tables = [
                'item_pengajuan_danas',
                'laporan_kegiatans',
                'pengajuan_kegiatans',
                'program_kerjas',
                'dokumentasis',
                'jadwal_latihans',
                'kepengurusans',
                'prestasis',
            ];

            foreach ($tables as $table) {
                DB::table($table)->truncate();
                $this->line("✓ Truncated: {$table}");
            }

            // Re-enable foreign key checks
            DB::statement('SET FOREIGN_KEY_CHECKS=1');

            $this->info('');
            $this->info('✅ Reset data ormawa berhasil!');
            $this->info('Semua akun user masih tersimpan dengan aman.');
            $this->line('');
            $this->info('Sekarang siap untuk presentasi ke client! 🎉');

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }
    }
}
