<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prestasi extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'nama_prestasi',
        'jenis_prestasi',
        'tingkat_kejuaraan',
        'nama_peraih',
        'tanggal_perolehan',
        'bukti_path',
    ];

    protected $casts = [
        'tanggal_perolehan' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
