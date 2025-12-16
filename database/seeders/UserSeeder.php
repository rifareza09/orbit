<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            // UKM Role
            [
                'name' => 'LDK KAHFI',
                'username' => 'ldk',
                'password' => Hash::make('ldk123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'VOYAGE',
                'username' => 'voyage',
                'password' => Hash::make('voyage123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'HIMASI',
                'username' => 'himasi',
                'password' => Hash::make('himasi123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'IMASI',
                'username' => 'imasi',
                'password' => Hash::make('imasi123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'YBBC',
                'username' => 'ybbc',
                'password' => Hash::make('ybbc123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'SMAKA',
                'username' => 'smaka',
                'password' => Hash::make('smaka123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'HMSI',
                'username' => 'hmsi',
                'password' => Hash::make('hmsi123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'KARIR ALUMNI',
                'username' => 'karir',
                'password' => Hash::make('karir123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'OASIS',
                'username' => 'oasis',
                'password' => Hash::make('oasis123'),
                'role' => 'ukm',
            ],

            // BEM Role
            [
                'name' => 'BEM',
                'username' => 'bem',
                'password' => Hash::make('bem123'),
                'role' => 'bem',
            ],

            // Kongres Role
            [
                'name' => 'KONGRES',
                'username' => 'kongres',
                'password' => Hash::make('kongres123'),
                'role' => 'kongres',
            ],

            // Admin Role (Puskaka)
            [
                'name' => 'PUSKAKA',
                'username' => 'puskaka',
                'password' => Hash::make('puskaka123'),
                'role' => 'puskaka',
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
