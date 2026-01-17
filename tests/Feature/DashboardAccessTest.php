<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Dashboard Access Feature Test
 *
 * Menguji akses ke halaman dashboard dengan berbagai kondisi:
 * - Unauthenticated access (guest)
 * - Authenticated access (logged in)
 * - Role-based redirect (puskaka vs ormawa)
 *
 * Files yang ditest secara tidak langsung:
 * - routes/web.php (route definitions)
 * - app/Http/Middleware/Authenticate.php
 * - app/Http/Middleware/EnsureEmailIsVerified.php
 * - app/Models/User.php
 * - Inertia page renders
 */
class DashboardAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Guest user tidak bisa akses dashboard
     *
     * Validates:
     * - Middleware 'auth' berfungsi
     * - Redirect ke login untuk unauthenticated user
     */
    public function test_guest_cannot_access_dashboard(): void
    {
        // Arrange: Tidak ada user login (guest)

        // Act: Akses dashboard tanpa login
        $response = $this->get('/dashboard');

        // Assert: Redirect ke login
        $response->assertRedirect('/login');
    }

    /**
     * Test: User Puskaka di-redirect ke dashboard puskaka
     *
     * Validates:
     * - Role-based access control berfungsi
     * - Conditional redirect berdasarkan role
     * - Named route 'dashboard.puskaka' exist
     */
    public function test_puskaka_user_redirected_to_puskaka_dashboard(): void
    {
        // Arrange: Buat user dengan role puskaka
        $user = User::factory()->create([
            'name' => 'PUSKAKA',
            'email' => 'puskaka@test.com',
            'role' => 'puskaka',
            'email_verified_at' => now(),
        ]);

        // Act: Login dan akses /dashboard
        $response = $this->actingAs($user)->get('/dashboard');

        // Assert: Redirect ke dashboard puskaka
        $response->assertRedirect('/dashboard/puskaka');
    }

    /**
     * Test: User Puskaka dapat akses dashboard puskaka
     *
     * Validates:
     * - Route /dashboard/puskaka accessible
     * - Puskaka middleware (jika ada) berfungsi
     * - Correct Inertia page rendered
     */
    public function test_puskaka_user_can_access_puskaka_dashboard(): void
    {
        // Arrange: Buat user puskaka
        $user = User::factory()->create([
            'role' => 'puskaka',
            'email_verified_at' => now(),
        ]);

        // Act: Akses dashboard puskaka langsung
        $response = $this->actingAs($user)->get('/dashboard/puskaka');

        // Assert:
        // - HTTP 200 OK
        // - Halaman puskaka ter-render
        $response->assertOk();
        $response->assertInertia(fn ($page) =>
            $page->component('dashboard/puskaka')
        );
    }

    /**
     * Test: User Ormawa tidak bisa akses dashboard Puskaka
     *
     * Validates:
     * - Middleware 'puskaka' berfungsi
     * - Role-based authorization
     * - Unauthorized access ditolak
     */
    public function test_ormawa_user_cannot_access_puskaka_dashboard(): void
    {
        // Arrange: Buat user ormawa
        $user = User::factory()->create([
            'role' => 'ormawa',
            'email_verified_at' => now(),
        ]);

        // Act: Coba akses dashboard puskaka
        $response = $this->actingAs($user)->get('/dashboard/puskaka');

        // Assert: Forbidden atau redirect (tergantung middleware implementation)
        $response->assertStatus(403); // atau assertRedirect() jika middleware redirect
    }
}
