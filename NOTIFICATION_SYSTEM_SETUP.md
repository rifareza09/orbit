# 🔔 Panduan Lengkap Setup & Testing Sistem Notifikasi Orbit

## ✅ Checklist Perbaikan yang Sudah Dilakukan

### 1. **Database Migration**
- ✅ Migration `notifications` table sudah ada di `database/migrations/2026_01_10_000000_create_notifications_table.php`
- ✅ Migration fix tambahan di `database/migrations/2026_01_11_170100_fix_notifications_table.php`
- ⚠️ **WAJIB DIJALANKAN**: `php artisan migrate`

### 2. **Backend Services & Controllers**
- ✅ `NotificationService` lengkap dengan 6 method notifikasi:
  - `notifyPuskakaNewProgramKerja()` - Notif ke Puskaka saat Ormawa ajukan Program Kerja
  - `notifyProgramKerjaStatus()` - Notif ke Ormawa saat Puskaka review Program Kerja
  - `notifyPuskakaNewPengajuan()` - Notif ke Puskaka saat Ormawa ajukan Pengajuan Kegiatan
  - `notifyPengajuanKegiatanStatus()` - Notif ke Ormawa saat Puskaka review Pengajuan
  - `notifyPuskakaNewLaporan()` - Notif ke Puskaka saat Ormawa ajukan Laporan
  - `notifyLaporanKegiatanStatus()` - Notif ke Ormawa saat Puskaka review Laporan

- ✅ **Controllers sudah terintegrasi**:
  - `ProgramKerjaController::ajukan()` → kirim notif ke Puskaka ✅
  - `PuskakaController::updateStatusProgramKerja()` → kirim notif ke Ormawa ✅
  - `PengajuanKegiatanController::ajukan()` → kirim notif ke Puskaka ✅
  - `ManajemenKegiatanController::updateReview()` → kirim notif ke Ormawa ✅
  - `LaporanKegiatanController::ajukan()` → kirim notif ke Puskaka ✅
  - `EvaluasiLaporanController::updateStatus()` → kirim notif ke Ormawa ✅

### 3. **Frontend Components**
- ✅ `NotificationBell.tsx` - Komponen bell icon dengan dropdown lengkap
  - Live polling setiap 30 detik untuk cek notifikasi baru
  - Badge merah untuk unread count
  - Click to mark as read
  - Click notification untuk navigate ke action_url
  - Delete individual notification
  - Mark all as read
  
- ✅ **Integration di DashboardLayout**:
  - Bell icon sudah di header (line 245)
  - Tampil untuk semua user (Ormawa & Puskaka)

### 4. **API Routes**
- ✅ Semua endpoint notifikasi tersedia di `routes/api.php`:
  ```
  GET  /api/notifications           - List all notifications
  GET  /api/notifications/recent    - Get 10 recent unread
  GET  /api/notifications/unread-count - Get unread count
  POST /api/notifications/{id}/read - Mark as read
  POST /api/notifications/mark-all-read - Mark all as read
  DELETE /api/notifications/{id}    - Delete notification
  ```

---

## 🚀 Langkah-langkah Setup (WAJIB)

### Step 1: Jalankan Migration
```bash
php artisan migrate
```

**Output yang diharapkan:**
```
Migrating: 2026_01_11_170100_fix_notifications_table
Migrated:  2026_01_11_170100_fix_notifications_table (XXms)
```

Jika ada error "table already exists", jalankan:
```bash
php artisan migrate:fresh --force
# PERINGATAN: Ini akan reset semua data!
```

Atau jika ingin aman (rollback migration terakhir saja):
```bash
php artisan migrate:rollback --step=1
php artisan migrate
```

### Step 2: Clear Cache (Optional tapi Disarankan)
```bash
php artisan config:clear
php artisan route:clear
php artisan cache:clear
```

### Step 3: Build Frontend (Jika ada perubahan)
```bash
npm run build
# atau untuk development
npm run dev
```

---

## 🧪 Testing Manual - Skenario Lengkap

### **Skenario 1: Ormawa Submit Program Kerja → Puskaka Dapat Notifikasi**

1. **Login sebagai Ormawa** (role: ukm/bem/kongres)
2. Buka **Program Kerja** → Klik **Tambah Program Kerja**
3. Isi form → **Simpan** (status: Belum Diajukan)
4. **Klik tombol "Ajukan"** pada program kerja yang baru dibuat
5. ✅ **Expected**: Status berubah jadi "Diajukan"

