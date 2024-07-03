<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class PlayedGames extends Model
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'user_id',
        'turn_count',
        'pair_count',
        'time_left', 
        'difficulty',
        'theme_id',
        'game_outcome',
        'money_earned',
    ];

    public function theme()
    {
        return $this->belongsTo(GameTheme::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
