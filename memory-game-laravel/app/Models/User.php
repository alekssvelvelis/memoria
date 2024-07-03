<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'google_id', 
        // 'google_email',
        'image_path',
        'money',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function PlayedGames()
    {
        return $this->hasMany(PlayedGames::class);
    }

    public function achievements()
    {
        return $this->belongsToMany(Achievements::class, 'user_achievements', 'user_id', 'achievement_id')->withTimestamps();
    }

    public function hasAchievement($achievementName)
    {
        return $this->achievements()->where('achievement', $achievementName)->exists();
    }

    public function backgrounds()
    {
        return $this->belongsToMany(UserBackgrounds::class, 'user_backgrounds', 'user_id', 'background_id')->withTimestamps();
    }

    public function hasBackground($backgroundId)
    {
        return $this->backgrounds()->where('background_id', $backgroundId)->exists();
    }


}
