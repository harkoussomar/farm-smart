<?php

namespace Database\Seeders;

use App\Models\FarmProfile;
use App\Models\FarmSection;
use App\Models\FarmSensorData;
use Illuminate\Database\Seeder;

class FarmVisualizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all farm profiles
        $farmProfiles = FarmProfile::all();

        if ($farmProfiles->isEmpty()) {
            $this->command->info('No farm profiles found. Please create farm profiles first.');
            return;
        }

        foreach ($farmProfiles as $farmProfile) {
            // Calculate the number of 100-hectare sections needed
            $totalSections = ceil($farmProfile->size / 100);

            // Delete existing sections for this farm
            FarmSection::where('farm_profile_id', $farmProfile->id)->delete();

            // Generate farm sections
            for ($i = 1; $i <= $totalSections; $i++) {
                $section = FarmSection::create([
                    'farm_profile_id' => $farmProfile->id,
                    'name' => "Section {$i}",
                    'size' => min(100, $farmProfile->size - (($i - 1) * 100)), // Last section might be smaller
                    'coordinates' => [
                        'lat' => $farmProfile->latitude + (rand(-100, 100) / 10000),
                        'lng' => $farmProfile->longitude + (rand(-100, 100) / 10000),
                    ],
                    'crops' => ['corn', 'wheat', 'soybeans'][rand(0, 2)],
                    'color' => ['#8BC34A', '#4CAF50', '#009688', '#00BCD4'][rand(0, 3)],
                    'section_number' => $i,
                    'growth_stage' => ['seedling', 'vegetative', 'flowering', 'mature'][rand(0, 3)],
                    'health_status' => ['excellent', 'good', 'fair', 'poor'][rand(0, 3)],
                    'soil_ph' => rand(60, 75) / 10, // 6.0 to 7.5
                    'ideal_ph_range' => [6.0, 7.0],
                    'soil_moisture' => rand(30, 60), // 30% to 60%
                    'ideal_moisture_range' => [40, 60],
                    'needs_water' => (bool) rand(0, 1),
                    'needs_fertilizer' => (bool) rand(0, 1),
                    'last_fertilized' => now()->subDays(rand(1, 30)),
                    'pest_detected' => (bool) rand(0, 1),
                    'notes' => 'Sample farm section for visualization testing',
                ]);

                // Generate sensor data for the last 7 days
                for ($day = 7; $day >= 0; $day--) {
                    for ($hour = 0; $hour < 24; $hour += 6) { // Every 6 hours
                        FarmSensorData::create([
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
                            'recorded_at' => now()->subDays($day)->subHours($hour),
                        ]);
                    }
                }
            }

            $this->command->info("Created {$totalSections} sections and sensor data for farm: {$farmProfile->farm_name}");
        }
    }
}