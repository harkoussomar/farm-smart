<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FarmProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'farm_name',
        'address',
        'latitude',
        'longitude',
        'size',
        'size_unit',
    ];

    protected $casts = [
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'size' => 'decimal:2',
    ];

    protected $attributes = [
    ];

    /**
     * Get the farmer that owns the farm profile.
     */
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    /**
     * Get the farm photos.
     */
    public function photos(): HasMany
    {
        return $this->hasMany(FarmPhoto::class);
    }

    /**
     * Get the farm sections.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(FarmSection::class);
    }
}
