<?php

use App\Http\Controllers\Auth\FarmerAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CropController;
use App\Http\Controllers\CropOrderController;
use App\Http\Controllers\FarmProfileController;
use App\Http\Controllers\FarmerDashboardController;
use App\Http\Controllers\FarmerProfileController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\FarmSectionController;
use App\Http\Controllers\FarmVisualizationController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Redirect root to farmer login
Route::get('/', function () {
    return redirect()->route('farmer.login');
});

// Client routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Profile routes now handled by routes/settings.php
    // Route::redirect('/profile', '/settings/profile');
});

// Farmer authentication routes
Route::get('/farmer/login', [FarmerAuthController::class, 'showLoginForm'])
    ->name('farmer.login');
Route::post('/farmer/login', [FarmerAuthController::class, 'login']);
Route::get('/farmer/register', [FarmerAuthController::class, 'showRegistrationForm'])
    ->name('farmer.register');
Route::post('/farmer/register', [FarmerAuthController::class, 'register']);
Route::post('/farmer/logout', [FarmerAuthController::class, 'logout'])
    ->name('farmer.logout');

// Farmer protected routes
Route::middleware(['auth', \App\Http\Middleware\EnsureFarmer::class])->prefix('farmer')->group(function () {
    // Dashboard
    Route::get('/dashboard', [FarmerDashboardController::class, 'index'])
        ->name('farmer.dashboard');

    // Farmer Profile
    Route::get('/profile', [FarmerProfileController::class, 'edit'])
        ->name('farmer.profile.edit');
    Route::patch('/profile', [FarmerProfileController::class, 'update'])
        ->name('farmer.profile.update');
    Route::delete('/profile', [FarmerProfileController::class, 'destroy'])
        ->name('farmer.profile.destroy');

    // Farm Profile
    Route::get('/farm-profile', [FarmProfileController::class, 'edit'])
        ->name('farmer.farm-profile.edit');
    Route::post('/farm-profile', [FarmProfileController::class, 'store'])
        ->name('farmer.farm-profile.store');
    Route::put('/farm-profile/{farmProfile}', [FarmProfileController::class, 'update'])
        ->name('farmer.farm-profile.update');

    // Farm Sections
    Route::post('/farm-profile/{farmProfile}/sections', [FarmSectionController::class, 'store'])
        ->name('farmer.farm-sections.store');
    Route::put('/farm-profile/{farmProfile}/sections/{section}', [FarmSectionController::class, 'update'])
        ->name('farmer.farm-sections.update');
    Route::delete('/farm-profile/{farmProfile}/sections/{section}', [FarmSectionController::class, 'destroy'])
        ->name('farmer.farm-sections.destroy');

    // Products catalog
    Route::get('/products', [ProductController::class, 'index'])
        ->name('farmer.products.index');
    Route::get('/products/{product}', [ProductController::class, 'show'])
        ->name('farmer.products.show');

    // Shopping Cart
    Route::get('/cart', [CartController::class, 'index'])
        ->name('farmer.cart.index');
    Route::post('/cart/add/{product}', [CartController::class, 'add'])
        ->name('farmer.cart.add');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])
        ->name('farmer.cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'remove'])
        ->name('farmer.cart.remove');

    // Checkout
    Route::get('/checkout', [OrderController::class, 'create'])
        ->name('farmer.checkout');

    // Orders
    Route::post('/orders', [OrderController::class, 'store'])
        ->name('farmer.orders.store');
    Route::get('/orders', function() {
        return redirect()->route('farmer.products.index', ['tab' => 'orders']);
    })
        ->name('farmer.orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])
        ->name('farmer.orders.show');
    Route::post('/orders/{order}/reorder', [OrderController::class, 'reorder'])
        ->name('farmer.orders.reorder');

    // Crops Marketplace
    Route::get('/crops', [CropController::class, 'index'])
        ->name('farmer.crops.index');

    // Crops with parameters
    Route::get('/crops/create', [CropController::class, 'create'])
        ->name('farmer.crops.create');
    Route::post('/crops', [CropController::class, 'store'])
        ->name('farmer.crops.store');
    Route::get('/crops/{crop}', [CropController::class, 'show'])
        ->name('farmer.crops.show');
    Route::get('/crops/{crop}/edit', [CropController::class, 'edit'])
        ->name('farmer.crops.edit');
    Route::patch('/crops/{crop}', [CropController::class, 'update'])
        ->name('farmer.crops.update');
    Route::delete('/crops/{crop}', [CropController::class, 'destroy'])
        ->name('farmer.crops.destroy');
    Route::patch('/crops/{crop}/mark-as-sold', [CropController::class, 'markAsSold'])
        ->name('farmer.crops.mark-as-sold');

    // Sample data testing route
    Route::get('/farmer/samples', function() {
        return Inertia::render('farmer/samples');
    })->name('farmer.samples');
});

// Farm Visualization Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureFarmer::class])->prefix('farmer')->group(function () {
    Route::get('/farm-visualization', [FarmVisualizationController::class, 'index'])->name('farmer.farm-visualization');
});

// Farm Visualization API Routes
Route::middleware(['auth', \App\Http\Middleware\EnsureFarmer::class])->group(function () {
    Route::get('/api/farm-sections/{section}/data', [FarmVisualizationController::class, 'getSectionData'])->name('api.farm-sections.data');
    Route::get('/api/farm-sections/{section}/historical-data', [FarmVisualizationController::class, 'getHistoricalData'])->name('api.farm-sections.historical-data');
    Route::post('/api/farm-sections/{section}/generate-sample-data', [FarmVisualizationController::class, 'generateSampleData'])->name('api.farm-sections.generate-sample-data');

    // Farm profile data for weather widget
    Route::get('/farmer/get-farm-location', function (Request $request) {
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
    })->name('farmer.get-farm-location');
});
