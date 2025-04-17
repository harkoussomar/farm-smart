<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('farm_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_profile_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('size', 10, 2); // Size in hectares
            $table->json('coordinates')->nullable(); // GeoJSON coordinates for rendering on map
            $table->json('crops')->nullable(); // Crops planted in this section
            $table->string('color')->nullable(); // Color for map visualization
            $table->integer('section_number'); // Numbering for sections (1, 2, 3...)

            // Farm condition fields
            $table->string('growth_stage')->nullable(); // e.g., "seedling", "vegetative", "flowering", "mature"
            $table->string('health_status')->nullable(); // e.g., "excellent", "good", "fair", "poor", "critical"
            $table->decimal('soil_ph', 3, 1)->nullable(); // Soil pH value
            $table->json('ideal_ph_range')->nullable(); // [min, max] ideal pH
            $table->decimal('soil_moisture', 4, 1)->nullable(); // Current soil moisture percentage
            $table->json('ideal_moisture_range')->nullable(); // [min, max] ideal moisture percentage
            $table->boolean('needs_water')->default(false); // Flag for water requirement
            $table->boolean('needs_fertilizer')->default(false); // Flag for fertilizer requirement
            $table->date('last_fertilized')->nullable(); // Date of last fertilization
            $table->boolean('pest_detected')->default(false); // Flag for pest detection
            $table->text('notes')->nullable(); // Additional notes about this section

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farm_sections');
    }
};
