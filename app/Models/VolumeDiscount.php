<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VolumeDiscount extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'minimum_quantity',
        'discount_percentage',
        'is_active',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the product that owns the volume discount.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
