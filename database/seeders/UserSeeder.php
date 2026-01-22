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
                'email' => 'ldk@example.com',
                'password' => Hash::make('ldk123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'VOYAGE',
                'username' => 'voyage',
                'email' => 'voyage@example.com',
                'password' => Hash::make('voyage123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'IMASI',
                'username' => 'imasi',
                'email' => 'imasi@example.com',
                'password' => Hash::make('imasi123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'YBBC',
                'username' => 'ybbc',
                'email' => 'ybbc@example.com',
                'password' => Hash::make('ybbc123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'TDM',
                'username' => 'tdm',
                'email' => 'tdm@example.com',
                'password' => Hash::make('tdm123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'LPM',
                'username' => 'lpm',
                'email' => 'lpm@example.com',
                'password' => Hash::make('lpm123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'SMAKA',
                'username' => 'smaka',
                'email' => 'smaka@example.com',
                'password' => Hash::make('smaka123'),
                'role' => 'ukm',
            ],
            [
                'name' => 'KREASI',
                'username' => 'kreasi',
                'email' => 'kreasi@example.com',
                'password' => Hash::make('kreasi123'),
                'role' => 'ukm',
            ],

            // BEM Role
            [
                'name' => 'BEM',
                'username' => 'bem',
                'email' => 'bem@example.com',
                'password' => Hash::make('bem123'),
                'role' => 'bem',
            ],

            // Kongres Role
            [
                'name' => 'KONGRES',
                'username' => 'kongres',
                'email' => 'kongres@example.com',
                'password' => Hash::make('kongres123'),
                'role' => 'kongres',
            ],

            // Admin Role (Puskaka)
            [
                'name' => 'PUSKAKA',
                'username' => 'puskaka',
                'email' => 'puskaka@example.com',
                'password' => Hash::make('puskaka123'),
                'role' => 'puskaka',
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }
    }
}
