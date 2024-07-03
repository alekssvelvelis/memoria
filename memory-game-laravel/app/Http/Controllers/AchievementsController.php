<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Achievements;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AchievementsController extends Controller
{
    public function getAchievements()
    {
        $achievements = Achievements::all();
        return response()->json(['achievements' => $achievements], 200);
    }

    public function checkAndAwardAchievement(Request $request)
    {
        $user = $request->user();
        Log::info($user);
        Log::info($request->all());
        $gamesPlayed = $user->playedGames()->count();
        Log::info($gamesPlayed);

        // Check each achievement individually
        $awardedAchievements = [];

        if ($gamesPlayed >= 10 && !$user->hasAchievement('Just getting started')) {
            $achievement2 = Achievements::where('achievement', 'Just getting started')->first();
            if ($achievement2) {
                $user->achievements()->attach($achievement2->id);
                $awardedAchievements[] = 'Just getting started';
            } else {
                return response()->json(['message' => 'Achievement not found'], 404);
            }
        }
        if ($user->playedGames()->where('difficulty', 7)->count() > 0 && !$user->hasAchievement('Max Scale')) {
            $achievement3 = Achievements::where('achievement', 'Max Scale')->first();
            if ($achievement3) {
                $user->achievements()->attach($achievement3->id);
                $awardedAchievements[] = 'Max Scale';
            } else {
                return response()->json(['message' => 'Achievement not found'], 404);
            }
        }
        
        $speedDemonGame = $user->playedGames()->where('time_left', '<', 30)->first();
        if ($speedDemonGame && !$user->hasAchievement('Speed Demon')) {
            $achievement4 = Achievements::where('achievement', 'Speed Demon')->first();
            if ($achievement4) {
                $user->achievements()->attach($achievement4->id);
                $awardedAchievements[] = 'Speed Demon';
            } else {
                return response()->json(['message' => 'Achievement not found'], 404);
            }
        }

        if ($gamesPlayed >= 0 && !$user->hasAchievement('Welcome to Memoria!')) {
            $achievement = Achievements::where('achievement', 'Welcome to Memoria!')->first();
            if ($achievement) {
                $user->achievements()->attach($achievement->id);
                $awardedAchievements[] = 'Welcome to Memoria!';
            } else {
                return response()->json(['error' => 'Achievement not found'], 404);
            }
        }

        // Check if any achievements were awarded
        if (!empty($awardedAchievements)) {
            return response()->json(['message' => '' . implode(',   ', $awardedAchievements)], 200);
        } else {
            return response()->json(['message' => 'User already has all available achievements or no achievements were awarded'], 200);
        }
    }

    public function getUserAchievements(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $achievements = $user->achievements()->get();
        $totalAchievements = Achievements::all();
        return response()->json(['achievements' => $achievements, 'totalAchievements' => $totalAchievements], 200);
    }
}
