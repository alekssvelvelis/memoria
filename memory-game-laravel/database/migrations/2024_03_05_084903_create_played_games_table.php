<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('played_games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('theme_id');
            $table->timestamps();
            $table->integer('turn_count');
            $table->integer('time_left');
            $table->integer('pair_count');
            $table->integer('difficulty');
            $table->boolean('game_outcome');
            $table->integer('money_earned');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
