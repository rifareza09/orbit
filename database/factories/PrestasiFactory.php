<?php

namespace Database\Factories;

use App\Models\Prestasi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Prestasi>
 */
class PrestasiFactory extends Factory
{
    protected $model = Prestasi::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nama_prestasi' => fake()->sentence(3),
            'jenis_prestasi' => fake()->randomElement(['Akademik', 'Non-Akademik', 'Seni', 'Olahraga']),
            'tingkat_kejuaraan' => fake()->randomElement(['Kampus', 'Lokal', 'Regional', 'Nasional', 'Internasional']),
            'nama_peraih' => fake()->name(),
            'tanggal_perolehan' => fake()->dateTimeBetween('-1 year', 'now'),
            'bukti_path' => 'prestasi/bukti-' . fake()->unique()->numberBetween(1000, 9999) . '.pdf',
        ];
    }
}
