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
            $table->string('proposal_path')->nullable()->after('deskripsi');
            $table->foreignId('program_kerja_id')->nullable()->constrained('program_kerjas')->onDelete('set null')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengajuan_kegiatans', function (Blueprint $table) {
            $table->dropForeign(['program_kerja_id']);
            $table->dropColumn(['proposal_path', 'program_kerja_id']);
        });
    }
};
