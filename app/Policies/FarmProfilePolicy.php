<?php

namespace App\Policies;

use App\Models\FarmProfile;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FarmProfilePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->type === 'farmer';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, FarmProfile $farmProfile): bool
    {
        return $user->type === 'farmer' && $user->id === $farmProfile->farmer_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->type === 'farmer';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, FarmProfile $farmProfile): bool
    {
        return $user->type === 'farmer' && $user->id === $farmProfile->farmer_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, FarmProfile $farmProfile): bool
    {
        return $user->type === 'farmer' && $user->id === $farmProfile->farmer_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, FarmProfile $farmProfile): bool
    {
        return $user->type === 'farmer' && $user->id === $farmProfile->farmer_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, FarmProfile $farmProfile): bool
    {
        return $user->type === 'farmer' && $user->id === $farmProfile->farmer_id;
    }
}
