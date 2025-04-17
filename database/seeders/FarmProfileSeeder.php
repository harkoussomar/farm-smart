<?php

namespace Database\Seeders;

use App\Models\FarmProfile;
use App\Models\Farmer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FarmProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find the first farmer user
        $farmer = Farmer::first();

        if (!$farmer) {
            $this->command->info('No farmer found. Please create a farmer user first.');
            return;
        }

        // Check if the farmer already has a farm profile
        $existingProfile = FarmProfile::where('farmer_id', $farmer->id)->first();

        if ($existingProfile) {
            // Update the existing profile with valid coordinates
            $existingProfile->update([
                'latitude' => '33.8869',  // Example coordinates - Beirut, Lebanon
                'longitude' => '35.5131', // Example coordinates - Beirut, Lebanon
            ]);

            $this->command->info('Updated existing farm profile with valid coordinates.');
        } else {
            // Create a new farm profile with valid coordinates
            FarmProfile::create([
                'farmer_id' => $farmer->id,
                'farm_name' => 'Test Farm',
                'address' => 'Test Address, Beirut, Lebanon',
                'latitude' => '33.8869',  // Example coordinates - Beirut, Lebanon
                'longitude' => '35.5131', // Example coordinates - Beirut, Lebanon
                'size' => '5.5',
                'size_unit' => 'hectares',
            ]);

            $this->command->info('Created new farm profile with valid coordinates.');
        }
    }
}
