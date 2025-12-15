<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update pengajuan kegiatan dengan status "Selesai" menjadi "Disetujui"
        // Karena status "Selesai" hanya boleh di laporan kegiatan, bukan pengajuan
        DB::table('pengajuan_kegiatans')
            ->where('status', 'Selesai')
            ->update(['status' => 'Disetujui']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Jika perlu rollback, tidak perlu apa-apa karena ini hanya cleanup
    }
};
