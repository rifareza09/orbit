<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\User;
use App\Models\Prestasi;

class PrestasiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_user_can_view_their_prestasi_list(): void
    {
        $user = User::factory()->create();
        Prestasi::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/prestasi');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('prestasi/index')
            ->has('prestasis')
        );
    }

    public function test_user_can_create_prestasi(): void
    {
        $user = User::factory()->create();

        $data = [
            'nama_prestasi' => 'Juara 1 Lomba Programming',
            'jenis_prestasi' => 'Akademik',
            'tingkat_kejuaraan' => 'Nasional',
            'nama_peraih' => 'John Doe',
            'tanggal_perolehan' => now()->format('Y-m-d'),
        ];

        $response = $this->actingAs($user)
            ->post('/prestasi', $data);

        $response->assertRedirect('/prestasi');
        $this->assertDatabaseHas('prestasis', [
            'user_id' => $user->id,
            'nama_prestasi' => 'Juara 1 Lomba Programming',
            'tingkat_kejuaraan' => 'Nasional',
        ]);
    }

    public function test_user_can_delete_their_prestasi(): void
    {
        $user = User::factory()->create();
        $prestasi = Prestasi::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete("/prestasi/{$prestasi->id}");

        $response->assertRedirect('/prestasi');
        $this->assertDatabaseMissing('prestasis', ['id' => $prestasi->id]);
    }

    public function test_prestasi_validation_requires_all_fields(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->post('/prestasi', []);

        $response->assertSessionHasErrors([
            'nama_prestasi',
            'jenis_prestasi',
            'tingkat_kejuaraan',
            'nama_peraih',
            'tanggal_perolehan',
        ]);
    }
}
