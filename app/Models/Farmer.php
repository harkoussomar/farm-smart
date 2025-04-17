<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Farmer extends User
{
    use HasFactory;

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'type',
    ];

    /**
     * Get the farm profile associated with the farmer.
     */
    public function farmProfile(): HasOne
    {
        return $this->hasOne(FarmProfile::class);
    }

    /**
     * Get the orders for the farmer.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
