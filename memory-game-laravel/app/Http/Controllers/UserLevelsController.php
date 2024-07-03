<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\UserLevels;
use App\Models\GameTheme;
use Illuminate\Support\Facades\Log;

class UserLevelsController extends Controller
{
    public function saveClearedLevel(Request $request)
    {   
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $validator = Validator::make($request->all(), [
            'difficulty' => 'required|integer|min:3|max:7',
            'theme' => 'required|string',
            'gameOutcome' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        if($request->gameOutcome !== 1){
            return response()->json(['message' => 'game is lost']);
        }

        $themeId = GameTheme::where('theme', $request->input('theme'))->value('id');
        if (!$themeId) {
            return response()->json(['error' => 'Theme not found'], 422);
        }
        
        $existingClearedLevel = UserLevels::where('user_id', $user->id)
                                        ->where('difficulty', $request->input('difficulty'))
                                        ->where('theme_id', $themeId)
                                        ->first();

        if ($existingClearedLevel) {
            return response()->json(['message' => 'Level-clear already saved'], 200);
        }
        
        $game = UserLevels::create([
            'user_id' => $user->id,
            'difficulty' => $request->input('difficulty'),
            'theme_id' => $themeId,
        ]);

        return response()->json([
            'message' => 'Level-clear saved successfully',
        ], 201);
    }

    public function getClearedLevels(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $theme = $request->query('theme');

        // Check if theme is provided
        if (!$theme) {
            return response()->json(['error' => 'Theme is required'], 422);
        }

        // Find the theme ID based on the theme name
        $themeId = GameTheme::where('theme', $theme)->value('id');

        if (!$themeId) {
            return response()->json(['error' => 'Theme not found'], 422);
        }

        // Query cleared levels for the authenticated user and specified theme
        $clearedLevels = UserLevels::where('user_id', $user->id)
                                    ->where('theme_id', $themeId)
                                    ->get();

        return response()->json(['cleared_levels' => $clearedLevels], 200);
    }

}
