<?php
/**
 * Script Export Data dari Files.io
 * Untuk teman yang ingin copy data dari Files.io ke Laragon lokal
 *
 * CARA PAKAI:
 * 1. Pastikan MySQL Laragon sudah jalan
 * 2. Buat database 'orbit' di Laragon
 * 3. Jalankan: php export_dari_filesio.php
 */

echo "===========================================\n";
echo "EXPORT DATA DARI FILES.IO KE LARAGON\n";
echo "===========================================\n\n";

// Step 1: Koneksi ke Files.io
echo "📡 Menghubungkan ke Files.io...\n";

$filesio = @new mysqli(
    '9isjqo.h.filess.io',
    'orbit_micehadfly',
    '199c92f80ee6d5c1ddac3bd47b3e8931bfa55d29',
    'orbit_micehadfly',
    61002
);

if ($filesio->connect_error) {
    die("❌ Koneksi Files.io GAGAL: " . $filesio->connect_error . "\n\n");
}
echo "✅ Berhasil terhubung ke Files.io!\n\n";

// Step 2: Koneksi ke Laragon
echo "📡 Menghubungkan ke Laragon MySQL...\n";

$laragon = @new mysqli('127.0.0.1', 'root', '', 'orbit', 3306);

if ($laragon->connect_error) {
    die("❌ Koneksi Laragon GAGAL: " . $laragon->connect_error . "\n\n" .
        "PASTIKAN:\n" .
        "1. MySQL Laragon sudah jalan\n" .
        "2. Database 'orbit' sudah dibuat\n" .
        "3. Username root tanpa password\n\n");
}
echo "✅ Berhasil terhubung ke Laragon!\n\n";

// Step 3: Copy data
echo "📦 Memulai export data...\n";
echo "===========================================\n\n";

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
$totalRows = 0;

foreach ($tables as $table) {
    echo "📋 Tabel: $table\n";

    // Cek apakah tabel ada
    $checkTable = $filesio->query("SHOW TABLES LIKE '$table'");
    if ($checkTable->num_rows == 0) {
        echo "   ⚠️  Tabel tidak ditemukan, skip...\n\n";
        continue;
    }

    // Ambil data
    $result = $filesio->query("SELECT * FROM $table");

    if (!$result) {
        echo "   ⚠️  Error query: " . $filesio->error . "\n\n";
        continue;
    }

    $count = 0;

    // Hapus data lama
    $laragon->query("TRUNCATE TABLE $table");

    // Insert data baru
    while ($row = $result->fetch_assoc()) {
        $columns = array_keys($row);
        $values = array_values($row);

        $escapedValues = array_map(function($val) use ($laragon) {
            if (is_null($val)) return 'NULL';
            return "'" . $laragon->real_escape_string($val) . "'";
        }, $values);

        $sql = "INSERT INTO $table (" . implode(', ', $columns) . ") VALUES (" . implode(', ', $escapedValues) . ")";

        if (!$laragon->query($sql)) {
            echo "   ❌ Error insert baris " . ($count + 1) . ": " . $laragon->error . "\n";
            break;
        }

        $count++;
    }

    $totalRows += $count;
    echo "   ✅ $count baris berhasil dicopy\n\n";
}

$laragon->query("SET FOREIGN_KEY_CHECKS = 1");

echo "===========================================\n";
echo "🎉 SELESAI!\n";
echo "===========================================\n";
echo "Total: $totalRows baris data berhasil diexport\n";
echo "Database Laragon sudah siap dipakai!\n\n";

$filesio->close();
$laragon->close();
