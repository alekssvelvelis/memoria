<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            ['achievement' => 'Speed Demon', 'description' => 'Beat any level in under 30 seconds', 'image_path' => 'storage/SpeedDemon.jpeg'],
            ['achievement' => 'Welcome to Memoria!', 'description' => 'Complete your first game', 'image_path' => 'storage/WelcomeToMemoria.jpeg'],
            ['achievement' => 'Just getting started', 'description' => 'Play 10 games', 'image_path' => 'storage/DefaultProfilePicture.jpeg'],
            ['achievement' => 'Max Scale', 'description' => 'Complete any level on the 7x7 difficulty', 'image_path' => 'storage/DefaultProfilePicture.jpeg'],
        ];

        DB::table('achievements')->insert($achievements);
    }
}
