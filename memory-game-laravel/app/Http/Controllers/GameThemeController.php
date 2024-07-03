<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GameTheme;

class GameThemeController extends Controller
{
    public function getGameThemes()
    {
        $themes = GameTheme::all();
        return response()->json(['themes' => $themes], 200);
    }
}
