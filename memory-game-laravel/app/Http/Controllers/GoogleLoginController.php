<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class GoogleLoginController extends Controller
{
    public function googleLogin(Request $request)
    {
        $googleUser = $request->input('jwtData');
        \Log::info('Google User Data:', $googleUser);

        // Check if the "sub" key exists in the $googleUser array
        if (isset($googleUser['sub'])) {
            // Continue with the existing logic
            $user = User::where('google_id', $googleUser['sub'])->first();

            if (!$user) {
                $defaultProfilePicture = 'storage/DefaultUserPicture.jpeg';
                $user = User::create([
                    'google_id' => $googleUser['sub'],
                    // 'google_email' => $googleUser['email'],
                    'email' => $googleUser['email'],
                    'image_path' => $defaultProfilePicture,
                ]);
            }

            $token = $user->createToken('authToken')->plainTextToken;

            return response()->json([
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 200);
        } else {
            // Handle the case where "sub" key is not present
            return response()->json(['error' => 'Missing "sub" key in Google user data'], 400);
        }
    }
}
