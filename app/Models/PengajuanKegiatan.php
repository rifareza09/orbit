<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PengajuanKegiatan extends Model
{
    protected $fillable = [
        'user_id',
        'program_kerja_id',
        'nama_kegiatan',
        'ketua_pelaksana',
        'tempat_pelaksanaan',
        'tanggal_pelaksanaan',
        'total_anggaran',
        'status',
        'deskripsi',
        'proposal_path'
    ];

    protected $casts = [
        'tanggal_pelaksanaan' => 'date',
        'total_anggaran' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function itemPengajuanDana(): HasMany
    {
        return $this->hasMany(ItemPengajuanDana::class);
    }

    public function programKerja(): BelongsTo
    {
        return $this->belongsTo(ProgramKerja::class);
    }

    public function calculateTotalAnggaran()
    {
        $this->total_anggaran = $this->itemPengajuanDana()->sum('total_harga');
        $this->save();
    }
}
