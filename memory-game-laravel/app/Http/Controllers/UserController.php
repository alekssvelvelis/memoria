<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\AnimatedBackgrounds;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Input missing', 'details' => $validator->errors()], 422);
        }

        $credentials = request(['username', 'password']);

        if (!Auth::attempt($credentials)) {
            $user = User::where('username', $request->input('username'))->first();
    
            if (!$user) {
                return response()->json(['error' => 'Invalid account'], 401);
            }
    
            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json(['error' => 'Incorrect password'], 401);
            }
    
            return response()->json(['error' => 'Authentication failed'], 401);
        }

        $user = Auth::user();

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 200);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'registerUsername' => 'required|string|min:3|max:15|unique:users,username',
            'registerEmail' => 'required|email|min:4|max:100|unique:users,email',
            'registerPassword' => 'required|min:8',
            'confirmRegisterPassword' => 'required|same:registerPassword|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $defaultProfilePicture = 'storage/DefaultUserPicture.jpeg';

        $user = User::create([
            'email' => $request->input('registerEmail'),
            'username' => $request->input('registerUsername'),
            'password' => Hash::make($request->input('registerPassword')),
            'image_path' => $defaultProfilePicture,
        ]);

        $token = $user->createToken('authToken')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
        ], 201);
    }

    public function logout(Request $request)
    {
        Log::info($request->bearerToken());
        $user = $request->user();
        Log::info($user);

        if ($user) {
            // Revoke the user's current token
            $user->currentAccessToken()->delete();

            return response()->json(['message' => 'Successfully logged out']);
        }

        return response()->json(['error' => 'Invalid token'], 401);
    }

    public function updatePassword(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }
            if($user->password){
                $validator = Validator::make($request->all(), [
                    'currentPassword' => 'required',
                    'password' => 'required|min:8',
                    'confirmPassword' => 'required|same:password|min:8'
                ]);
            }else{
                $validator = Validator::make($request->all(), [
                    'password' => 'required|min:8',
                    'confirmPassword' => 'required|same:password|min:8'
                ]);
            }
    
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            if($user->password){
                $currentPassword = $request->input('currentPassword');

                if (!Hash::check($currentPassword, $user->password)) {
                    return response()->json(['error' => 'Invalid current password'], 422);
                }
            }
            $newPassword = $request->input('password');
            $user->update(['password' => Hash::make($newPassword)]);

            return response()->json(['message' => 'Password updated successfully']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getUserData(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }
            $password_hash = false;
            $user->image_path = asset($user->image_path);
            if($user->password){
                $password_hash = true;
            }
            $user['password_hash'] = $password_hash;
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getUserMoney(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $money = $user->money;

            return response()->json(['money' => $money], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function getUserBackground(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $backgroundId = $user->background_id;

            if($backgroundId === 0){
                return response()->json(['background' => 'default'], 200);
            }

            $background = AnimatedBackgrounds::where('id', $backgroundId)->first();

            if (!$background) {
                return response()->json(['error' => 'Background not found'], 404);
            }

            return response()->json(['background' => $background->name], 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function updateUser(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }
            Log::info($request->all());
            $validator = Validator::make($request->all(), [
                'profileUsername' => 'required|string|min:3|max:32|unique:users,username,' . $user->id,
                'profileEmail' => 'required|email|min:4|max:100|unique:users,email,' . $user->id,
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            $user->update([
                'username' => $request->input('profileUsername'),
                'email' => $request->input('profileEmail'),
            ]);

            return response()->json(['message' => 'User data updated successfully']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function updateUserImage(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }
            Log::info($request->all());
            $validator = Validator::make($request->all(), [
                'profilePicture' => 'required|mimes:jpg,jpeg,png,gif' . $user->id,
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            if ($request->hasFile('profilePicture')) {
                if ($user->image_path) {
                    Storage::delete('public/profiles/' . basename($user->image_path));
                }
    
                $image = $request->file('profilePicture');
                $imageName = 'user_' . $user->id . '_' . time() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('public/profiles', $imageName);
                $user->update(['image_path' => 'storage/profiles/'.$imageName]);
            }

            return response()->json(['message' => 'User image updated successfully']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function updateMoneyEarned(Request $request)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'Invalid token'], 401);
            }

            $validator = Validator::make($request->all(), [
                'moneyEarned' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $moneyEarned = $request->input('moneyEarned');

            // Update the user's money earned in the database
            $user->update([
                'money' => $user->money + $moneyEarned
            ]);

            return response()->json(['message' => 'User money updated successfully']);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

}
