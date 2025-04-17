<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Crop extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'name',
        'description',
        'quantity',
        'unit',
        'price',
        'harvest_date',
        'image_path',
        'status', // 'available', 'sold', 'expired'
        'latitude',
        'longitude',
        'address',
    ];

    protected $casts = [
        'price' => 'float',
        'quantity' => 'float',
        'harvest_date' => 'date',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Get the farmer that owns the crop.
     */
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'farmer_id');
    }

    /**
     * Get the formatted price.
     */
    public function getFormattedPriceAttribute(): string
    {
        return '$' . number_format($this->price, 2);
    }

    /**
     * Get nearby crops.
     */
    public static function nearby($latitude, $longitude, $distance = 50)
    {
        // Check if we're using SQLite
        $connection = config('database.default');
        $driver = config("database.connections.{$connection}.driver");

        if ($driver === 'sqlite') {
            // For SQLite, use a simple bounding box approach instead of Haversine
            // Convert distance to degrees (roughly)
            $lat_distance = $distance / 111.0; // 1 degree latitude is approximately 111 km
            $lng_distance = $distance / (111.0 * cos(deg2rad($latitude)));

            return self::select('*')
                ->whereBetween('latitude', [$latitude - $lat_distance, $latitude + $lat_distance])
                ->whereBetween('longitude', [$longitude - $lng_distance, $longitude + $lng_distance])
                ->where('status', 'available')
                ->orderByRaw("((latitude - $latitude) * (latitude - $latitude) + (longitude - $longitude) * (longitude - $longitude))");
        } else {
            // Using the Haversine formula to calculate distance for other database systems
            $haversine = "(
                6371 * acos(
                    cos(radians($latitude))
                    * cos(radians(latitude))
                    * cos(radians(longitude) - radians($longitude))
                    + sin(radians($latitude))
                    * sin(radians(latitude))
                )
            )";

            return self::selectRaw("*, $haversine AS distance")
                ->whereRaw("$haversine < ?", [$distance])
                ->where('status', 'available')
                ->orderBy('distance');
        }
    }
}