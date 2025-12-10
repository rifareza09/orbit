<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kepengurusan extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'jabatan',
        'nama',
        'prodi',
        'npm',
    ];

    /**
     * Get the user that owns the kepengurusan.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
