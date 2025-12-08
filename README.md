# 🚀 ORBIT - Sistem Manajemen Organisasi Mahasiswa

Aplikasi web untuk manajemen kegiatan organisasi mahasiswa Universitas YARSI, dibangun dengan Laravel 12 + React 19 + Inertia.js + TypeScript.

## 📋 Fitur Utama

- ✅ Manajemen Program Kerja
- ✅ Pengajuan Kegiatan dengan RAB
- ✅ Laporan Kegiatan (LPJ)
- ✅ Dokumentasi Kegiatan
- ✅ Prestasi Organisasi
- ✅ Multi-role (UKM, BEM, Kongres, Puskaka)
- ✅ Authentication dengan Laravel Fortify

## 🛠️ Tech Stack

- **Backend:** Laravel 12, PHP 8.3
- **Frontend:** React 19, TypeScript, Inertia.js
- **Styling:** TailwindCSS
- **Database:** MySQL / SQLite
- **Development Server:** Laravel Herd

## 📦 Prerequisites

Pastikan sudah terinstall:
- [Laravel Herd](https://herd.laravel.com/) (sudah include PHP, Composer, Node.js)
- Git
- VS Code (recommended)

## 🚀 Cara Clone & Setup Project

### 1. Clone Repository

```powershell
# Masuk ke folder Herd
cd C:\Users\YourUsername\Herd

# Clone repository
git clone https://github.com/rifareza09/orbit.git
cd orbit
```

### 2. Install Dependencies

```powershell
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

**Jika npm install error (Execution Policy):**

Buka PowerShell sebagai **Administrator**, jalankan:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Ketik `Y` lalu Enter. Tutup PowerShell Admin, buka PowerShell biasa lagi dan ulangi `npm install`.

**Jika npm install masih error (Permission/Network):**
```powershell
# Hapus node_modules dan cache
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force

# Install ulang
npm install --legacy-peer-deps
```

### 3. Setup Environment File

```powershell
# Copy .env.example ke .env
Copy-Item .env.example .env
```

Buka file `.env` di VS Code dan edit:

**Opsi A - Gunakan SQLite (Recommended untuk Development):**
```env
APP_NAME="Orbit"
APP_URL=http://orbit.test

DB_CONNECTION=sqlite
# Comment/hapus semua DB_HOST, DB_PORT, dll
```

**Opsi B - Gunakan Filess.io (Database Online):**
```env
APP_NAME="Orbit"
APP_URL=http://orbit.test

DB_CONNECTION=mysql
DB_HOST=xxxxx.h.filess.io
DB_PORT=xxxxx
DB_DATABASE=database_name
DB_USERNAME=username
DB_PASSWORD=password
```

### 4. Generate Application Key

```powershell
php artisan key:generate
```

### 5. Setup Database

**Jika menggunakan SQLite:**
```powershell
# Buat file database
New-Item -Path database\database.sqlite -ItemType File -Force

# Jalankan migration dan seeder
php artisan migrate:fresh --seed
```

**Jika menggunakan Filess.io:**
```powershell
# Jalankan migration dan seeder
php artisan migrate:fresh --seed
```

Jika migration timeout/gagal, buat tabel manual via web client Filess.io atau switch ke SQLite.

### 6. Link Storage (untuk upload file)

```powershell
php artisan storage:link
```

### 7. Build Frontend Assets

```powershell
# Build untuk production
npm run build

# ATAU untuk development (hot reload)
npm run dev
```

Jika menggunakan `npm run dev`, biarkan terminal tetap berjalan.

### 8. Akses Aplikasi

Buka browser dan akses:
```
http://orbit.test
```

Herd otomatis menjalankan server PHP, tidak perlu `php artisan serve`!

## 👥 Default User Accounts

Setelah seeder berjalan, gunakan akun berikut untuk login:

| Role | Username | Password |
|------|----------|----------|
| UKM | `ldk` | `ldk123` |
| UKM | `voyage` | `voyage123` |
| UKM | `himasi` | `himasi123` |
| UKM | `ybbc` | `ybbc123` |
| UKM | `smaka` | `smaka123` |
| BEM | `bem` | `bem123` |
| Kongres | `kongres` | `kongres123` |
| Admin (Puskaka) | `puskaka` | `puskaka123` |

## 🐛 Troubleshooting

### 504 Gateway Timeout
- Database Filess.io terlalu lambat → Switch ke SQLite
- Clear cache: `php artisan optimize:clear`

### npm install gagal
```powershell
Remove-Item -Recurse -Force node_modules
npm cache clean --force
npm install --legacy-peer-deps
```

### Herd domain tidak muncul
```powershell
herd restart
```

### Database connection error
- Pastikan kredensial `.env` benar
- Jika pakai Filess.io, pastikan database status Active
- Gunakan SQLite sebagai alternatif

### Storage/Upload error
```powershell
php artisan storage:link
```

### Cache issues
```powershell
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

## 📁 Struktur Project

```
orbit/
├── app/
│   ├── Http/Controllers/     # Controllers
│   ├── Models/                # Eloquent Models
│   └── Providers/             # Service Providers
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/        # React components
│   │   ├── layouts/           # Layout components
│   │   └── pages/             # Inertia pages
│   └── css/                   # Stylesheets
├── routes/
│   ├── web.php                # Web routes
│   └── api.php                # API routes
└── public/                    # Public assets
```

## 🔧 Development Commands

```powershell
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Run migrations
php artisan migrate

# Fresh migration with seeder
php artisan migrate:fresh --seed

# Clear all cache
php artisan optimize:clear

# Create new controller
php artisan make:controller NameController

# Create new model with migration
php artisan make:model ModelName -m
```

## 📝 Git Workflow

```powershell
# Update dari repository
git pull origin main

# Buat branch baru untuk fitur
git checkout -b feature/nama-fitur

# Commit changes
git add .
git commit -m "Deskripsi perubahan"

# Push ke repository
git push origin feature/nama-fitur
```

## 👨‍💻 Contributors

- [Rifa Reza](https://github.com/rifareza09)

## 📄 License

This project is for educational purposes - Universitas YARSI.

## 📞 Support

Jika ada masalah atau pertanyaan, silakan buat Issue di GitHub atau hubungi tim developer.

---

**© 2025 ORBIT - Pusat Kemahasiswaan Karir dan Alumni, Universitas YARSI**
