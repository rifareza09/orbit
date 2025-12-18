# Panduan Upload File Limits

## ⚠️ Current Limitation

**Server limit saat ini: 8MB total** (PHP default `post_max_size`)

Untuk meningkatkan limit, lihat bagian **Konfigurasi Server** di bawah.

## Batas Upload yang Aman (SAAT INI)

### Per File
- **Maksimal 5MB** per file untuk:
  - Laporan Pertanggung Jawaban (LPJ)
  - Bukti Pengeluaran (Nota/Kwitansi)
  - Dokumentasi Kegiatan

### Total Upload
- **Maksimal 8MB** untuk total seluruh file yang di-upload dalam satu form

## Format File yang Diterima
- PDF
- JPG / JPEG
- PNG

## Error Handling

Jika Anda mendapatkan error "The POST data is too large" atau "Content-Length exceeds limit":

### Solusi Cepat (Segera)
1. **Kompresi gambar** sebelum upload menggunakan:
   - TinyPNG (tinypng.com)
   - ImageOptim (imageoptim.com)
   - Atau tools lokal lainnya

2. **Upload terpisah**
   - Upload dokumentasi di form pertama saja
   - Upload bukti pengeluaran di form kedua
   - Upload LPJ di form ketiga
   - Ini akan mengurangi total size per form

3. **Kurangi jumlah file**
   - Gabung beberapa dokumen dalam satu file PDF
   - Pilih hanya foto dokumentasi yang penting

### Solusi Permanen (Untuk IT/Admin)
Hubungi IT untuk **update konfigurasi server** agar limit bisa ditingkatkan ke 50-100MB:

## Konfigurasi Server (UNTUK IT/ADMIN)

### ❌ Current Status
```
post_max_size = 8M       (Default PHP)
upload_max_filesize = 2M (Terlalu kecil)
```

### ✅ Recommended Status
```
post_max_size = 100M
upload_max_filesize = 100M
memory_limit = 256M
```

### Langkah Update (Laragon - Apache)

1. **Buka Laragon Control Panel**
   - Klik Menu → PHP → php.ini

2. **Cari dan ubah baris:**
   ```ini
   ; Upload
   upload_max_filesize = 100M
   post_max_size = 100M
   memory_limit = 256M
   ```

3. **Save dan restart Apache**
   - Klik tombol stop → start di Laragon

4. **Test dengan URL:**
   ```
   http://orbit.test/laporan-kegiatan/buatlaporankegiatan/[id]
   ```

### Langkah Update (Nginx)

Edit `/etc/nginx/nginx.conf` atau config site:
```nginx
server {
    client_max_body_size 100M;
}
```

Kemudian restart:
```bash
sudo systemctl restart nginx
```

### Langkah Update (DirectAdmin)

1. Login ke DirectAdmin control panel
2. Pilih **Account Manager → Apache Customizations**
3. Tambahkan:
   ```
   <Directory /home/*/public_html>
       php_value post_max_size 100M
       php_value upload_max_filesize 100M
   </Directory>
   ```
4. Restart Apache

### Verifikasi Konfigurasi

Buat file `info.php` di public folder:
```php
<?php
echo phpinfo();
?>
```

Cari nilai:
- `post_max_size`
- `upload_max_filesize`
- `memory_limit`

Pastikan sesuai dengan yang sudah diset.

## Client-Side Validation

Frontend otomatis melakukan validasi **sebelum** submit:
- ✅ Cek ukuran per file (max 5MB)
- ✅ Cek total semua file (max 8MB, atau sesuai server limit)
- ✅ Cek format file (PDF, JPG, PNG)
- ✅ Tampilkan alert dengan detail ukuran jika melebihi

Validasi ini mencegah error server dan memberikan feedback langsung ke user.

## Tips Mengoptimalkan Ukuran File

### Untuk Images (JPG/PNG)
1. **Kompresi online:**
   - TinyPNG: https://tinypng.com
   - ImageOptim: https://imageoptim.com
   - Compressor.io: https://compressor.io

2. **Reduce resolution:**
   - Dokumentasi: 1200x800px sudah cukup
   - Screenshot: 800x600px sudah cukup

3. **Pilih format terbaik:**
   - JPG untuk foto (lebih kecil)
   - PNG untuk screenshot dengan teks (lebih jelas)

### Untuk PDF
1. Gunakan PDF compression tools
2. Hapus metadata yang tidak perlu
3. Reduce image quality di dalam PDF
4. Tools: https://smallpdf.com, https://ilovepdf.com

### Estimasi Ukuran
- Foto standar (3000x2000px): 2-5MB → setelah kompresi 300-500KB
- Screenshot (1920x1080px): 500KB → setelah kompresi 100-200KB
- PDF document: 1-10MB (tergantung banyak gambar)

## Contoh Upload yang Aman

### Scenario 1: LPJ saja
```
LPJ (PDF): 3MB
Total: 3MB ✅ OK
```

### Scenario 2: LPJ + Dokumentasi 5 foto
```
LPJ (PDF): 2MB
Foto 1-5 (masing 1MB): 5MB
Total: 7MB ✅ OK
```

### Scenario 3: LPJ + Bukti + Dokumentasi
```
LPJ (PDF): 2MB
Bukti Pengeluaran (3 file @ 1MB): 3MB
Dokumentasi (2 foto @ 1MB): 2MB
Total: 7MB ✅ OK
```

## Debugging

Jika masih error setelah konfigurasi server:

1. **Check Browser Console (F12 → Console)**
   ```
   Lihat error message yang detail
   ```

2. **Check Server Logs**
   ```bash
   # Linux/Mac
   tail -f storage/logs/laravel.log
   
   # Windows
   cat storage\logs\laravel.log
   ```

3. **Test dengan Curl**
   ```bash
   curl -F "lpj=@file.pdf" http://orbit.test/laporan-kegiatan
   ```

4. **Verify PHP Settings**
   ```bash
   php -i | grep -E "post_max_size|upload_max"
   ```

## Contact IT/Admin

Jika masalah persisten, hubungi IT dengan informasi:
- Nama file yang di-upload
- Ukuran file (total berapa MB)
- Error message lengkap dari browser
- Browser dan OS yang digunakan
- Screenshot error

---

**Last Updated:** December 18, 2025  
**Status:** Current limit 8MB, perlu update server untuk 50-100MB

