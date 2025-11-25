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
        Schema::create('pengajuan_kegiatans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nama_kegiatan');
            $table->string('ketua_pelaksana');
            $table->string('tempat_pelaksanaan');
            $table->date('tanggal_pelaksanaan');
            $table->decimal('total_anggaran', 15, 2)->default(0);
            $table->string('status')->default('Belum Diajukan');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_kegiatans');
    }
};
