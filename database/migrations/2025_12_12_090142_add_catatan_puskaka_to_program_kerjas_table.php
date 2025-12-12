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
            $table->text('catatan_puskaka')->nullable()->after('status');
            $table->timestamp('reviewed_at')->nullable()->after('catatan_puskaka');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('program_kerjas', function (Blueprint $table) {
            $table->dropColumn(['catatan_puskaka', 'reviewed_at']);
        });
    }
};
