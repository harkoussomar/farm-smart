<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FarmPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_profile_id',
        'file_path',
        'file_name',
        'file_size',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Get the farm profile that owns the photo.
     */
    public function farmProfile(): BelongsTo
    {
        return $this->belongsTo(FarmProfile::class);
    }
}
