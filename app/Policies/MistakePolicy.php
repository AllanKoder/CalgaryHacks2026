<?php

namespace App\Policies;

use App\Models\Mistake;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MistakePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Mistake $mistake): bool
    {
        return $user->id === $mistake->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Mistake $mistake): bool
    {
        return $user->id === $mistake->user_id;
    }

    public function delete(User $user, Mistake $mistake): bool
    {
        return $user->id === $mistake->user_id;
    }

    public function restore(User $user, Mistake $mistake): bool
    {
        return $user->id === $mistake->user_id;
    }

    public function forceDelete(User $user, Mistake $mistake): bool
    {
        return $user->id === $mistake->user_id;
    }
}
