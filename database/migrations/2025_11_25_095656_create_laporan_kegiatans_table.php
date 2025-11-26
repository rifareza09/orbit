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
        Schema::create('laporan_kegiatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('pengajuan_kegiatan_id')->constrained('pengajuan_kegiatans')->onDelete('cascade');
            $table->decimal('anggaran_disetujui', 15, 0)->nullable();
            $table->decimal('anggaran_realisasi', 15, 0)->nullable();
            $table->text('ringkasan')->nullable();
            $table->enum('status', ['Draft', 'Diajukan', 'Direview', 'Disetujui', 'Direvisi', 'Ditolak'])->default('Draft');
            $table->string('lpj_file')->nullable();
            $table->json('bukti_pengeluaran')->nullable();
            $table->json('dokumentasi')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['user_id', 'status']);
            $table->index('pengajuan_kegiatan_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_kegiatans');
    }
};
