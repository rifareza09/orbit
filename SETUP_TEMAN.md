# Instruksi untuk Teman Anda

## Setup Project Orbit

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Setup Database
Import file `orbit_complete.sql` ke MySQL:

**Via phpMyAdmin:**
- Buka http://localhost/phpmyadmin
- Create database: `orbit`
- Import file `orbit_complete.sql`

**Via Command Line:**
```bash
cd c:\laragon\bin\mysql\mysql-8.0.30-winx64\bin
.\mysql.exe -uroot -e "CREATE DATABASE orbit"
.\mysql.exe -uroot orbit < "path\ke\orbit_complete.sql"
```

### 3. Setup .env
Pastikan file `.env` sudah ada dengan config:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=orbit
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Clear Cache Laravel
```bash
php artisan config:clear
php artisan cache:clear
php artisan view:clear
```

### 5. Build Frontend
```bash
npm run build
```

### 6. Jalankan Aplikasi

**CARA TERMUDAH - PHP Built-in Server:**
```bash
php artisan serve
```
Lalu buka browser: **http://127.0.0.1:8000**

**ATAU via Laragon:**
- Pindahkan folder project ke `C:\laragon\www\orbit`
- Restart Laragon
- Buka: **http://localhost/orbit/public**

**ATAU Install Laravel Herd:**
- Download: https://herd.laravel.com/windows
- Add folder project
- Buka: **http://orbit.test**

---

## Akun untuk Login

Semua akun sudah ada di database yang diimport:
- Username: (lihat di database table `users`)
- Password: (sesuai yang didaftarkan)

---

## Troubleshooting

**Error "orbit.test" tidak bisa diakses:**
- ❌ Jangan pakai orbit.test kalau tidak install Herd
- ✅ Pakai `php artisan serve` lalu buka `http://127.0.0.1:8000`

**Error database connection:**
- Pastikan MySQL Laragon jalan
- Cek `.env` sudah benar
- Jalankan `php artisan config:clear`

**Halaman blank/error:**
- `npm run build`
- `php artisan view:clear`
- `php artisan optimize:clear`
