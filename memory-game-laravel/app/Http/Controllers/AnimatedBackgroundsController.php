<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AnimatedBackgrounds;

class AnimatedBackgroundsController extends Controller
{
    public function getAnimatedBackgrounds()
    {
        $backgrounds = AnimatedBackgrounds::all();
        return response()->json(['backgrounds' => $backgrounds], 200);
    }
}
