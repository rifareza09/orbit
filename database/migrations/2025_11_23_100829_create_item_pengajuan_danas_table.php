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
        Schema::create('item_pengajuan_danas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_kegiatan_id')->constrained()->onDelete('cascade');
            $table->string('nama_item');
            $table->text('deskripsi_item')->nullable();
            $table->integer('quantity');
            $table->decimal('harga_satuan', 15, 2);
            $table->decimal('total_harga', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('item_pengajuan_danas');
    }
};
