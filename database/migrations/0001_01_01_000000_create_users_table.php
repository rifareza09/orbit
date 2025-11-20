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
       Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name'); // Nama Organisasi: LDK KAHFI, VOYAGE, BEM, dsb.
    $table->string('username')->unique(); // LOGIN pakai username, bukan email
    $table->string('password');
    $table->enum('role', ['puskaka', 'ukm', 'bem', 'kongres', 'guest'])->default('guest');
    $table->unsignedBigInteger('ormawa_id')->nullable(); // kalau nanti mau hubungan FK
    $table->rememberToken();
    $table->timestamps();
});

        

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
