<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanKegiatan extends Model
{
    protected $fillable = [
        'user_id',
        'pengajuan_kegiatan_id',
        'anggaran_disetujui',
        'anggaran_realisasi',
        'ringkasan',
        'status',
        'lpj_file',
        'bukti_pengeluaran',
        'dokumentasi'
    ];

    protected $casts = [
        'bukti_pengeluaran' => 'array',
        'dokumentasi' => 'array',
        'anggaran_disetujui' => 'integer',
        'anggaran_realisasi' => 'integer'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pengajuanKegiatan(): BelongsTo
    {
        return $this->belongsTo(PengajuanKegiatan::class, 'pengajuan_kegiatan_id');
    }
}
