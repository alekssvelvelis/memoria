<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnimatedBackgroundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $backgrounds = [
            ['name' => 'globe', 'price' => 11500, 'image_path' => 'storage/globe.jpeg', 'description' => 'A 3D globe that rotates atop a 3D plane'],
            ['name' => 'net', 'price' => 10000, 'image_path' => 'storage/net.jpeg', 'description' => 'A 3D net with many connecting points that you can rotate using your mouse'],
            ['name' => 'birds', 'price' => 8500, 'image_path' => 'storage/birds.jpeg', 'description' => 'Birds that fly around the screen, hovering your mouse over them makes them scatter'],
        ];

        DB::table('animated_backgrounds')->insert($backgrounds);
    }
}
