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
    Schema::create('program_kerjas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // UKM yang input
        $table->string('program_kerja');
        $table->string('kegiatan');
        $table->text('deskripsi_kegiatan');
        $table->string('jenis_kegiatan');
        $table->string('estimasi_anggaran');
        $table->string('status')->default('Diajukan'); // Diajukan | Disetujui | Ditolak
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_kerjas');
    }
};
