<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\UserBackgrounds;
use App\Models\AnimatedBackgrounds;
use Illuminate\Support\Facades\Log;

class UserBackgroundsController extends Controller
{
    public function getUserBackgrounds(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        Log::info($user->id);
        $backgrounds = UserBackgrounds::where('user_id', $user->id)->get();

        return response()->json(['backgrounds' => $backgrounds], 200);
    }

    public function purchaseBackground(Request $request)
    {   
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }
        Log::info($request->all());
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $backgroundToBuy = AnimatedBackgrounds::where('name', $request->input('name'))->first();
        if(!$backgroundToBuy){
            return response()->json(['error' => 'Background not found'], 422);
        }

        if ($user->money < $backgroundToBuy->price) {
            return response()->json(['error' => 'You do not have enough money'], 422);
        }

        $user->money -= $backgroundToBuy->price;
        $user->save();
        
        $purchase = UserBackgrounds::create([
            'user_id' => $user->id,
            'background_id' => $backgroundToBuy->id,
        ]);

        if($purchase){
            return response()->json([
                'message' => 'Background purchased!',
                'newMoney' => $user->money,
            ], 201);
        }
    }

    public function updateBackground(Request $request)
    {
        $user = $request->user();
        Log::info($request->all());
        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $background = AnimatedBackgrounds::where('name', $request->name)->first();

        if (!$background) {
            return response()->json(['error' => 'Background not found'], 404);
        }

        $user->background_id = $background->id;
        $user->save();

        return response()->json(['message' => 'Background updated successfully'], 200);
    }
}
