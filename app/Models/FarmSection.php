<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_profile_id',
        'name',
        'size',
        'coordinates',
        'crops',
        'color',
        'section_number',
        'growth_stage',
        'health_status',
        'soil_ph',
        'ideal_ph_range',
        'soil_moisture',
        'ideal_moisture_range',
        'needs_water',
        'needs_fertilizer',
        'last_fertilized',
        'pest_detected',
        'notes'
    ];

    protected $casts = [
        'coordinates' => 'array',
        'crops' => 'array',
        'size' => 'decimal:2',
        'soil_ph' => 'decimal:1',
        'ideal_ph_range' => 'array',
        'soil_moisture' => 'decimal:1',
        'ideal_moisture_range' => 'array',
        'needs_water' => 'boolean',
        'needs_fertilizer' => 'boolean',
        'pest_detected' => 'boolean',
        'last_fertilized' => 'date',
    ];

    /**
     * Get the farm profile that this section belongs to.
     */
    public function farmProfile(): BelongsTo
    {
        return $this->belongsTo(FarmProfile::class);
    }

    /**
     * Get the sensor data for the farm section.
     */
    public function sensorData()
    {
        return $this->hasMany(FarmSensorData::class);
    }
}
