<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnimatedBackgrounds extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
        'description',
        'image_path',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_backgrounds')->withTimestamps();
    }
}
