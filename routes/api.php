<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Farmer API routes only
Route::middleware('auth:web')->get('/farmer/farm-profile', function (Request $request) {
    $farmProfile = \App\Models\FarmProfile::where('farmer_id', $request->user()->id)->first();

    if (!$farmProfile) {
        return response()->json(null, 404);
    }

    return response()->json([
        'id' => $farmProfile->id,
        'farm_name' => $farmProfile->farm_name,
        'address' => $farmProfile->address,
        'latitude' => $farmProfile->latitude,
        'longitude' => $farmProfile->longitude,
        'size' => $farmProfile->size,
        'size_unit' => $farmProfile->size_unit,
    ]);
});