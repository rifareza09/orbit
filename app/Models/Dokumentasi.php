<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dokumentasi extends Model
{
    protected $fillable = [
        'user_id',
        'nama_kegiatan',
        'tanggal_kegiatan',
        'foto_path'
    ];

    protected $casts = [
        'tanggal_kegiatan' => 'date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
