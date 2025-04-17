<?php

namespace App\Http\Controllers;

use App\Models\Crop;
use App\Models\FarmProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CropController extends Controller
{
    /**
     * Display a listing of crops.
     */
    public function index(Request $request): Response
    {
        // Get the current user's location or default to center of the region
        $farmProfile = FarmProfile::where('farmer_id', $request->user()->id)->first();

        $latitude = $farmProfile?->latitude ?? 28.6139;  // Default latitude
        $longitude = $farmProfile?->longitude ?? 77.2090; // Default longitude

        // Get crops filtered by status if provided
        $query = Crop::query();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Get user's own crops
        $myCrops = $query->where('farmer_id', $request->user()->id)
            ->with('farmer')
            ->orderBy('created_at', 'desc')
            ->get();

        // Get nearby crops from other farmers - only available crops for marketplace
        $nearbyCropsQuery = Crop::nearby($latitude, $longitude, 100)
            ->where('farmer_id', '!=', $request->user()->id)
            ->where('status', 'available')  // Only available crops from other farmers
            ->with('farmer');

        $nearbyCrops = $nearbyCropsQuery->limit(20)->get();

        // Get all crops for the map - only available crops
        $allCrops = Crop::where('status', 'available')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->select('id', 'name', 'farmer_id', 'price', 'quantity', 'unit', 'latitude', 'longitude')
            ->with('farmer:id,name')
            ->get();

        return Inertia::render('farmer/crops/index', [
            'myCrops' => $myCrops,
            'nearbyCrops' => $nearbyCrops,
            'mapData' => $allCrops,
            'userLocation' => [
                'latitude' => $latitude,
                'longitude' => $longitude
            ],
            'filters' => $request->only(['status'])
        ]);
    }

    /**
     * Show the form for creating a new crop.
     */
    public function create(): Response
    {
        return Inertia::render('farmer/crops/create');
    }

    /**
     * Store a newly created crop in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0.01',
            'harvest_date' => 'required|date',
            'status' => 'required|string|in:available,reserved,sold',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'address' => 'nullable|string|max:255',
        ]);

        // If location is not provided, get it from the farm profile
        if (!isset($validated['latitude']) || !isset($validated['longitude'])) {
            $farmProfile = FarmProfile::where('farmer_id', $request->user()->id)->first();
            if ($farmProfile) {
                $validated['latitude'] = $farmProfile->latitude;
                $validated['longitude'] = $farmProfile->longitude;
                $validated['address'] = $farmProfile->address;
            }
        }

        // Create the crop
        $crop = new Crop($validated);
        $crop->farmer_id = $request->user()->id;
        $crop->save();

        return redirect()->route('farmer.crops.index')
            ->with('success', 'Crop listed successfully!');
    }

    /**
     * Display the specified crop.
     */
    public function show(Crop $crop): Response
    {
        $crop->load('farmer');

        // Get more crops from the same farmer
        $moreCrops = Crop::where('farmer_id', $crop->farmer_id)
            ->where('id', '!=', $crop->id)
            ->where('status', 'available')
            ->limit(4)
            ->get();

        return Inertia::render('farmer/crops/show', [
            'crop' => $crop,
            'moreCrops' => $moreCrops
        ]);
    }

    /**
     * Show the form for editing the specified crop.
     */
    public function edit(Crop $crop): Response
    {
        // Check if the authenticated user is the owner of the crop
        if (auth()->user()->id !== $crop->farmer_id) {
            abort(403, 'Unauthorized action.');
        }

        return Inertia::render('farmer/crops/edit', [
            'crop' => $crop
        ]);
    }

    /**
     * Update the specified crop in storage.
     */
    public function update(Request $request, Crop $crop)
    {
        // Check if the authenticated user is the owner of the crop
        if ($request->user()->id !== $crop->farmer_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|numeric|min:0.01',
            'unit' => 'required|string|max:50',
            'price' => 'required|numeric|min:0.01',
            'harvest_date' => 'required|date',
            'status' => 'required|in:available,sold,reserved',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'address' => 'nullable|string|max:255',
        ]);

        $crop->update($validated);

        return redirect()->route('farmer.crops.index')
            ->with('success', 'Crop updated successfully!');
    }

    /**
     * Remove the specified crop from storage.
     */
    public function destroy(Request $request, Crop $crop)
    {
        // Check if the authenticated user is the owner of the crop
        if ($request->user()->id !== $crop->farmer_id) {
            abort(403, 'Unauthorized action.');
        }

        $crop->delete();

        return redirect()->route('farmer.crops.index')
            ->with('success', 'Crop removed successfully!');
    }

    /**
     * Mark a crop as sold.
     */
    public function markAsSold(Request $request, Crop $crop)
    {
        // Check if the authenticated user is the owner of the crop
        if ($request->user()->id !== $crop->farmer_id) {
            abort(403, 'Unauthorized action.');
        }

        $crop->status = 'sold';
        $crop->save();

        return redirect()->route('farmer.crops.index')
            ->with('success', 'Crop marked as sold!');
    }
}