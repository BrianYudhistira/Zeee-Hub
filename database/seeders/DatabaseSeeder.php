<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'brianyudhistira1@gmail.com',
            'username' => 'brianyudhistira',
            'password' => bcrypt('password'),
            'photo_path' => null,
            'role' => 'admin',
        ]);
        User::factory()->create([
            'name' => 'test',
            'email' => 'test@mail.com',
            'username' => 'testuser',
            'password' => bcrypt('password'),
            'photo_path' => null,
            'role' => 'user',
        ]);

        // Seed portfolio data
        $this->call(PortfolioSeeder::class);

    }
}