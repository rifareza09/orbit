<?php

namespace App\Policies;

use App\Models\User;
use App\Models\PengajuanKegiatan;
use Illuminate\Auth\Access\HandlesAuthorization;

class PengajuanKegiatanPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, PengajuanKegiatan $pengajuan): bool
    {
        return $user->role === 'puskaka' || $pengajuan->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->role !== 'puskaka';
    }

    public function update(User $user, PengajuanKegiatan $pengajuan): bool
    {
        return $pengajuan->user_id === $user->id
            && !in_array($pengajuan->status, ['Disetujui', 'Selesai']);
    }

    public function delete(User $user, PengajuanKegiatan $pengajuan): bool
    {
        return $pengajuan->user_id === $user->id;
    }

    public function submit(User $user, PengajuanKegiatan $pengajuan): bool
    {
        return $pengajuan->user_id === $user->id
            && in_array($pengajuan->status, ['Belum Diajukan', 'Ditolak'])
            || ($pengajuan->status_review === 'Ditolak');
    }

    public function review(User $user, PengajuanKegiatan $pengajuan): bool
    {
        return $user->role === 'puskaka';
    }
}
