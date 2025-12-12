<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== TEST PUSKAKA ROUTE DATA ===\n\n";

$programKerjas = \App\Models\ProgramKerja::with('user')
    ->orderBy('created_at', 'desc')
    ->get()
    ->map(function ($pk) {
        return [
            'id' => $pk->id,
            'program_kerja' => $pk->program_kerja,
            'kegiatan' => $pk->kegiatan,
            'deskripsi_kegiatan' => $pk->deskripsi_kegiatan,
            'jenis_kegiatan' => $pk->jenis_kegiatan,
            'estimasi_anggaran' => $pk->estimasi_anggaran,
            'status' => $pk->status,
            'ormawa' => $pk->user->name ?? '-',
            'created_at' => $pk->created_at->format('d M Y'),
        ];
    });

echo "Total hasil map: " . $programKerjas->count() . "\n\n";

foreach ($programKerjas as $pk) {
    echo json_encode($pk, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
}
