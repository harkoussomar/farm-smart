<?php

namespace App\Http\Controllers;

use App\Models\FarmProfile;
use App\Models\FarmSection;
use App\Models\FarmSensorData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class FarmVisualizationController extends Controller
{
    /**
     * Display the farm visualization dashboard.
     */
    public function index(Request $request): Response
    {
        $farmer = $request->user();
        $farmProfile = FarmProfile::where('farmer_id', $farmer->id)->first();

        if (!$farmProfile) {
            return Inertia::render('farmer/farm-visualization', [
                'error' => 'No farm profile found. Please create a farm profile first.',
            ]);
        }

        // Get all farm sections
        $sections = FarmSection::where('farm_profile_id', $farmProfile->id)
            ->get();

        // For each section, get the latest sensor data
        foreach ($sections as $section) {
            $section->sensorData = FarmSensorData::where('farm_section_id', $section->id)
                ->latest('recorded_at')
                ->first();
        }

        // Calculate the number of 100-hectare sections needed
        $totalSections = ceil($farmProfile->size / 100);
        $sectionsPerRow = ceil(sqrt($totalSections));

        return Inertia::render('farmer/farm-visualization', [
            'farmProfile' => $farmProfile,
            'sections' => $sections,
            'totalSections' => $totalSections,
            'sectionsPerRow' => $sectionsPerRow,
        ]);
    }

    /**
     * Get real-time sensor data for a specific section.
     */
    public function getSectionData(Request $request, FarmSection $section)
    {
        // Ensure the section belongs to the user's farm
        if ($request->user()->id !== $section->farmProfile->farmer_id) {
            abort(403);
        }

        $sensorData = FarmSensorData::where('farm_section_id', $section->id)
            ->latest('recorded_at')
            ->first();

        return response()->json([
            'section' => $section,
            'sensorData' => $sensorData,
        ]);
    }

    /**
     * Get historical sensor data for a specific section.
     */
    public function getHistoricalData(Request $request, FarmSection $section)
    {
        // Ensure the section belongs to the user's farm
        if ($request->user()->id !== $section->farmProfile->farmer_id) {
            abort(403);
        }

        $timeRange = $request->input('time_range', '24h'); // Default to last 24 hours
        $now = now();

        switch ($timeRange) {
            case '24h':
                $startTime = $now->subHours(24);
                break;
            case '7d':
                $startTime = $now->subDays(7);
                break;
            case '30d':
                $startTime = $now->subDays(30);
                break;
            default:
                $startTime = $now->subHours(24);
        }

        $historicalData = FarmSensorData::where('farm_section_id', $section->id)
            ->where('recorded_at', '>=', $startTime)
            ->orderBy('recorded_at')
            ->get();

        return response()->json([
            'historicalData' => $historicalData,
        ]);
    }

    /**
     * Generate sample sensor data for testing.
     */
    public function generateSampleData(Request $request, FarmSection $section)
    {
        // Ensure the section belongs to the user's farm
        if ($request->user()->id !== $section->farmProfile->farmer_id) {
            abort(403);
        }

        $sensorData = new FarmSensorData([
            'farm_section_id' => $section->id,
            'temperature_air' => rand(15, 35) + (rand(0, 99) / 100),
            'temperature_soil' => rand(10, 30) + (rand(0, 99) / 100),
            'humidity_air' => rand(30, 90) + (rand(0, 99) / 100),
            'soil_moisture' => rand(20, 80) + (rand(0, 99) / 100),
            'rainfall' => rand(0, 50) + (rand(0, 99) / 100),
            'light_intensity' => rand(1000, 100000) + (rand(0, 99) / 100),
            'light_duration' => rand(0, 1440), // 0 to 24 hours in minutes
            'wind_speed' => rand(0, 50) + (rand(0, 99) / 100),
            'wind_direction' => rand(0, 360) + (rand(0, 99) / 100),
            'co2_level' => rand(300, 2000) + (rand(0, 99) / 100),
            'soil_ph' => rand(50, 80) / 10, // 5.0 to 8.0
            'water_ph' => rand(60, 80) / 10, // 6.0 to 8.0
            'recorded_at' => now(),
        ]);

        $sensorData->save();

        return response()->json([
            'message' => 'Sample data generated successfully',
            'sensorData' => $sensorData,
        ]);
    }
}