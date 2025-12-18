# PERLU ACTION: Update Laragon PHP Configuration

## Status Masalah
❌ **Server POST limit saat ini: 8MB** (default PHP)  
❌ Ormawa tidak bisa upload laporan kegiatan dengan total > 8MB

## Solusi: Update PHP Configuration

### Langkah-Langkah (Laragon)

#### 1. Buka Laragon Control Panel
- Lihat Laragon di system tray (kanan bawah Windows)
- Klik icon Laragon

#### 2. Akses PHP Settings
```
Menu → PHP → php.ini
```

#### 3. Cari Baris Upload Configuration

Cari baris yang dimulai dengan `upload_max_filesize` dan `post_max_size`:

**Sebelum (DEFAULT):**
```ini
upload_max_filesize = 2M
post_max_size = 8M
```

**Sesudah (RECOMMENDED):**
```ini
upload_max_filesize = 100M
post_max_size = 100M
memory_limit = 256M
```

#### 4. Ubah Nilai
Ganti menjadi:
```ini
; Maksimal ukuran file yang bisa di-upload
upload_max_filesize = 100M

; Maksimal ukuran POST data (form submission)
post_max_size = 100M

; Memory limit untuk processing files
memory_limit = 256M
```

#### 5. Save File
- Ctrl+S untuk save
- Close notepad

#### 6. Restart Laragon
Di Laragon Control Panel:
1. Klik tombol **STOP** (merah)
2. Tunggu semua service berhenti
3. Klik tombol **START** (hijau)
4. Tunggu sampai semua service running (hijau)

#### 7. Verifikasi Perubahan
1. Buka browser
2. Pergi ke: http://orbit.test/phpinfo.php
3. Cari nilai `post_max_size` dan `upload_max_filesize`
4. Pastikan sudah 100M

Jika belum ada file phpinfo.php, buat di `public/phpinfo.php`:
```php
<?php
phpinfo();
?>
```

### Result Setelah Update

✅ Upload limit: **100MB**  
✅ Ormawa bisa upload laporan kegiatan dengan file besar  
✅ Validasi frontend mencegah error dengan notifikasi detail

## Testing

1. **Login sebagai ormawa** di http://orbit.test
2. **Buat laporan kegiatan** dengan upload:
   - LPJ: 2-3MB
   - Bukti pengeluaran: 2-3 file @ 1-2MB
   - Dokumentasi: 3-4 foto @ 1MB

3. **Total upload** bisa sampai 50-100MB tanpa error

## File Validation

Frontend tetap memberi warning jika:
- Satu file > 5MB: "File terlalu besar! Max 5MB per file"
- Total > 8MB (sebelum server fix): "Total file terlalu besar!"
- Format salah: "Harus PDF, JPG, atau PNG"

## Tips

- **Jangan set terlalu tinggi**: 100MB sudah cukup, 256MB+ bisa membuat server lambat
- **Sesuaikan memory_limit**: Harus lebih tinggi dari post_max_size
- **Test setelah update**: Jangan lupa restart dan test di browser

## Jika Ada Error

Jika masih error setelah update:

1. **Double-check php.ini**
   ```
   Pastikan tidak ada typo atau semicolon di depan
   upload_max_filesize = 100M  ✅
   ;upload_max_filesize = 100M  ❌ (tidak aktif)
   ```

2. **Clear browser cache**
   - Ctrl+Shift+Delete (Chrome/Firefox)
   - Hapus cache dan cookies

3. **Test dengan curl**
   ```bash
   curl -F "lpj=@file.pdf" http://orbit.test/laporan-kegiatan
   ```

4. **Check Laragon logs**
   ```
   Menu → PHP → Logs
   ```

---

**Catatan**: Setelah update ini, ormawa bisa upload laporan kegiatan tanpa kendala error "POST data too large".
