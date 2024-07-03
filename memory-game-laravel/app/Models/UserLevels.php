<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class UserLevels extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'theme_id',
        'difficulty',
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
