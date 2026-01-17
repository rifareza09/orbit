<?php

namespace Database\Factories;

use App\Models\PengajuanKegiatan;
use App\Models\User;
use App\Models\ProgramKerja;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PengajuanKegiatan>
 */
class PengajuanKegiatanFactory extends Factory
{
    protected $model = PengajuanKegiatan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nama_kegiatan' => fake()->sentence(4),
            'ketua_pelaksana' => fake()->name(),
            'tempat_pelaksanaan' => fake()->address(),
            'tanggal_pelaksanaan' => fake()->dateTimeBetween('+1 week', '+3 months'),
            'total_anggaran' => fake()->numberBetween(1000000, 50000000),
            'status' => 'Belum Diajukan',
            'deskripsi' => fake()->paragraph(),
        ];
    }

    /**
     * Indicate that the pengajuan is submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Diajukan',
        ]);
    }

    /**
     * Indicate that the pengajuan is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Disetujui',
        ]);
    }

    /**
     * Indicate that the pengajuan is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Ditolak',
        ]);
    }

    /**
     * Indicate that the pengajuan is under review.
     */
    public function underReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Direview',
        ]);
    }
}
