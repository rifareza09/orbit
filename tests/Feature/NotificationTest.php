<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Notification Feature Test
 *
 * Menguji fitur notifikasi sistem:
 * - API endpoint untuk fetch notifications
 * - Mark as read functionality
 * - Notification count
 *
 * Files yang ditest secara tidak langsung:
 * - routes/web.php (api/notifications routes)
 * - app/Http/Controllers/NotificationController.php
 * - app/Models/Notification.php
 * - app/Services/NotificationService.php
 */
class NotificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: User dapat mengambil daftar notifikasi via API
     *
     * Validates:
     * - GET /api/notifications/recent route berfungsi
     * - NotificationController@recent berfungsi
     * - Filter by user_id berfungsi
     * - Response format JSON benar
     */
    public function test_user_can_fetch_notifications(): void
    {
        // Arrange: Buat user dan notifikasi
        $user = User::factory()->create(['email_verified_at' => now()]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'program_kerja_submitted',
            'title' => 'Program Kerja Baru',
            'message' => 'Test notification message',
            'is_read' => false,
        ]);

        // Act: Fetch notifications via API
        $response = $this->actingAs($user)
            ->getJson('/api/notifications/recent');

        // Assert:
        // - HTTP 200 OK
        // - Response JSON dengan struktur benar
        // - Ada 1 notifikasi
        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonStructure([
            '*' => ['id', 'type', 'title', 'message', 'is_read', 'created_at']
        ]);
    }

    /**
     * Test: User dapat mengambil jumlah notifikasi unread
     *
     * Validates:
     * - GET /api/notifications/unread-count route berfungsi
     * - NotificationController@unreadCount berfungsi
     * - Scope unread() di model berfungsi
     */
    public function test_user_can_get_unread_notification_count(): void
    {
        // Arrange: Buat user dengan 2 unread notifications
        $user = User::factory()->create(['email_verified_at' => now()]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Unread 1',
            'message' => 'Test',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Unread 2',
            'message' => 'Test',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Read',
            'message' => 'Test',
            'is_read' => true, // Sudah dibaca
        ]);

        // Act: Fetch unread count
        $response = $this->actingAs($user)
            ->getJson('/api/notifications/unread-count');

        // Assert:
        // - HTTP 200 OK
        // - Count = 2 (hanya yang unread)
        $response->assertOk();
        $response->assertJson(['count' => 2]);
    }

    /**
     * Test: User dapat mark notification as read
     *
     * Validates:
     * - POST /api/notifications/{id}/read route berfungsi
     * - NotificationController@markAsRead berfungsi
     * - Model method markAsRead() berfungsi
     * - is_read berubah menjadi true
     */
    public function test_user_can_mark_notification_as_read(): void
    {
        // Arrange: Buat notifikasi unread
        $user = User::factory()->create(['email_verified_at' => now()]);

        $notification = Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Test Notification',
            'message' => 'Test',
            'is_read' => false,
        ]);

        // Act: Mark as read via API
        $response = $this->actingAs($user)
            ->postJson("/api/notifications/{$notification->id}/read");

        // Assert:
        // - HTTP 200 OK
        // - is_read berubah menjadi true
        // - read_at terisi
        $response->assertOk();
        $this->assertDatabaseHas('notifications', [
            'id' => $notification->id,
            'is_read' => true,
        ]);

        $notification->refresh();
        $this->assertNotNull($notification->read_at);
    }

    /**
     * Test: User dapat mark all notifications as read
     *
     * Validates:
     * - POST /api/notifications/mark-all-read route berfungsi
     * - NotificationController@markAllAsRead berfungsi
     * - Bulk update berfungsi
     */
    public function test_user_can_mark_all_notifications_as_read(): void
    {
        // Arrange: Buat 3 unread notifications
        $user = User::factory()->create(['email_verified_at' => now()]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Notif 1',
            'message' => 'Test',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Notif 2',
            'message' => 'Test',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'type' => 'test',
            'title' => 'Notif 3',
            'message' => 'Test',
            'is_read' => false,
        ]);

        // Act: Mark all as read
        $response = $this->actingAs($user)
            ->postJson('/api/notifications/mark-all-read');

        // Assert:
        // - HTTP 200 OK
        // - Semua notifikasi user menjadi read
        $response->assertOk();

        $unreadCount = Notification::where('user_id', $user->id)
            ->where('is_read', false)
            ->count();

        $this->assertEquals(0, $unreadCount);
    }

    /**
     * Test: User tidak bisa akses notifikasi user lain
     *
     * Validates:
     * - Authorization berfungsi
     * - User isolation di query
     */
    public function test_user_cannot_access_other_user_notifications(): void
    {
        // Arrange: Buat 2 user dengan notifikasi masing-masing
        $user1 = User::factory()->create(['email_verified_at' => now()]);
        $user2 = User::factory()->create(['email_verified_at' => now()]);

        $notification1 = Notification::create([
            'user_id' => $user1->id,
            'type' => 'test',
            'title' => 'User 1 Notif',
            'message' => 'Test',
            'is_read' => false,
        ]);

        Notification::create([
            'user_id' => $user2->id,
            'type' => 'test',
            'title' => 'User 2 Notif',
            'message' => 'Test',
            'is_read' => false,
        ]);

        // Act: User 1 fetch notifications
        $response = $this->actingAs($user1)
            ->getJson('/api/notifications/recent');

        // Assert:
        // - Hanya dapat notifikasi user 1 (1 notifikasi)
        // - Tidak dapat notifikasi user 2
        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['title' => 'User 1 Notif']);
        $response->assertJsonMissing(['title' => 'User 2 Notif']);
    }
}
