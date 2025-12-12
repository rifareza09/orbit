<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== CEK PROGRAM KERJA ===\n\n";

$programKerjas = \App\Models\ProgramKerja::with('user')->get();

echo "Total: " . $programKerjas->count() . " program kerja\n\n";

foreach ($programKerjas as $pk) {
    echo "ID: {$pk->id}\n";
    echo "Program Kerja: {$pk->program_kerja}\n";
    echo "Kegiatan: {$pk->kegiatan}\n";
    echo "Status: {$pk->status}\n";
    echo "User ID: {$pk->user_id}\n";
    echo "User Name: " . ($pk->user ? $pk->user->name : 'NULL') . "\n";
    echo "Created: {$pk->created_at}\n";
    echo "---\n\n";
}
