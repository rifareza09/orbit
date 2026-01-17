<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;
use App\Models\Dokumentasi;

class DokumentasiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_user_can_upload_dokumentasi(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('kegiatan.jpg');

        $data = [
            'nama_kegiatan' => 'Seminar Teknologi',
            'tanggal_kegiatan' => now()->format('Y-m-d'),
            'foto' => $file,
        ];

        $response = $this->actingAs($user)
            ->post('/dokumentasi', $data);

        $response->assertRedirect('/dokumentasi');
        $this->assertDatabaseHas('dokumentasis', [
            'user_id' => $user->id,
            'nama_kegiatan' => 'Seminar Teknologi',
        ]);

        Storage::disk('public')->assertExists('dokumentasi/' . $file->hashName());
    }

    public function test_dokumentasi_requires_valid_image(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->create('document.pdf', 100);

        $data = [
            'nama_kegiatan' => 'Test Event',
            'tanggal_kegiatan' => now()->format('Y-m-d'),
            'foto' => $file,
        ];

        $response = $this->actingAs($user)
            ->post('/dokumentasi', $data);

        $response->assertSessionHasErrors('foto');
    }

    public function test_user_can_delete_their_dokumentasi(): void
    {
        $user = User::factory()->create();
        $dokumentasi = Dokumentasi::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete("/dokumentasi/{$dokumentasi->id}");

        $response->assertRedirect('/dokumentasi');
        $this->assertDatabaseMissing('dokumentasis', ['id' => $dokumentasi->id]);
    }

    public function test_dokumentasi_file_size_limit(): void
    {
        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('huge-image.jpg')->size(6000); // 6MB

        $data = [
            'nama_kegiatan' => 'Test Event',
            'tanggal_kegiatan' => now()->format('Y-m-d'),
            'foto' => $file,
        ];

        $response = $this->actingAs($user)
            ->post('/dokumentasi', $data);

        $response->assertSessionHasErrors('foto');
    }
}
