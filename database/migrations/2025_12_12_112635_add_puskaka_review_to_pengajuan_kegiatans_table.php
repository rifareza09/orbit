<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pengajuan_kegiatans', function (Blueprint $table) {
            $table->text('catatan_puskaka')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('catatan_puskaka');
            $table->enum('status_review', ['Menunggu Review', 'Direview', 'Disetujui', 'Ditolak', 'Direvisi'])->default('Menunggu Review')->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengajuan_kegiatans', function (Blueprint $table) {
            $table->dropColumn(['catatan_puskaka', 'reviewed_at', 'status_review']);
        });
    }
};
