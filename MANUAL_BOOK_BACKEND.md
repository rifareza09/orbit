# MANUAL BOOK PENGEMBANGAN (BACKEND)
# WEBSITE ORGANISASI KEMAHASISWAAN (ORBIT)

**DOKUMEN MANUAL BOOK**

**Dosen Ilmu:**
* Herika Hayurani S.Kom, M.Kom
* Paramaresthi Windriyani, S.Kom., M.Eng.
* Nurmaya S.Kom, M.Eng, Ph.D

**Disusun oleh:**
* MUHAMMAD RAIHAN (140 2023 041)
* RIFA REZA PAHLEVI (140 2023 060)
* RAFLI DIKA RENDRA ARIFIN (140 2023 053)

---

**PROGRAM SARJANA TEKNIK INFORMATIKA**
**FAKULTAS TEKNOLOGI INFORMASI UNIVERSITAS YARSI**
**JAKARTA**
**JANUARI 2026**

---

## KATA PENGANTAR

Puji syukur kami panjatkan ke hadirat Allah Subhanahu wa Ta'ala atas rahmat dan petunjuk-Nya, sehingga Manual Book ini dapat diselesaikan. Dokumen ini disusun khusus sebagai panduan teknis bagi pengembang selanjutnya dalam memahami arsitektur, logika server-side, dan pengelolaan database pada sistem ORBIT.

Pengembangan back-end web ini dimulai pada tahun 2025, di mana Bapak Dr. Mubarik Ahmad, S.Kom., M.Kom. selaku klien memberikan kepercayaan kepada tim MCL untuk membangun pondasi sistem ORBIT. Fokus utama pengembangan kami mencakup perancangan API, integrasi fitur, hingga optimasi performa sistem agar website dapat berjalan stabil dalam memproses pengajuan kegiatan Organisasi Kemahasiswaan.

Kami berharap manual ini dapat membantu tim pengembang back-end berikutnya dalam memahami alur data dan struktur kode yang telah dibangun, sehingga proses pengembangan berkelanjutan dapat berjalan dengan baik. Terima kasih sebesar-besarnya kami ucapkan kepada Bapak Dr. Mubarik Ahmad, S.Kom., M.Kom. atas kepercayaan dan kontribusinya dalam mendorong inovasi teknologi bagi Organisasi Kemahasiswaan.

Semoga Allah Subhanahu wa Ta'ala senantiasa memberikan rahmat dan petunjuk-Nya kepada kita semua dalam setiap upaya pengembangan sistem ini. Aamiin.

**Jakarta, Januari 2026**

**Tim MCL**

---

## DAFTAR ISI

