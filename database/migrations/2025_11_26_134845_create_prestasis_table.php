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
        Schema::create('prestasis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nama_prestasi');
            $table->string('jenis_prestasi');
            $table->string('tingkat_kejuaraan');
            $table->string('nama_peraih');
            $table->date('tanggal_perolehan');
            $table->string('bukti_file')->nullable(); // PDF file path
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prestasis');
    }
};
