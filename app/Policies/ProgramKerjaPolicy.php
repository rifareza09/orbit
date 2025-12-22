<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ProgramKerja;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProgramKerjaPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; // All authenticated users can view list
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ProgramKerja $programKerja): bool
    {
        // Puskaka can view all, ormawa can only view their own
        return $user->role === 'puskaka' || $programKerja->user_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role !== 'puskaka'; // Only ormawa can create
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProgramKerja $programKerja): bool
    {
        // Only owner can update, and not if already approved
        return $programKerja->user_id === $user->id
            && !in_array($programKerja->status, ['Disetujui', 'Selesai']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProgramKerja $programKerja): bool
    {
        // Only owner can delete their own program kerja
        return $programKerja->user_id === $user->id;
    }

    /**
     * Determine whether the user can submit the model.
     */
    public function submit(User $user, ProgramKerja $programKerja): bool
    {
        // Only owner can submit
        return $programKerja->user_id === $user->id
            && in_array($programKerja->status, ['Belum Diajukan', 'Ditolak', 'Direvisi']);
    }

    /**
     * Determine whether the user can review the model.
     */
    public function review(User $user, ProgramKerja $programKerja): bool
    {
        // Only puskaka can review
        return $user->role === 'puskaka';
    }
}
