<?php

namespace App\Http\Controllers;

use App\Models\FarmProfile;
use App\Models\FarmPhoto;
use App\Models\FarmSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use GuzzleHttp\Client;

class FarmProfileController extends Controller
{
    use AuthorizesRequests;

    /**
     * Show the form for editing the farm profile.
     */
    public function edit(Request $request): Response
    {
        $farmer = $request->user();
        $farmProfile = FarmProfile::where('farmer_id', $farmer->id)->first();
        $farmPhotos = [];
        $farmSections = [];

        if ($farmProfile) {
            $farmPhotos = FarmPhoto::where('farm_profile_id', $farmProfile->id)->get();
            $farmSections = FarmSection::where('farm_profile_id', $farmProfile->id)->get();
        }

        return Inertia::render('farmer/farm-profile', [
            'farmProfile' => $farmProfile ? [
                'id' => $farmProfile->id,
                'farm_name' => $farmProfile->farm_name,
                'address' => $farmProfile->address,
                'latitude' => $farmProfile->latitude,
                'longitude' => $farmProfile->longitude,
                'size' => $farmProfile->size,
                'size_unit' => $farmProfile->size_unit,
            ] : null,
            'farmPhotos' => $farmPhotos,
            'farmSections' => $farmSections,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Store a newly created farm profile.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'farm_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'size' => 'required|numeric|min:0',
            'size_unit' => 'required|in:hectares,acres',
        ]);

        try {
            $validated['farmer_id'] = $request->user()->id;
            $farmProfile = FarmProfile::create($validated);
            return redirect()->route('farmer.farm-profile.edit')->with('success', 'Farm profile created successfully');
        } catch (\Exception $e) {
            // Log error and return with error message
            \Log::error('Error creating farm profile: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to create farm profile. Please try again.'])->withInput();
        }
    }

    /**
     * Update the farm profile.
     */
    public function update(Request $request, FarmProfile $farmProfile)
    {
        $this->authorize('update', $farmProfile);

        $validated = $request->validate([
            'farm_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'size' => 'required|numeric|min:0',
            'size_unit' => 'required|in:hectares,acres',
        ]);

        // If location has changed and the address wasn't manually updated,
        // try to update address using reverse geocoding
        try {
            $farmProfile->update($validated);
            return redirect()->route('farmer.farm-profile.edit')->with('success', 'Farm profile updated successfully');
        } catch (\Exception $e) {
            // Log error and return with error message
            \Log::error('Error updating farm profile: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to update farm profile. Please try again.'])->withInput();
        }
    }
}
