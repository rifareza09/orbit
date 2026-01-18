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
            ['name' => 'LDK KAHFI', 'username' => 'ldk', 'email' => 'ldk@example.com', 'role' => 'ukm'],
            ['name' => 'VOYAGE', 'username' => 'voyage', 'email' => 'voyage@example.com', 'role' => 'ukm'],
            ['name' => 'IMASI', 'username' => 'imasi', 'email' => 'imasi@example.com', 'role' => 'ukm'],
            ['name' => 'YBBC', 'username' => 'ybbc', 'email' => 'ybbc@example.com', 'role' => 'ukm'],
            ['name' => 'SMAKA', 'username' => 'smaka', 'email' => 'smaka@example.com', 'role' => 'ukm'],
            ['name' => 'TDM', 'username' => 'tdm', 'email' => 'tdm@example.com', 'role' => 'ukm'],
            ['name' => 'LPM', 'username' => 'lpm', 'email' => 'lpm@example.com', 'role' => 'ukm'],
            ['name' => 'KREASI', 'username' => 'kreasi', 'email' => 'kreasi@example.com', 'role' => 'ukm'],

            // BEM Role
            ['name' => 'BEM', 'username' => 'bem', 'email' => 'bem@example.com', 'role' => 'bem'],

            // Kongres Role
            ['name' => 'KONGRES', 'username' => 'kongres', 'email' => 'kongres@example.com', 'role' => 'kongres'],

            // Admin Role (Puskaka)
            ['name' => 'PUSKAKA', 'username' => 'puskaka', 'email' => 'puskaka@example.com', 'role' => 'puskaka'],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['username' => $user['username']], // unique key
                [
                    'name' => $user['name'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'password' => Hash::make($user['username'] . '123'),
                    'role' => $user['role'],
                ]
            );
        }
    }
}
