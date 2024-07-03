<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\PlayedGames;
use App\Models\GameTheme;
use Illuminate\Support\Facades\Log;

class PlayedGamesController extends Controller
{
    function formattedTimeToSeconds($formattedTime)
    {
        list($minutes, $seconds) = explode(':', $formattedTime);
        return $minutes * 60 + $seconds;
    }

    public function savePlayedGame(Request $request)
    {   
        Log::info($request->all());
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $validator = Validator::make($request->all(), [
            'turn_count' => 'required|integer|min:0',
            'pair_count' => 'required|integer|min:0|max:16',
            'difficulty' => 'required|integer|min:3|max:7',
            'theme' => 'required|string',
            'time' => 'required|integer',
            'gameOutcome' => 'required|boolean',
            'moneyEarned' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $themeId = GameTheme::where('theme', $request->input('theme'))->value('id');
        Log::info($themeId);
        if (!$themeId) {
            return response()->json(['error' => 'Theme not found'], 422);
        }
        
        $game = PlayedGames::create([
            'turn_count' => $request->input('turn_count'),
            'pair_count' => $request->input('pair_count'),
            'user_id' => $user->id,
            'difficulty' => $request->input('difficulty'),
            'theme_id' => $themeId,
            'time_left' => $request->input('time'),
            'game_outcome' => $request->input('gameOutcome'),
            'money_earned' => $request->input('moneyEarned'),
        ]);

        return response()->json([
            'message' => 'Game saved successfully',
        ], 201);
    }
    public function getUserGames(Request $request)
    {
        try {
            $user = Auth::user();
            Log::info($user);
            $games = $user->PlayedGames;
            $games->load('theme');
    
            return response()->json(['games' => $games], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
    public function getAllGames(Request $request)
    {
        try {
            $games = PlayedGames::where('game_outcome', 1)->get();
            $games->load('theme');
            $games->transform(function ($game) {
                $game['username'] = $game->user->username;
                unset($game['user']);
                return $game;
            });
    
            return response()->json(['games' => $games], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }
}
