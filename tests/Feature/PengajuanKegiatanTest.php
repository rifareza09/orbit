<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\PengajuanKegiatan;

class PengajuanKegiatanTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_delete_unsubmitted_pengajuan(): void
    {
        $user = User::factory()->create();
        $pengajuan = PengajuanKegiatan::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete("/pengajuan-kegiatan/{$pengajuan->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('pengajuan_kegiatans', ['id' => $pengajuan->id]);
    }
}
