<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmSensorData extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_section_id',
        'temperature_air',
        'temperature_soil',
        'humidity_air',
        'soil_moisture',
        'rainfall',
        'light_intensity',
        'light_duration',
        'wind_speed',
        'wind_direction',
        'co2_level',
        'soil_ph',
        'water_ph',
        'recorded_at',
    ];

    protected $casts = [
        'temperature_air' => 'decimal:2',
        'temperature_soil' => 'decimal:2',
        'humidity_air' => 'decimal:2',
        'soil_moisture' => 'decimal:2',
        'rainfall' => 'decimal:2',
        'light_intensity' => 'decimal:2',
        'light_duration' => 'integer',
        'wind_speed' => 'decimal:2',
        'wind_direction' => 'decimal:2',
        'co2_level' => 'decimal:2',
        'soil_ph' => 'decimal:2',
        'water_ph' => 'decimal:2',
        'recorded_at' => 'datetime',
    ];

    /**
     * Get the farm section that owns the sensor data.
     */
    public function farmSection(): BelongsTo
    {
        return $this->belongsTo(FarmSection::class);
    }
}