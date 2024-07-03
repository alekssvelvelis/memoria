<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GameThemeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $themes = [
            ['theme' => 'historic'],
            ['theme' => 'futuristic'],
            ['theme' => 'nature'],
            ['theme' => 'animal'],
        ];

        DB::table('game_themes')->insert($themes);
    }
}
