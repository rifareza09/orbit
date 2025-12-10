<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JadwalLatihan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'divisi',
        'hari',
        'pukul',
        'tempat',
    ];

    /**
     * Get the user that owns the jadwal latihan.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
