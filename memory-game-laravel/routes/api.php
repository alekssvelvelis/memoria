<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use Laravel\Sanctum\Http\Controllers\SanctumController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLevelsController;
use App\Http\Controllers\PlayedGamesController;
use App\Http\Controllers\AchievementsController;
use App\Http\Controllers\AnimatedBackgroundsController;
use App\Http\Controllers\UserBackgroundsController;

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    // Your authenticated routes here
    Route::post('/logout', [UserController::class, 'logout']);
    Route::post('/updatePassword', [UserController::class, 'updatePassword']);
    Route::get('/getUserData', [UserController::class, 'getUserData']);
    Route::put('/updateUserData', [UserController::class, 'updateUser']);
    Route::post('/updateUserImage', [UserController::class, 'updateUserImage']);
    Route::post('/save-played-game', [PlayedGamesController::class, 'savePlayedGame']);
    Route::get('/getUserGames', [PlayedGamesController::class, 'getUserGames']);
    Route::get('/getAchievements', [AchievementsController::class, 'getAchievements']);
    Route::post('/checkAndAwardAchievement', [AchievementsController::class, 'checkAndAwardAchievement']);
    Route::get('/getUserAchievements', [AchievementsController::class, 'getUserAchievements']);
    Route::post('/updateUserMoney', [UserController::class, 'updateMoneyEarned']);
    Route::get('/getUserMoney', [UserController::class, 'getUserMoney']);
    Route::post('/saveClearedLevel', [UserLevelsController::class, 'saveClearedLevel']);
    Route::get('/getClearedLevels', [UserLevelsController::class, 'getClearedLevels']);
    Route::get('/getAnimatedBackgrounds', [AnimatedBackgroundsController::class, 'getAnimatedBackgrounds']);
    Route::post('/purchaseBackground', [UserBackgroundsController::class, 'purchaseBackground']);
    Route::get('/getUserBackgrounds', [UserBackgroundsController::class, 'getUserBackgrounds']);
    Route::post('/updateUserBackground', [UserBackgroundsController::class, 'updateBackground']);
    Route::get('/getUserCurrentBackground', [UserController::class, 'getUserBackground']);
});

Route::get('/getAllGames', [PlayedGamesController::class, 'getAllGames']);

use App\Http\Controllers\GameThemeController;
Route::get('/getGameThemes', [GameThemeController::class, 'getGameThemes']);

use App\Http\Controllers\GoogleLoginController;
Route::post('/google-login', [GoogleLoginController::class, 'googleLogin']);