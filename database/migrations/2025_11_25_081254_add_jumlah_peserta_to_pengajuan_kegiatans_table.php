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
            $table->integer('jumlah_peserta')->default(0)->after('tempat_pelaksanaan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengajuan_kegiatans', function (Blueprint $table) {
            $table->dropColumn('jumlah_peserta');
        });
    }
};
