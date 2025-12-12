<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramKerja extends Model
{
    protected $fillable = [
        'user_id',
        'program_kerja',
        'kegiatan',
        'deskripsi_kegiatan',
        'jenis_kegiatan',
        'estimasi_anggaran',
        'status',
        'catatan_puskaka',
        'reviewed_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
