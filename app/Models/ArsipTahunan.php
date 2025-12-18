<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArsipTahunan extends Model
{
    use HasFactory;

    protected $table = 'arsip_tahunan';

    protected $fillable = [
        'user_id',
        'nama_ormawa',
        'tahun_arsip',
        'tanggal_reset',
        'reset_by',
        'data_program_kerja',
        'data_pengajuan_kegiatan',
        'data_laporan_kegiatan',
        'catatan',
    ];

    protected $casts = [
        'tanggal_reset' => 'datetime',
        'data_program_kerja' => 'array',
        'data_pengajuan_kegiatan' => 'array',
        'data_laporan_kegiatan' => 'array',
        'tahun_arsip' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
