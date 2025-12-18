<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('arsip_tahunan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nama_ormawa');
            $table->year('tahun_arsip');
            $table->timestamp('tanggal_reset');
            $table->string('reset_by'); // Username puskaka yang melakukan reset
            $table->json('data_program_kerja')->nullable(); // Array of program kerja yang dihapus
            $table->json('data_pengajuan_kegiatan')->nullable(); // Array of pengajuan yang dihapus
            $table->json('data_laporan_kegiatan')->nullable(); // Array of laporan yang dihapus
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'tahun_arsip']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('arsip_tahunan');
    }
};
