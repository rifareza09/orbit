<?php

use App\Models\User;
use function Pest\Laravel\{get, actingAs};

test('halaman utama (landing page) dapat diakses', function () {
    $response = get('/');

    $response->assertStatus(200);
});

test('pengguna yang tidak login akan diarahkan ke login saat buka dashboard', function () {
    $response = get('/dashboard');

    $response->assertStatus(302);
    $response->assertRedirect('/login');
});

test('puskaka dashboard tidak bisa diakses oleh user biasa', function () {
    $user = User::factory()->create([
        'role' => 'ormawa'
    ]);

    actingAs($user)
        ->get('/dashboard/puskaka')
        ->assertStatus(302); // Ditolak/Redirect karena role tidak sesuai
});

test('puskaka dashboard dapat diakses oleh admin puskaka', function () {
    $admin = User::factory()->create([
        'role' => 'puskaka',
        'email_verified_at' => now(),
    ]);

    actingAs($admin)
        ->get('/dashboard/puskaka')
        ->assertStatus(200);
});
