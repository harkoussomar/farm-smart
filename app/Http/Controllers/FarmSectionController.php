<?php

namespace App\Http\Controllers;

use App\Models\FarmProfile;
use App\Models\FarmSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FarmSectionController extends Controller
{
    /**
     * Store a newly created farm section.
     */
    public function store(Request $request, FarmProfile $farmProfile)
    {
        // Ensure the user owns this farm profile
        if ($request->user()->id !== $farmProfile->farmer_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'size' => 'required|numeric|min:0',
            'coordinates' => 'nullable|array',
            'crops' => 'nullable|array',
            'color' => 'nullable|string',
            'section_number' => 'required|integer',
            'growth_stage' => 'nullable|string',
            'health_status' => 'nullable|string',
            'soil_ph' => 'nullable|numeric|between:0,14',
            'ideal_ph_range' => 'nullable|array',
            'soil_moisture' => 'nullable|numeric|between:0,100',
            'ideal_moisture_range' => 'nullable|array',
            'needs_water' => 'nullable|boolean',
            'needs_fertilizer' => 'nullable|boolean',
            'last_fertilized' => 'nullable|date',
            'pest_detected' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $farmSection = $farmProfile->sections()->create($validated);

        return response()->json($farmSection);
    }

    /**
     * Update an existing farm section.
     */
    public function update(Request $request, FarmProfile $farmProfile, FarmSection $section)
    {
        // Ensure the user owns this farm profile
        if ($request->user()->id !== $farmProfile->farmer_id) {
            abort(403);
        }

        // Ensure the section belongs to this farm profile
        if ($section->farm_profile_id !== $farmProfile->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'size' => 'required|numeric|min:0',
            'coordinates' => 'nullable|array',
            'crops' => 'nullable|array',
            'color' => 'nullable|string',
            'section_number' => 'required|integer',
            'growth_stage' => 'nullable|string',
            'health_status' => 'nullable|string',
            'soil_ph' => 'nullable|numeric|between:0,14',
            'ideal_ph_range' => 'nullable|array',
            'soil_moisture' => 'nullable|numeric|between:0,100',
            'ideal_moisture_range' => 'nullable|array',
            'needs_water' => 'nullable|boolean',
            'needs_fertilizer' => 'nullable|boolean',
            'last_fertilized' => 'nullable|date',
            'pest_detected' => 'nullable|boolean',
            'notes' => 'nullable|string',
        ]);

        $section->update($validated);

        return response()->json($section);
    }

    /**
     * Delete a farm section.
     */
    public function destroy(Request $request, FarmProfile $farmProfile, FarmSection $section)
    {
        // Ensure the user owns this farm profile
        if ($request->user()->id !== $farmProfile->farmer_id) {
            abort(403);
        }

        // Ensure the section belongs to this farm profile
        if ($section->farm_profile_id !== $farmProfile->id) {
            abort(403);
        }

        $section->delete();

        return response()->json(['message' => 'Farm section deleted successfully']);
    }
}