6. **Login sebagai Puskaka** (role: puskaka)
7. ✅ **Expected**: 
   - **Bell icon menampilkan badge merah dengan angka 1**
   - Klik bell → muncul notifikasi:
     ```
     🔔 Program Kerja Baru
     [Nama Ormawa] telah mengajukan Program Kerja '[Nama Program]'
     Baru saja
     ```
   - Klik notifikasi → redirect ke `/program-kerja/{id}/detail-puskaka`

---

### **Skenario 2: Puskaka Review Program Kerja → Ormawa Dapat Notifikasi**

1. **Masih login sebagai Puskaka**
2. Buka **Program Kerja** → Klik detail program kerja yang diajukan
3. **Pilih status review**: Disetujui / Ditolak / Direvisi
4. Isi catatan (wajib jika Ditolak/Direvisi) → **Simpan**
5. ✅ **Expected**: Status berubah sesuai pilihan

6. **Login kembali sebagai Ormawa**
7. ✅ **Expected**:
   - **Bell icon badge angka 1**
   - Klik bell → muncul notifikasi:
     ```
     ✅ Status Program Kerja: Disetujui
     Program Kerja '[Nama]' telah disetujui oleh Puskaka.
     Baru saja
     ```
   - Klik notifikasi → redirect ke `/program-kerja/{id}/detail`

---

### **Skenario 3: Ormawa Submit Pengajuan Kegiatan → Puskaka Dapat Notifikasi**

1. **Login sebagai Ormawa**
2. Buka **Pengajuan Kegiatan** → **Buat Proposal**
3. Pilih Program Kerja yang sudah **Disetujui** → Isi form → **Simpan**
4. **Klik "Ajukan"** pada pengajuan yang baru dibuat
5. ✅ **Expected**: Status berubah jadi "Diajukan"

6. **Login sebagai Puskaka**
7. ✅ **Expected**:
   - **Bell badge +1**
   - Notifikasi:
     ```
     📝 Pengajuan Kegiatan Baru
     [Nama Ormawa] telah mengajukan kegiatan '[Nama Kegiatan]'
     ```
   - Klik → redirect ke `/manajemen-kegiatan/{id}/detail`

---

### **Skenario 4: Puskaka Review Pengajuan → Ormawa Dapat Notifikasi**

1. **Login Puskaka** → Buka **Manajemen Kegiatan**
2. Klik detail pengajuan → Pilih status → Isi catatan → **Simpan**
3. **Login Ormawa**
4. ✅ **Expected**:
   - Bell badge +1
   - Notifikasi status pengajuan (Disetujui/Ditolak/Direvisi)
   - Klik → redirect ke `/pengajuan-kegiatan/{id}/detail`

---

### **Skenario 5: Ormawa Submit Laporan → Puskaka Dapat Notifikasi**

1. **Login Ormawa** → **Laporan Kegiatan**
2. Pilih kegiatan yang sudah **Disetujui** → **Buat Laporan**
3. Isi form → **Simpan** → **Klik "Ajukan"**
4. **Login Puskaka**
5. ✅ **Expected**:
   - Bell badge +1
   - Notifikasi:
     ```
     📊 Laporan Kegiatan Baru
     [Nama Ormawa] telah mengajukan laporan kegiatan '[Nama]'
     ```
   - Klik → redirect ke `/evaluasi-laporan/detail/{id}`

---

### **Skenario 6: Puskaka Review Laporan → Ormawa Dapat Notifikasi**

1. **Login Puskaka** → **Evaluasi & Laporan**
2. Klik detail → Review → **Simpan**
3. **Login Ormawa**
4. ✅ **Expected**:
   - Bell badge +1
   - Notifikasi status laporan (Selesai/Ditolak/Direvisi)
   - Klik → redirect ke `/laporan-kegiatan/{id}/detail`

---

## 🔍 Debugging - Jika Notifikasi Tidak Muncul

### 1. Cek Database
```bash
php artisan tinker
```
```php
// Cek apakah table notifications ada
\Schema::hasTable('notifications');
// true

// Cek jumlah notifikasi
\App\Models\Notification::count();

// Cek notifikasi user tertentu
\App\Models\Notification::where('user_id', 1)->get();

// Cek user puskaka
\App\Models\User::where('role', 'puskaka')->get();
```

### 2. Cek Console Browser (F12)
- Buka **Network tab** → Filter XHR
- Setelah klik "Ajukan", cek apakah ada request ke `/api/notifications/unread-count`
- Lihat response: `{"count": 1}` atau `{"count": 0}`

