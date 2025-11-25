<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemPengajuanDana extends Model
{
    protected $fillable = [
        'pengajuan_kegiatan_id',
        'nama_item',
        'deskripsi_item',
        'quantity',
        'harga_satuan',
        'total_harga'
    ];

    protected $casts = [
        'harga_satuan' => 'decimal:2',
        'total_harga' => 'decimal:2'
    ];

    public function pengajuanKegiatan(): BelongsTo
    {
        return $this->belongsTo(PengajuanKegiatan::class);
    }

    protected static function booted()
    {
        static::saving(function ($item) {
            $item->total_harga = $item->quantity * $item->harga_satuan;
        });

        static::saved(function ($item) {
            $item->pengajuanKegiatan->calculateTotalAnggaran();
        });

        static::deleted(function ($item) {
            $item->pengajuanKegiatan->calculateTotalAnggaran();
        });
    }
}
