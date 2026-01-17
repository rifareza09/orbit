<?php

namespace Database\Factories;

use App\Models\LaporanKegiatan;
use App\Models\User;
use App\Models\PengajuanKegiatan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LaporanKegiatan>
 */
class LaporanKegiatanFactory extends Factory
{
    protected $model = LaporanKegiatan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'pengajuan_kegiatan_id' => PengajuanKegiatan::factory(),
            'anggaran_disetujui' => fake()->numberBetween(5000000, 30000000),
            'anggaran_realisasi' => fake()->numberBetween(4000000, 25000000),
            'ringkasan' => fake()->paragraph(),
            'status' => 'Draft',
            'lpj_file' => null,
            'bukti_pengeluaran' => null,
            'dokumentasi' => null,
        ];
    }

    /**
     * Indicate that the laporan is submitted.
     */
    public function submitted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Diajukan',
        ]);
    }

    /**
     * Indicate that the laporan is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Disetujui',
        ]);
    }

    /**
     * Indicate that the laporan is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Selesai',
        ]);
    }
}