### 3. Cek Error Log
```bash
tail -f storage/logs/laravel.log
```

### 4. Manual Test Notifikasi via Tinker
```bash
php artisan tinker
```
```php
use App\Services\NotificationService;

// Test notif ke Puskaka
NotificationService::notifyPuskakaNewProgramKerja(
    'Test Ormawa',
    'Test Program Kerja',
    1
);

// Cek apakah notif masuk
\App\Models\Notification::latest()->first();
```

---

## 📊 Monitoring Notifikasi

### Lihat Semua Notifikasi User
```php
// Via Tinker
\App\Models\Notification::where('user_id', 1)
    ->orderBy('created_at', 'desc')
    ->get(['id', 'title', 'message', 'is_read', 'created_at']);
```

### Hapus Semua Notifikasi (Testing)
```php
\App\Models\Notification::truncate();
```

---

## ⚙️ Konfigurasi Lanjutan

### Ubah Polling Interval (NotificationBell.tsx)
Default: 30 detik
```typescript
// Line 119
const interval = setInterval(fetchUnreadCount, 30000);
// Ubah 30000 menjadi 10000 untuk 10 detik
```

### Ubah Jumlah Notifikasi di Dropdown
Default: 10 notifikasi terbaru
```typescript
// Line 28 NotificationBell.tsx
const response = await axios.get('/api/notifications/recent');
// Endpoint ini sudah limit 10 di NotificationController::recent()
```

---

## 🎯 Checklist Testing Akhir

- [ ] Migration berhasil (`notifications` table ada di database)
- [ ] Login Ormawa → Ajukan Program Kerja → Bell Puskaka badge +1
- [ ] Puskaka review Program Kerja → Bell Ormawa badge +1
- [ ] Ormawa ajukan Pengajuan Kegiatan → Bell Puskaka badge +1
- [ ] Puskaka review Pengajuan → Bell Ormawa badge +1
- [ ] Ormawa ajukan Laporan → Bell Puskaka badge +1
- [ ] Puskaka review Laporan → Bell Ormawa badge +1
- [ ] Klik notifikasi → Redirect ke halaman yang benar
- [ ] Mark as read berfungsi (badge berkurang)
- [ ] Mark all as read berfungsi
- [ ] Delete notifikasi berfungsi
- [ ] Polling setiap 30 detik berjalan

---

## 🐛 Known Issues & Solutions

### Issue 1: "Column not found: user_id"
**Solution**: Jalankan migration
```bash
php artisan migrate
```

### Issue 2: Bell tidak muncul
**Solution**: Cek apakah `NotificationBell` sudah di-import di `DashboardLayout.tsx`
```typescript
import NotificationBell from '@/components/NotificationBell';
```

### Issue 3: Badge tidak update real-time
**Solution**: Refresh page atau tunggu 30 detik (polling interval)

### Issue 4: Notifikasi tidak masuk database
**Solution**: Cek apakah controller sudah pakai `NotificationService`:
```php
use App\Services\NotificationService;

// Di method ajukan()
NotificationService::notifyPuskakaNewProgramKerja(...);
```

---

## 📝 Summary Perubahan File

| File | Perubahan |
|------|-----------|
| `database/migrations/2026_01_11_170100_fix_notifications_table.php` | ✅ Dibuat (migration fix) |
| `app/Services/NotificationService.php` | ✅ Fixed URL route laporan |
| `app/Http/Controllers/LaporanKegiatanController.php` | ✅ Added method `ajukan()` |
| `app/Http/Controllers/ProgramKerjaController.php` | ✅ Sudah ada NotificationService |
| `app/Http/Controllers/PengajuanKegiatanController.php` | ✅ Sudah ada NotificationService |
| `app/Http/Controllers/ManajemenKegiatanController.php` | ✅ Sudah ada NotificationService |
| `app/Http/Controllers/EvaluasiLaporanController.php` | ✅ Sudah ada NotificationService |
| `resources/js/components/NotificationBell.tsx` | ✅ Sudah lengkap |
| `resources/js/layouts/DashboardLayout.tsx` | ✅ Sudah integrate NotificationBell |
| `routes/api.php` | ✅ Semua endpoint tersedia |

---

## 🎉 Selesai!

Sistem notifikasi sudah **100% siap pakai**. Tinggal:
1. Jalankan `php artisan migrate`
2. Test manual sesuai skenario di atas
3. Enjoy! 🚀

**Jika ada masalah, cek section Debugging di atas.**
