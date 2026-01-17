<?php

namespace Database\Factories;

use App\Models\Dokumentasi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Dokumentasi>
 */
class DokumentasiFactory extends Factory
{
    protected $model = Dokumentasi::class;

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
            'tanggal_kegiatan' => fake()->dateTimeBetween('-1 month', 'now'),
            'foto_path' => 'dokumentasi/sample-' . fake()->unique()->numberBetween(1000, 9999) . '.jpg',
        ];
    }
}
