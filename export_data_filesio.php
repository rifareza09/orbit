<?php
/**
 * Script untuk export data dari Files.io ke Laragon
 * Jalankan: php export_data_filesio.php
 */

// Koneksi ke Files.io (database lama)
$filesio = new mysqli(
    '9isjqo.h.filess.io',
    'orbit_micehadfly',
    '199c92f80ee6d5c1ddac3bd47b3e8931bfa55d29',
    'orbit_micehadfly',
    61002
);

if ($filesio->connect_error) {
    die("Koneksi Files.io gagal: " . $filesio->connect_error);
}

echo "✅ Koneksi ke Files.io berhasil!\n\n";

// Koneksi ke Laragon (database baru)
$laragon = new mysqli('127.0.0.1', 'root', '', 'orbit', 3306);

if ($laragon->connect_error) {
    die("Koneksi Laragon gagal: " . $laragon->connect_error);
}

echo "✅ Koneksi ke Laragon berhasil!\n\n";

// Daftar tabel yang perlu dicopy (urutan penting karena foreign key)
$tables = [
    'users',
    'program_kerjas',
    'pengajuan_kegiatans',
    'item_pengajuan_danas',
    'laporan_kegiatans',
    'dokumentasis',
    'prestasis',
    'kepengurusans',
    'jadwal_latihans'
];

$laragon->query("SET FOREIGN_KEY_CHECKS = 0");

foreach ($tables as $table) {
    echo "📋 Mengcopy tabel: $table\n";

    // Ambil data dari Files.io
    $result = $filesio->query("SELECT * FROM $table");

    if (!$result) {
        echo "   ⚠️  Error query: " . $filesio->error . "\n";
        continue;
    }

    $count = 0;

    // Hapus data lama di Laragon
    $laragon->query("TRUNCATE TABLE $table");

    // Copy baris per baris
    while ($row = $result->fetch_assoc()) {
        $columns = array_keys($row);
        $values = array_values($row);

        // Escape values
        $escapedValues = array_map(function($val) use ($laragon) {
            if (is_null($val)) return 'NULL';
            return "'" . $laragon->real_escape_string($val) . "'";
        }, $values);

        $sql = "INSERT INTO $table (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $escapedValues) . ")";

        if (!$laragon->query($sql)) {
            echo "   ❌ Error insert: " . $laragon->error . "\n";
            echo "   SQL: $sql\n";
            break;
        }

        $count++;
    }

    echo "   ✅ $count baris berhasil dicopy\n\n";
}

$laragon->query("SET FOREIGN_KEY_CHECKS = 1");

echo "🎉 Selesai! Semua data berhasil dipindahkan.\n";

$filesio->close();
$laragon->close();
