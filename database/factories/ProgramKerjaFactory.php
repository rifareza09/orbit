<?php

namespace Database\Factories;

use App\Models\ProgramKerja;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProgramKerja>
 */
class ProgramKerjaFactory extends Factory
{
    protected $model = ProgramKerja::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'program_kerja' => fake()->sentence(3),
            'kegiatan' => fake()->sentence(4),
            'deskripsi_kegiatan' => fake()->paragraph(),
            'jenis_kegiatan' => fake()->randomElement(['Rutin', 'Insidental', 'Tahunan']),
            'estimasi_anggaran' => fake()->numberBetween(1000000, 50000000),
            'status' => 'Diajukan',
        ];
    }

    /**
     * Indicate that the program kerja is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Disetujui',
        ]);
    }

    /**
     * Indicate that the program kerja is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Ditolak',
        ]);
    }
}
