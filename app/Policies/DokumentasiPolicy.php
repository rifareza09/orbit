<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Dokumentasi;
use Illuminate\Auth\Access\HandlesAuthorization;

class DokumentasiPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Dokumentasi $dokumentasi): bool
    {
        // Public can view via landing page, authenticated users can view their own
        return $dokumentasi->user_id === $user->id || $user->role === 'puskaka';
    }

    public function create(User $user): bool
    {
        return $user->role !== 'puskaka';
    }

    public function update(User $user, Dokumentasi $dokumentasi): bool
    {
        return $dokumentasi->user_id === $user->id;
    }

    public function delete(User $user, Dokumentasi $dokumentasi): bool
    {
        return $dokumentasi->user_id === $user->id;
    }
}
