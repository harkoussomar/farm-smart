<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'farmer_id',
        'order_number',
        'status',
        'total_amount',
        'delivery_address',
        'delivery_notes',
        'payment_status',
    ];

    protected $casts = [
        'total_amount' => 'float',
    ];

    /**
     * The possible order statuses.
     */
    public const STATUSES = [
        'pending' => 'Pending',
        'processing' => 'Processing',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
    ];

    /**
     * The possible payment statuses.
     */
    public const PAYMENT_STATUSES = [
        'pending' => 'Pending',
        'paid' => 'Paid',
        'failed' => 'Failed',
        'refunded' => 'Refunded',
    ];

    /**
     * Get the farmer that owns the order.
     */
    public function farmer(): BelongsTo
    {
        return $this->belongsTo(Farmer::class);
    }

    /**
     * Get the items for the order.
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the status history for the order.
     */
    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }
}
