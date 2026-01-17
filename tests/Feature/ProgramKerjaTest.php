<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ProgramKerja;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Program Kerja Feature Test
 *
 * Menguji fitur Program Kerja dari perspektif user:
 * - Create program kerja
 * - Read/view program kerja
 * - Update program kerja
 * - Submit (ajukan) program kerja
 * - Delete program kerja
 *
 * Files yang ditest secara tidak langsung:
 * - routes/web.php (program-kerja routes)
 * - app/Http/Controllers/ProgramKerjaController.php
 * - app/Models/ProgramKerja.php
 * - database/migrations/*_create_program_kerja_table.php
 * - app/Services/NotificationService.php (saat ajukan)
 */
class ProgramKerjaTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_their_program_kerja_list(): void
    {
        $user = User::factory()->create();
        ProgramKerja::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/program-kerja');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('program-kerja/index')
            ->has('programs')
        );
    }

    public function test_user_can_update_their_program_kerja(): void
    {
        $user = User::factory()->create();
        $programKerja = ProgramKerja::factory()->create(['user_id' => $user->id]);

        $updateData = [
            'program_kerja' => 'Program Updated',
            'kegiatan' => 'Kegiatan Updated',
            'deskripsi_kegiatan' => 'Deskripsi updated',
            'jenis_kegiatan' => 'Insidental',
            'estimasi_anggaran' => 10000000,
        ];

        $response = $this->actingAs($user)
            ->put("/program-kerja/{$programKerja->id}", $updateData);

        $response->assertRedirect('/program-kerja');
        $this->assertDatabaseHas('program_kerjas', [
            'id' => $programKerja->id,
            'program_kerja' => 'Program Updated',
        ]);
    }

    public function test_user_can_delete_their_program_kerja(): void
    {
        $user = User::factory()->create();
        $programKerja = ProgramKerja::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete("/program-kerja/{$programKerja->id}");

        $response->assertRedirect('/program-kerja');
        $this->assertDatabaseMissing('program_kerjas', ['id' => $programKerja->id]);
    }
}
