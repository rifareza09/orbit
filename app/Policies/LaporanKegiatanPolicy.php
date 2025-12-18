<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LaporanKegiatan;
use Illuminate\Auth\Access\HandlesAuthorization;

class LaporanKegiatanPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, LaporanKegiatan $laporan): bool
    {
        return $user->role === 'puskaka' || $laporan->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role !== 'puskaka';
    }

    public function update(User $user, LaporanKegiatan $laporan): bool
    {
        return $laporan->user_id === $user->id 
            && !in_array($laporan->status, ['Disetujui', 'Selesai']);
    }

    public function delete(User $user, LaporanKegiatan $laporan): bool
    {
        return $laporan->user_id === $user->id;
    }

    public function submit(User $user, LaporanKegiatan $laporan): bool
    {
        return $laporan->user_id === $user->id 
            && in_array($laporan->status, ['Belum Diajukan', 'Ditolak', 'Direvisi']);
    }

    public function review(User $user, LaporanKegiatan $laporan): bool
    {
        return $user->role === 'puskaka';
    }
}
