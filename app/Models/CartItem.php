<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'product_id',
        'quantity',
        'unit_price',
        'discount_percentage',
        'total_price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'float',
        'discount_percentage' => 'float',
        'total_price' => 'float',
    ];

    /**
     * Get the farmer that owns the cart item.
     */
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    /**
     * Get the product for the cart item.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
