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
        // Update enum untuk status column (skip for SQLite in testing)
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE laporan_kegiatans MODIFY COLUMN status ENUM('Belum Diajukan', 'Diajukan', 'Direview', 'Disetujui', 'Direvisi', 'Ditolak') DEFAULT 'Belum Diajukan'");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to original enum (skip for SQLite in testing)
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE laporan_kegiatans MODIFY COLUMN status ENUM('Draft', 'Diajukan', 'Direview', 'Disetujui', 'Direvisi', 'Ditolak') DEFAULT 'Draft'");
        }
    }
};
