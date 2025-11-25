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
        Schema::table('program_kerjas', function (Blueprint $table) {
            $table->string('status', 50)->default('Belum Diajukan')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_kerjas', function (Blueprint $table) {
            $table->string('status')->default('Diajukan')->change();
        });
    }
};
