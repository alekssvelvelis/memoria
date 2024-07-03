<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBackgrounds extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'background_id',
    ];

    public function background()
    {
        return $this->belongsTo(AnimatedBackgrounds::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
