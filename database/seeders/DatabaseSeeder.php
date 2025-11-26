<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = [
            // UKM Role
            ['name' => 'LDK KAHFI', 'username' => 'ldk', 'role' => 'ukm'],
            ['name' => 'VOYAGE', 'username' => 'voyage', 'role' => 'ukm'],
            ['name' => 'HIMASI', 'username' => 'himasi', 'role' => 'ukm'],
            ['name' => 'YBBC', 'username' => 'ybbc', 'role' => 'ukm'],
            ['name' => 'SMAKA', 'username' => 'smaka', 'role' => 'ukm'],

            // BEM Role
            ['name' => 'BEM', 'username' => 'bem', 'role' => 'bem'],

            // Kongres Role
            ['name' => 'KONGRES', 'username' => 'kongres', 'role' => 'kongres'],

            // Admin Role (Puskaka)
            ['name' => 'PUSKAKA', 'username' => 'puskaka', 'role' => 'puskaka'],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['username' => $user['username']], // unique key
                [
                    'name' => $user['name'],
                    'username' => $user['username'],
                    'password' => Hash::make($user['username'] . '123'),
                    'role' => $user['role'],
                ]
            );
        }
    }
}
