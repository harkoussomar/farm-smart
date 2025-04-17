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
        Schema::create('farm_sensor_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_section_id')->constrained()->onDelete('cascade');
            $table->decimal('temperature_air', 5, 2)->nullable(); // in Celsius
            $table->decimal('temperature_soil', 5, 2)->nullable(); // in Celsius
            $table->decimal('humidity_air', 5, 2)->nullable(); // percentage
            $table->decimal('soil_moisture', 5, 2)->nullable(); // percentage
            $table->decimal('rainfall', 5, 2)->nullable(); // in mm
            $table->decimal('light_intensity', 8, 2)->nullable(); // in lux
            $table->integer('light_duration')->nullable(); // in minutes
            $table->decimal('wind_speed', 5, 2)->nullable(); // in km/h
            $table->decimal('wind_direction', 5, 2)->nullable(); // in degrees
            $table->decimal('co2_level', 5, 2)->nullable(); // in ppm
            $table->decimal('soil_ph', 3, 2)->nullable(); // pH value
            $table->decimal('water_ph', 3, 2)->nullable(); // pH value
            $table->timestamp('recorded_at');
            $table->timestamps();

            // Index for efficient querying
            $table->index(['farm_section_id', 'recorded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farm_sensor_data');
    }
};