1. [BAB I PENDAHULUAN](#bab-i-pendahuluan)
   - [1.1 Latar Belakang](#11-latar-belakang)
   - [1.2 Tujuan Manual Book](#12-tujuan-manual-book)
   - [1.3 Teknologi Stack](#13-teknologi-stack)
   - [1.4 Link Desain UI/UX dan Repositori](#14-link-desain-uiux-dan-repositori)
2. [BAB II PERSIAPAN PENGEMBANGAN](#bab-ii-persiapan-pengembangan)
   - [2.1 Instalasi Node.js dan NPM](#21-instalasi-nodejs-dan-npm)
   - [2.2 Instalasi dan Konfigurasi Git](#22-instalasi-dan-konfigurasi-git)
   - [2.3 Konfigurasi Environment Variables](#23-konfigurasi-environment-variables)
   - [2.4 Konfigurasi Database MySQL](#24-konfigurasi-database-mysql)
   - [2.5 Konfigurasi Tailwind CSS](#25-konfigurasi-tailwind-css)
   - [2.6 Struktur Proyek](#26-struktur-proyek)
3. [BAB III DEPLOYMENT](#bab-iii-deployment)
   - [3.1 Persiapan Sebelum Deployment](#31-persiapan-sebelum-deployment)
   - [3.2 Opsi A: Manual Deployment via SSH](#32-opsi-a-manual-deployment-via-ssh)
   - [3.3 Opsi B: Deployment dengan Docker](#33-opsi-b-deployment-dengan-docker)
   - [3.4 Verifikasi Deployment](#34-verifikasi-deployment)
4. [BAB IV PENUTUP](#bab-iv-penutup)
   - [4.1 Kesimpulan](#41-kesimpulan)
   - [4.2 Saran](#42-saran)

---

## BAB I PENDAHULUAN

### 1.1 Latar Belakang

Organisasi kemahasiswaan seperti Unit Kegiatan Mahasiswa (UKM), Badan Eksekutif Mahasiswa (BEM), dan Kongres memiliki peran penting dalam mengembangkan soft skills, kepemimpinan, dan kreativitas mahasiswa. Dalam menjalankan berbagai program kerja dan kegiatan, organisasi-organisasi tersebut membutuhkan sistem pengelolaan yang terstruktur, mulai dari perencanaan, pengajuan proposal, penganggaran, hingga pelaporan dan dokumentasi kegiatan.

Selama ini, proses pengelolaan kegiatan organisasi kemahasiswaan masih dilakukan secara manual atau menggunakan sistem yang belum terintegrasi. Hal ini menimbulkan beberapa kendala, antara lain kesulitan dalam melacak status pengajuan proposal kegiatan, proses review dan approval yang memakan waktu lama, dokumentasi kegiatan yang tidak terorganisir dengan baik, kesulitan dalam monitoring realisasi anggaran, dan tidak adanya arsip digital yang terstruktur untuk kegiatan-kegiatan sebelumnya.

Untuk mengatasi permasalahan tersebut, diperlukan sebuah sistem informasi manajemen kegiatan organisasi yang dapat mengintegrasikan seluruh alur kerja, mulai dari penyusunan program kerja, pengajuan proposal, pencairan dana, pelaksanaan kegiatan, hingga pelaporan dan dokumentasi.

Orbit hadir sebagai solusi berbasis web yang memungkinkan organisasi kemahasiswaan mengelola seluruh aktivitas mereka secara digital dan terstruktur. Sistem ini dilengkapi dengan fitur role-based access untuk membedakan hak akses antara pengurus organisasi dan administrator Puskaka (Pusat Kegiatan Mahasiswa), sehingga proses monitoring, review, dan approval dapat berjalan lebih efisien dan transparan.

### 1.2 Tujuan Manual Book

Organisasi kemahasiswaan seperti Unit Kegiatan Mahasiswa (UKM), Badan Eksekutif Mahasiswa (BEM), dan Kongres memiliki peran penting dalam mengembangkan soft skills, kepemimpinan, dan kreativitas mahasiswa. Dalam menjalankan berbagai program kerja, organisasi-organisasi tersebut membutuhkan arsitektur sistem pengelolaan data yang terstruktur, mulai dari manajemen skema perencanaan, validasi pengajuan proposal, kalkulasi penganggaran, hingga integritas data pelaporan.

Selama ini, proses pengelolaan kegiatan masih dilakukan secara manual atau menggunakan sistem yang belum terintegrasi secara database. Hal ini menimbulkan beberapa kendala teknis dari sisi back-end, antara lain sulitnya melakukan tracking status pengajuan secara real-time, proses review dan approval yang tidak terautomasi dengan baik, serta dokumentasi data yang tidak terorganisir dalam sebuah storage atau arsip digital yang terstruktur. Selain itu, monitoring realisasi anggaran menjadi sulit dilakukan karena tidak adanya sinkronisasi data yang akurat.

Untuk mengatasi permasalahan tersebut, diperlukan sebuah sistem informasi manajemen dengan pondasi back-end yang kuat untuk mengintegrasikan seluruh alur kerja (workflow). Sistem ini harus mampu menangani logika bisnis mulai dari penyusunan program kerja, pengajuan proposal, hingga manajemen pencairan dana dan pelaporan.

Orbit hadir sebagai solusi berbasis web dengan fokus pada efisiensi pemrosesan data secara digital. Sistem ini diimplementasikan dengan fitur Role-Based Access Control (RBAC) untuk mengatur hak akses antara pengurus organisasi dan administrator Puskaka (Pusat Kegiatan Mahasiswa). Dengan manajemen logika server yang tepat, proses monitoring, review, dan approval dapat berjalan lebih efisien, aman, dan transparan melalui sistem yang terautomasi.

### 1.3 Teknologi Stack

**a. Git**
Git adalah sistem kontrol versi terdistribusi yang digunakan untuk melacak perubahan dalam kode selama pengembangan perangkat lunak. Git memungkinkan pengembang bekerja secara kolaboratif, mengelola versi kode, dan memudahkan rollback ke versi sebelumnya jika terjadi kesalahan. Dengan Git, pengguna dapat membuat repositori, melakukan commit untuk menyimpan perubahan, membuat branch untuk fitur baru, dan menggabungkan (merge) branch ke dalam proyek utama. Git juga digunakan untuk berkolaborasi secara tim melalui platform hosting kode seperti GitHub, GitLab, dan Bitbucket.

**b. Node.js**
Node.js adalah runtime JavaScript berbasis server yang memungkinkan menjalankan JavaScript di luar browser. Ini menggunakan mesin V8 dari Google Chrome dan dirancang untuk membangun aplikasi jaringan yang skalabel dan efisien. Dengan Node.js, dapat mengembangkan server, API, dan aplikasi web dengan performa tinggi.

**c. React**
React TSX adalah penggunaan React dengan TypeScript, di mana ekstensi file yang digunakan adalah .tsx. TSX memungkinkan penulisan JSX (HTML di dalam JavaScript) sekaligus dengan fitur static typing dari TypeScript. Dengan TSX, pengembang dapat menentukan tipe data pada props, state, function, dan event, sehingga kesalahan dapat dideteksi sejak tahap pengembangan.

**d. MySQL v.8.0.30**
MySQL adalah sistem manajemen basis data relasional (RDBMS) bersifat open-source yang memanfaatkan SQL (Structured Query Language) untuk pengelolaan dan pengambilan data. MySQL banyak digunakan dalam aplikasi web dan bisnis karena kinerjanya yang optimal serta kemampuannya menangani data dalam berbagai skala.

**e. TAILWIND CSS**
Tailwind CSS adalah utlility-first Framework CSS yang didesain untuk mempermudah dan mempercepat aplikasi dalam membuat sebuah tampilan aplikasi yang lebih interaktif dan memanjakan mata. Tailwind CSS termasuk tipe utility yang lengkap dikarenakan meskipun setiap utility telah disediakan, kita bisa mengkustom utility sesuai dengan keperluan.

**f. VITE 7.2.2**
Vite adalah sebuah build tool dan development server modern yang digunakan untuk mengembangkan aplikasi web berbasis JavaScript. Vite dirancang untuk memberikan proses pengembangan yang lebih cepat dan efisien, terutama pada proyek frontend seperti React, Vue, dan Svelte.

**g. INERTIA.JS**
Inertia.js adalah sebuah library yang memungkinkan pengembangan Single Page Application (SPA) tanpa perlu membuat API terpisah. Inertia.js berperan sebagai jembatan antara backend dan frontend, sehingga aplikasi dapat terasa seperti SPA, tetapi tetap menggunakan routing dan controller backend.

### 1.4 Link Desain UI/UX dan Repositori

*   **Figma:** [UI/UX Organisasi Kemahasiswaan Universitas YARSI](https://www.figma.com/design/qcw6VXpvaUPmsKl79ozjn4/UI-UX-Organisasi-Kemahasiswaan-Universitas-YARSI?node-id=0-1&p=f&t=MeqprGNoS0mr6Pc0-0)
*   **GitHub:** [https://github.com/rifareza09/orbit](https://github.com/rifareza09/orbit)
*   **Referensi:**
    *   https://git-scm.com/
    *   https://nodejs.org/en
    *   https://inertiajs.com/
    *   https://www.react.dev/
    *   https://vite.dev/
    *   https://tailwindcss.com/

---

## BAB II PERSIAPAN PENGEMBANGAN

### 2.1 Instalasi Node.js dan NPM

**a. Unduh Node.js**
Kunjungi situs resmi Node.js. Pilih versi LTS (Long Term Support) untuk stabilitas yang lebih baik. Unduh installer yang sesuai dengan sistem operasi yang akan digunakan (Windows, macOS, atau Linux).

**b. Instal Node.js**
Jalankan installer yang telah diunduh dan ikuti petunjuk instalasi. Proses ini akan menginstal Node.js serta NPM (Node Package Manager) secara bersamaan.

**c. Verifikasi Instalasi**
Buka terminal atau command prompt. Jalankan perintah berikut untuk memeriksa versi Node.js:
> **[Gambar 1. Memeriksa versi Node.js]**

> **[Gambar 2. Output versi node]**

Perintah berikut untuk memeriksa versi NPM:
> **[Gambar 3. Memeriksa Versi NPM]**

> **[Gambar 4. Output Code Versi Node]**

### 2.2 Instalasi dan Konfigurasi Git

**a. Unduh Git:**
Kunjungi situs resmi Git. Unduh installer yang sesuai dengan sistem operasi yang akan digunakan.

**b. Instal Git:**
Jalankan installer dan ikuti petunjuk instalasi. Pada akhir instalasi, pastikan untuk memilih opsi untuk mengatur variabel environment agar bisa menjalankan Git dari terminal.

**c. Verifikasi Instalasi Git:**
Buka terminal dan jalankan perintah:
> **[Gambar 5. Memeriksa versi Git]**

Output versi Git:
> **[Gambar 6. Output versi Git]**

### 2.3 Konfigurasi Environment Variables

**a. Clone Repository dari GitHub:**
Buka terminal menggunakan "Git Bash". Clone repository aplikasi dari GitHub:
> **[Gambar 7. Clone repository aplikasi dari GitHub]**

Masuk ke directory proyek:
> **[Gambar 8. Masuk ke directory proyek]**

**b. Buat File `.env`:**
Di dalam proyek orbit, buat file baru dengan nama `.env`. Masukkan variabel lingkungan yang diperlukan.
Contoh isi file `.env`:
> **[Gambar 9. Isi file '.env']**

**c. Install Dependencies dan Jalankan Aplikasi:**
Install dependencies:
> **[Gambar 10. Install dependencies]**

Jalankan aplikasi:
> **[Gambar 11. Jalankan aplikasi]**

Output NPM dijalankan:
> **[Gambar 12. Output NPM dijalankan]**

### 2.4 Konfigurasi Database MySQL

**a. Instal MySQL**
Kunjungi situs resmi MySQL dan unduh installer. Ikuti petunjuk instalasi. Jalankan perintah berikut untuk memeriksa versi MySQL:
> **[Gambar 13. Memeriksa Versi MySQL]**

Output versi MySQL:
> **[Gambar 14. Output versi MySQL]**

**b. Instal phpMyAdmin**
phpMyAdmin adalah antarmuka web untuk mengelola MySQL.
Tampilan Browser PhpMyAdmin:
> **[Gambar 15. Gambar Dashboard PhpMyAdmin]**

Url PhpMyAdmin:
> **[Gambar 16. URL PhpMyAdmin]**

**c. Buat Database menggunakan phpMyAdmin**
*   Buka phpMyAdmin di browser, Klik Database.
    > **[Gambar 17. Gambar Dashboard PhpMyAdmin]**
*   Di bawah Create database, masukkan nama database yang diinginkan (misalnya `orbit`).
    > **[Gambar 18. Gambar Databases]**
*   Pilih kolasi (umumnya `utf8mb4_general_ci` adalah pilihan yang baik).
*   Tampilan membuat database:
    > **[Gambar 19. Tampilan Memilih Lokasi]**
    > **[Gambar 20. Tampilan Membuat Database]**

**d. Migrasi Database:**
Jalankan Aplikasi:
> **[Gambar 21. Perintah Migrasi Data]**

**e. Seeding Data:**
Isi data awal (Role, Admin, User, dll)
> **[Gambar 22. Perintah Membuat Seeder Database]**

### 2.5 Konfigurasi Tailwind CSS

**a. Instal TailwindCSS:**
Di direktori proyek, instal Tailwind dengan perintah:
> **[Gambar 23. Install TailwindCSS]**

**b. Menginisialisasi Tailwind CSS**
Jalankan perintah untuk menginisialisasi tailwindcss. Ini akan membuat file `tailwind.config.js` dan `postcss.config.js`.
> **[Gambar 24. Menginisialisasi TailwindCSS]**

**c. Konfigurasi TailwindCSS:**
Buka file `tailwind.config.js` dan ubah code didalamnya.
Contoh konfigurasi untuk TailwindCSS:
> **[Gambar 25. Contoh konfigurasi untuk TailwindCSS]**

Lalu buat file `input.css`, lalu isi:
> **[Gambar 26. Contoh file input.css]**

### 2.6 Struktur Proyek

Proyek ORBIT menggunakan arsitektur Laravel + Inertia.js + React. Struktur proyek dibagi menjadi dua bagian utama: Backend (Laravel) dan Frontend (React/TypeScript).

**2.6.1 Struktur Backend (Laravel)**
> **[Gambar 27. Struktur Backend Laravel]**

Pada setiap bagian tersebut, terdapat file-file utama yang masing-masing memiliki peran sesuai dengan arsitektur MVC Laravel:
*   **Model Layer (`app/Models/*.php`):** Merepresentasikan tabel dalam database dan mengelola relasi antar data. Contoh: `User.php` mendefinisikan struktur data pengguna/ormawa beserta relasinya dengan ProgramKerja.
*   **Controller Layer (`app/Http/Controllers/*.php`):** Menerima HTTP request, memproses logika bisnis, dan mengembalikan response melalui Inertia.js. Contoh: `ProgramKerjaController.php`.
*   **Middleware Layer (`app/Http/Middleware/*.php`):** Memfilter request sebelum mencapai Controller, seperti autentikasi dan otorisasi. Contoh: `EnsurePuskaka.php`.
*   **Policy Layer (`app/Policies/*.php`):** Mengatur otorisasi akses terhadap resource tertentu. Contoh: `ProgramKerjaPolicy.php`.

**2.6.2 Struktur Frontend (React/Typescript)**
> **[Gambar 28. Stuktur folder FrontEnd (React/Typescript)]**

*   **Components (`components/`):** Menyimpan komponen react reusable (Sidebar.tsx, Navbar.tsx).
*   **UI Components (`components/ui/`):** Menyimpan komponen UI primitive berbasis Radix UI (button.tsx, card.tsx).
*   **Layouts (`layouts/`):** Menyediakan struktur wrapper untuk halaman (DashboardLayout.tsx).
*   **Pages (`pages/`):** Halaman-halaman aplikasi.
    > **[Gambar 29. Struktur Folder Pages]**
*   **Hooks (`hooks/`):** Custom React hooks (use-mobile.tsx).
*   **Types (`types/`):** Definisi TypeScript interfaces.
*   **Utils (`utils/`):** Fungsi utilitas (formatting tanggal).

---

## BAB III DEPLOYMENT

### 3.1 Persiapan Sebelum Deployment

Sebelum melakukan deployment, pastikan hal-hal berikut sudah disiapkan:

**a. Build Assets Frontend**
Jalankan perintah berikut untuk mengompilasi assets React/TypeScript:
> **[Gambar 30. Syntax run build]**

**b. Konfigurasi Environment Production**
Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasi untuk production:
> **[Gambar 31. Konfigurasi Env.]**

**c. File yang harus Di-upload**
Pastikan seluruh file proyek ter-upload kecuali folder `node_modules` dan `vendor`.
> **[Gambar 32. Struktur Folder]**

### 3.2 Opsi A: Manual Deployment via SSH

Metode ini adalah cara paling umum untuk deployment ke server kampus/institusi.

**a. Kebutuhan Server:**
*   PHP 8.2 atau lebih tinggi
*   Composer
*   MySQL 5.7+ atau MariaDB 10.3+
*   Web Server (Nginx atau Apache)
*   Ekstensi PHP: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

**b. Langkah-langkah:**

1.  **Upload File ke Server:** Gunakan SCP, SFTP, atau Git.
    > **[Gambar 33. Syntax menggunakan SCP]**
2.  **Install Dependencies PHP:**
    > **[Gambar 34. Install Dependencies]**
3.  **Konfigurasi Environment:**
    > **[Gambar 35. Konfigurasi Environment]**
4.  **Migrasi Database:**
    > **[Gambar 36. Migrate database]**
5.  **Optimisasi untuk Production:**
    > **[Gambar 37. Optimisasi Production]**
6.  **Set Permission Folder:**
    > **[Gambar 38. Set permission]**
7.  **Konfigurasi Web Server (Nginx):**
    > **[Gambar 39. Konfigurasi Nginx]**

### 3.3 Opsi B: Deployment dengan Docker

Metode ini lebih portable dan konsisten di berbagai environment server.

**a. Kebutuhan Server:**
* Docker
* Docker Compose

**b. Langkah-langkah:**

1.  **Buat Dockerfile:** Buat file `Dockerfile` di root proyek.
    > **[Gambar 40. File docker]**
    > **[Gambar 41. Install depedencies]**
    > **[Gambar 42. Install php ext]**
    > **[Gambar 43. Install composer]**

2.  **Buat docker-compose.yml:**
    > **[Gambar 44. Buat docker compose]**

3.  **Jalankan Container:**
    > **[Gambar 45. Jalankan container]**

### 3.4 Verifikasi Deployment

Setelah deployment selesai, lakukan pengecekan berikut:

| No | Pengecekan | Cara Verifikasi |
| -- | -- | -- |
| 1. | Halaman utama | Akses URL aplikasi di browser |
| 2. | Login | Coba login dengan akun default |
| 3. | Upload file | Test upload dokumentasi/foto |
| 4. | Database | Pastikan data tersimpan dengan benar |
| 5. | HTTPS | Pastikan SSL certificate aktif (jika ada) |

**Tabel 1. Check deployment**

---

## BAB IV PENUTUP

### 4.1 Kesimpulan

Aplikasi ORBIT (Organisasi Kemahasiswaan Information Technology) adalah sistem manajemen organisasi kemahasiswaan Universitas YARSI yang telah berhasil dikembangkan menggunakan teknologi modern seperti Laravel 11, React 19, TypeScript, Inertia.js, dan TailwindCSS v4. Manual book ini telah menjelaskan secara lengkap proses instalasi, konfigurasi environment, struktur proyek, hingga deployment ke Google Cloud Platform. Dengan arsitektur yang terstruktur dan penggunaan teknologi terkini, ORBIT mampu mengelola program kerja, pengajuan kegiatan, laporan pertanggungjawaban, dokumentasi, dan prestasi organisasi mahasiswa secara efisien.

### 4.2 Saran

Untuk pengembangan aplikasi ORBIT ke depannya, berikut beberapa saran yang dapat dipertimbangkan:

*   **Dokumentasi & Standarisasi API**
    Mengimplementasikan OpenAPI/Swagger atau Laravel Scribe untuk men-generate dokumentasi endpoint secara otomatis. Hal ini krusial untuk menjaga konsistensi kontrak data antara Backend dan Frontend (Inertia), serta mempermudah integrasi pihak ketiga di masa depan.
*   **Peningkatan Automated Testing**
    Memperluas cakupan Feature Test dan Unit Test menggunakan Pest PHP atau PHPUnit. Fokus pengujian sebaiknya diarahkan pada alur kerja kritis seperti otorisasi role, validasi input proposal, dan kalkulasi RAB untuk mencegah regresi saat penambahan fitur baru.
*   **Arsitektur Event-Driven & Real-time**
    Mengadopsi Laravel Reverb atau Pusher untuk menangani notifikasi real-time via WebSocket. Selain itu, penggunaan Laravel Queue/Jobs perlu dimaksimalkan untuk proses berat (seperti pengiriman email massal atau generasi report), agar tidak membebani response time utama pengguna.
*   **Optimasi Database & Caching**
    Mengimplementasikan Redis sebagai driver untuk Cache dan Session management. Perlu dilakukan audit query (N+1 problem) secara berkala dan penerapan Database Indexing yang tepat pada tabel-tabel transaksi besar (seperti `pengajuan_kegiatan` dan `laporan_kegiatan`) untuk menjaga kecepatan akses data.
*   **Keamanan & Audit Trail**
    Menambahkan fitur Activity Logging (menggunakan `spatie/laravel-activitylog`) untuk mencatat setiap perubahan data sensitif oleh pengguna. Ini penting untuk kebutuhan audit transparansi dana kemahasiswaan.
*   **Sentralisasi Service Layer**
    Melakukan refactoring logika bisnis yang kompleks dari Controller ke dalam Service Classes atau Action Classes. Pendekatan ini akan membuat kode lebih modular, mudah dibaca, dan lebih mudah untuk diuji.
