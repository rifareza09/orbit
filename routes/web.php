<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProgramKerjaController;
use App\Http\Controllers\PengajuanKegiatanController;
use App\Http\Controllers\LaporanKegiatanController;
use App\Http\Controllers\DokumentasiController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\KepengurusanController;
use App\Http\Controllers\JadwalLatihanController;
use App\Http\Controllers\ProfileOrmawaController;

/*
|--------------------------------------------------------------------------
| Public Route
|--------------------------------------------------------------------------
*/
Route::get('/', [\App\Http\Controllers\LandingController::class, 'index'])->name('home');
Route::get('/tentang-orbit', function () {
    return Inertia::render('tentang-orbit/index');
})->name('tentang-orbit');
Route::get('/ormawa/{id}', [\App\Http\Controllers\LandingController::class, 'showOrmawa'])->name('landing.ormawa');

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();
        if ($user->role === 'puskaka') {
            return redirect()->route('dashboard.puskaka');
        }

        // Data untuk Ormawa/UKM
        $userId = Auth::id();

        // Query data user
        $programKerja = \App\Models\ProgramKerja::where('user_id', $userId)->get();
        $pengajuan = \App\Models\PengajuanKegiatan::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        $laporan = \App\Models\LaporanKegiatan::where('user_id', $userId)->get();

        // Statistik breakdown kegiatan per status
        $statistikKegiatan = [
            'belumDiajukan' => $pengajuan->where('status', 'Belum Diajukan')->count(),
            'diajukan' => $pengajuan->where('status', 'Diajukan')->count(),
            'direview' => $pengajuan->where('status', 'Direview')->count(),
            'disetujui' => $pengajuan->where('status', 'Disetujui')->count(),
            'ditolak' => $pengajuan->where('status', 'Ditolak')->count(),
            'direvisi' => $pengajuan->where('status', 'Direvisi')->count(),
        ];

        // Aktivitas terakhir: gabung pengajuan + laporan, sort by created_at DESC, ambil 5 terakhir
        $allActivities = collect();
        foreach ($pengajuan as $p) {
            $allActivities->push([
                'type' => 'pengajuan',
                'id' => $p->id,
                'nama' => $p->nama_kegiatan,
                'status' => $p->status,
                'tanggal' => $p->created_at,
                'tanggal_format' => $p->created_at->format('d M Y H:i'),
            ]);
        }
        foreach ($laporan as $l) {
            $allActivities->push([
                'type' => 'laporan',
                'id' => $l->id,
                'nama' => $l->pengajuan_kegiatan_id ?
                    \App\Models\PengajuanKegiatan::find($l->pengajuan_kegiatan_id)?->nama_kegiatan ?? 'Unknown' : 'Unknown',
                'status' => $l->status,
                'tanggal' => $l->created_at,
                'tanggal_format' => $l->created_at->format('d M Y H:i'),
            ]);
        }

        // Sort by tanggal DESC dan ambil 5 terakhir
        $aktivitasTerakhir = $allActivities->sortByDesc('tanggal')->take(5)->values();

        // Statistik
        $stats = [
            'total' => $pengajuan->count(),
            'review' => $pengajuan->where('status', 'Diajukan')->count() + $pengajuan->where('status', 'Direview')->count(),
            'approved' => $pengajuan->where('status', 'Disetujui')->count(),
            'done' => $laporan->count(),
        ];

        // Progress timeline berdasarkan data terbaru
        $latestProposal = $pengajuan->first();
        $progressSteps = [
            ['label' => 'Belum Diajukan', 'status' => 'Belum Diajukan'],
            ['label' => 'Diajukan', 'status' => 'Diajukan'],
            ['label' => 'Disetujui', 'status' => 'Disetujui'],
            ['label' => 'Selesai', 'status' => 'Selesai'],
        ];

        // Map semua pengajuan untuk dropdown
        $proposalsList = $pengajuan->map(function ($p) {
            // Check laporan kegiatan status untuk determine progress
            $laporan = \App\Models\LaporanKegiatan::where('pengajuan_kegiatan_id', $p->id)->first();
            $laporanStatus = $laporan ? $laporan->status : null;

            // Determine status untuk progress calculation
            // Jika ada laporan dengan status "Selesai", set progress ke Selesai
            $displayStatus = $laporanStatus === 'Selesai' ? 'Selesai' : $p->status;

            $statusOrder = ['Belum Diajukan' => 0, 'Diajukan' => 1, 'Disetujui' => 2, 'Selesai' => 3, 'Ditolak' => 1, 'Direvisi' => 1];
            $currentIndex = $statusOrder[$displayStatus] ?? 0;

            $progressActive = [];
            $steps = ['Belum Diajukan', 'Diajukan', 'Disetujui', 'Selesai'];
            for ($i = 0; $i <= $currentIndex; $i++) {
                $progressActive[] = $steps[$i];
            }

            return [
                'id' => $p->id,
                'nama_kegiatan' => $p->nama_kegiatan,
                'status' => $p->status,
                'progressActive' => $progressActive,
                'created_at' => $p->created_at->format('d M Y'),
            ];
        });

        // Default ke proposal terbaru
        $defaultProposal = $proposalsList->first();
        $defaultProgressActive = $defaultProposal ? $defaultProposal['progressActive'] : [];

        return Inertia::render('dashboard/index', [
            'stats' => $stats,
            'userName' => $user->name,
            'progressSteps' => $progressSteps,
            'proposalsList' => $proposalsList,
            'defaultProposalId' => $defaultProposal?->id ?? null,
            'defaultProgressActive' => $defaultProgressActive,
            'latestProposalStatus' => $latestProposal?->status ?? 'Belum Diajukan',
            'statistikKegiatan' => $statistikKegiatan,
            'aktivitasTerakhir' => $aktivitasTerakhir,
        ]);
    })->name('dashboard');

    Route::middleware(['puskaka'])->get('/dashboard/puskaka', function () {

        // Query data dari database
        $allProgramKerjas = \App\Models\ProgramKerja::with('user')->get();
        $allPengajuan = \App\Models\PengajuanKegiatan::get();
        $allLaporan = \App\Models\LaporanKegiatan::get();

        // Statistik
        $totalProgram = $allProgramKerjas->count();
        $menungguReview = $allProgramKerjas->where('status', 'Diajukan')->count();
        $kegiatanDisetujui = $allPengajuan->where('status', 'Disetujui')->count();
        $laporanMasuk = $allLaporan->where('status', 'Diajukan')->count();

        // Bar Chart: Jumlah kegiatan per ormawa
        $barData = $allProgramKerjas->groupBy('user_id')
            ->map(function ($items) {
                $user = $items->first()->user;
                return [
                    'name' => $user->name ?? 'Unknown',
                    'total' => $items->count(),
                ];
            })
            ->sortByDesc('total')
            ->values()
            ->toArray();

        // Pie Chart: Jenis kegiatan
        $pieData = $allProgramKerjas->groupBy('jenis_kegiatan')
            ->map(function ($items) {
                return [
                    'name' => $items->first()->jenis_kegiatan ?? 'Lainnya',
                    'value' => $items->count(),
                ];
            })
            ->sortByDesc('value')
            ->values()
            ->toArray();

        // Data untuk tabel
        $programKerjas = $allProgramKerjas
            ->sortByDesc('created_at')
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
                    'user_id' => $pk->user_id,
                    'created_at' => $pk->created_at->format('d M Y'),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('dashboard/puskaka', [
            'stats' => [
                ['title' => 'Program Kerja Terdaftar', 'value' => $totalProgram, 'color' => 'bg-[#DDF4F4]'],
                ['title' => 'Menunggu Review', 'value' => $menungguReview, 'color' => 'bg-[#FFF1D7]'],
                ['title' => 'Kegiatan Disetujui', 'value' => $kegiatanDisetujui, 'color' => 'bg-[#FFE8C7]'],
                ['title' => 'Laporan Masuk', 'value' => $laporanMasuk, 'color' => 'bg-[#DFF1FF]'],
            ],
            'barData' => $barData,
            'pieData' => $pieData,
            'programKerjas' => $programKerjas,
        ]);
    })->name('dashboard.puskaka');

    // Profil (User menu)
    Route::get('/profil', function () {
        $user = Auth::user();

        $unit = [
            'nama' => $user->name ?? 'Unit Kegiatan Mahasiswa',
            'periode' => $user->periode ?? '2025/2026',
        ];

        $deskripsi = $user->deskripsi ?? '';

        // Untuk Puskaka, tidak perlu data kepengurusan dan jadwal
        $isPuskaka = $user->role === 'puskaka';

        // Get kepengurusan dari database (hanya untuk ormawa)
        $kepengurusan = $isPuskaka ? collect([]) : \App\Models\Kepengurusan::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc')
            ->get();

        // Get jadwal latihan dari database (hanya untuk ormawa)
        $jadwal = $isPuskaka ? collect([]) : \App\Models\JadwalLatihan::where('user_id', Auth::id())
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('profile/ormawa', [
            'unit' => $unit,
            'deskripsi' => $deskripsi,
            'kepengurusan' => $kepengurusan,
            'jadwal' => $jadwal,
            'logo_url' => $user->logo_path ? asset('storage/' . $user->logo_path) : null,
            'isPuskaka' => $isPuskaka,
        ]);
    })->name('profile.ormawa');

    // Edit Profil Ormawa
    Route::get('/profil/edit', [ProfileOrmawaController::class, 'edit'])->name('profile.ormawa.edit');
    Route::post('/profil/update', [ProfileOrmawaController::class, 'update'])->name('profile.ormawa.update');
    Route::post('/profile/change-password', [\App\Http\Controllers\Settings\ProfileController::class, 'changePassword'])
        ->middleware('throttle:10,1')
        ->name('profile.change-password');

    // Manajemen Kegiatan (Puskaka Only)
    Route::middleware(['puskaka'])->get('/manajemen-kegiatan', function () {
        return Inertia::render('manajemen-kegiatan/index');
    })->name('manajemen.kegiatan');

    Route::get('/manajemen-kegiatan/detail/{id}', function () {
    return Inertia::render('manajemen-kegiatan/detail');

    });

Route::middleware(['auth', 'verified', 'puskaka'])->get('/data-ormawa', function () {

        // Query data ormawa dari database (exclude puskaka)
        $ormawaList = \App\Models\User::where('role', '!=', 'puskaka')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                // Ambil nama ketua dari kepengurusan dengan jabatan "Ketua"
                $ketuaKepengurusan = \App\Models\Kepengurusan::where('user_id', $user->id)
                    ->where('jabatan', 'Ketua')
                    ->first();
                $namaKetua = $ketuaKepengurusan ? $ketuaKepengurusan->nama : '-';

                return [
                    'id' => $user->id,
                    'nama' => $user->name,
                    'jenis' => ucfirst($user->role),
                    'ketua' => $namaKetua,
                    'anggota' => \App\Models\Kepengurusan::where('user_id', $user->id)->count(),
                    'status' => $user->status ?? 'Aktif', // Ambil dari database, default Aktif
                ];
            });

        // Statistik
        $stats = [
            'total' => $ormawaList->count(),
            'aktif' => $ormawaList->where('status', 'Aktif')->count(),
            'nonaktif' => $ormawaList->where('status', 'Nonaktif')->count(),
        ];

        return Inertia::render('data-ormawa/index', [
            'dataOrmawa' => $ormawaList,
            'stats' => $stats,
        ]);
    })->name('data.ormawa');

Route::middleware(['auth', 'verified', 'puskaka'])->post('/ormawa/create', function () {

    $validated = request()->validate([
        'name' => 'required|string|max:255',
        'username' => 'required|string|unique:users,username|max:255',
        'password' => 'required|string|min:8',
        'role' => 'required|in:ukm,bem,kongres',
    ]);

    \App\Models\User::create([
        'name' => $validated['name'],
        'username' => $validated['username'],
        'password' => Hash::make($validated['password']),
        'role' => $validated['role'],
    ]);

    return redirect()
        ->route('data.ormawa')
        ->with('success', 'Ormawa baru berhasil ditambahkan');
});

Route::middleware(['auth', 'verified', 'puskaka'])->post('/ormawa/reset-akun/{userId}', [
    \App\Http\Controllers\DataOrmawaController::class,
    'resetAkun'
])
    ->middleware('throttle:5,1')
    ->name('ormawa.reset');

Route::middleware(['auth', 'verified', 'puskaka'])->post('/ormawa/toggle-status/{userId}', [
    \App\Http\Controllers\DataOrmawaController::class,
    'toggleStatus'
])
    ->middleware('throttle:10,1')
    ->name('ormawa.toggle-status');

// Arsip Tahunan (Puskaka Only)
Route::middleware(['auth', 'verified', 'puskaka'])->group(function () {
    Route::get('/puskaka/arsip-tahunan', [\App\Http\Controllers\ArsipTahunanController::class, 'index'])
        ->name('puskaka.arsip-tahunan.index');
    Route::get('/puskaka/arsip-tahunan/{id}', [\App\Http\Controllers\ArsipTahunanController::class, 'show'])
        ->name('puskaka.arsip-tahunan.show');
    Route::delete('/puskaka/arsip-tahunan/{id}', [\App\Http\Controllers\ArsipTahunanController::class, 'destroy'])
        ->middleware('throttle:10,1')
        ->name('puskaka.arsip-tahunan.destroy');
});

Route::middleware(['auth', 'verified', 'puskaka'])->get('/data-ormawa/detail/{id}', function ($id) {

    // Handle dummy data untuk ormawa non-aktif
    $dummyOrmawaMap = [
        999 => ['nama' => 'Kreasi', 'jenis' => 'UKM'],
        998 => ['nama' => 'LPM', 'jenis' => 'UKM'],
        997 => ['nama' => 'TDM', 'jenis' => 'UKM'],
    ];

    if (in_array($id, [999, 998, 997])) {
        $dummyData = $dummyOrmawaMap[$id];
        return Inertia::render('data-ormawa/detail', [
            'unit' => [
                'nama' => $dummyData['nama'],
                'periode' => '2025/2026',
                'logo_url' => null,
            ],
            'deskripsi' => 'Organisasi sedang non-aktif',
            'kepengurusan' => [],
            'jadwal' => [],
            'proposals' => [],
        ]);
    }

    // Query data user/ormawa dari database
    $user = \App\Models\User::findOrFail($id);

    // Get kepengurusan
    $kepengurusan = \App\Models\Kepengurusan::where('user_id', $user->id)
        ->get()
        ->map(function ($k) {
            return [
                'id' => $k->id,
                'jabatan' => $k->jabatan ?? '-',
                'nama' => $k->nama ?? '-',
                'prodi' => $k->prodi ?? '-',
                'npm' => $k->npm ?? '-',
            ];
        });

    // Get jadwal latihan
    $jadwal = \App\Models\JadwalLatihan::where('user_id', $user->id)
        ->get()
        ->map(function ($j) {
            return [
                'id' => $j->id,
                'divisi' => $j->divisi ?? '-',
                'hari' => $j->hari ?? '-',
                'tempat' => $j->tempat ?? '-',
                'pukul' => $j->pukul ?? '-',
            ];
        });

    // Get pengajuan kegiatan
    $proposals = \App\Models\PengajuanKegiatan::where('user_id', $user->id)
        ->get()
        ->map(function ($p) {
            return [
                'id' => $p->id,
                'nama_kegiatan' => $p->nama_kegiatan,
                'program_kerja' => $p->programKerja->program_kerja ?? '-',
                'tanggal_pelaksanaan' => $p->tanggal_pelaksanaan ? date('d M Y', strtotime($p->tanggal_pelaksanaan)) : '-',
                'status' => $p->status,
            ];
        });

    return Inertia::render('data-ormawa/detail', [
        'unit' => [
            'nama' => $user->name,
            'periode' => $user->periode ?? '2025/2026',
            'logo_url' => $user->logo_path ? asset('storage/' . $user->logo_path) : null,
        ],
        'deskripsi' => $user->deskripsi ?? '',
        'kepengurusan' => $kepengurusan,
        'jadwal' => $jadwal,
        'proposals' => $proposals,
    ]);
})->name('data.ormawa.detail');

Route::middleware(['auth', 'verified', 'puskaka'])->get('/program-kerja/indexPuskaka', function () {

    // Fetch program kerja dengan status Diajukan, Direview, Disetujui, Ditolak
    // (exclude Belum Diajukan agar hanya yang sudah/sedang di-review)
    $programKerjas = \App\Models\ProgramKerja::with('user')
        ->whereIn('status', ['Diajukan', 'Direview', 'Disetujui', 'Ditolak'])
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
                'user_id' => $pk->user_id,
                'created_at' => $pk->created_at->format('d M Y'),
            ];
        });

    return Inertia::render('program-kerja/indexPuskaka', [
        'programKerjas' => $programKerjas
    ]);
})->name('program-kerja.indexPuskaka');

Route::middleware(['auth', 'verified', 'puskaka'])->get('/program-kerja/{id}/detail-puskaka', function ($id) {

    $programKerja = \App\Models\ProgramKerja::with('user')->findOrFail($id);

    return Inertia::render('program-kerja/detailPuskaka', [
        'programKerja' => [
            'id' => $programKerja->id,
            'program_kerja' => $programKerja->program_kerja,
            'kegiatan' => $programKerja->kegiatan,
            'deskripsi_kegiatan' => $programKerja->deskripsi_kegiatan,
            'jenis_kegiatan' => $programKerja->jenis_kegiatan,
            'estimasi_anggaran' => $programKerja->estimasi_anggaran,
            'status' => $programKerja->status,
            'catatan_puskaka' => $programKerja->catatan_puskaka,
            'ormawa' => $programKerja->user->name ?? '-',
            'user_id' => $programKerja->user_id,
            'created_at' => $programKerja->created_at->format('d/m/Y H:i'),
        ]
    ]);
})->name('program-kerja.detailPuskaka');

Route::middleware(['auth', 'verified', 'puskaka'])->post('/program-kerja/{id}/update-status', [
    \App\Http\Controllers\PuskakaController::class,
    'updateStatusProgramKerja'
])->name('program-kerja.updateStatus');

Route::middleware(['auth', 'verified', 'puskaka'])->post('/pengajuan-kegiatan/{id}/update-status', [
    \App\Http\Controllers\PuskakaController::class,
    'updateStatusPengajuanKegiatan'
])->name('pengajuan-kegiatan.updateStatus');

// Manajemen Kegiatan Routes (Puskaka)
Route::middleware(['auth', 'verified', 'puskaka'])->get('/manajemen-kegiatan', [
    \App\Http\Controllers\ManajemenKegiatanController::class,
    'index'
])->name('manajemen-kegiatan.index');

Route::middleware(['auth', 'verified', 'puskaka'])->get('/manajemen-kegiatan/detail/{id}', [
    \App\Http\Controllers\ManajemenKegiatanController::class,
    'show'
])->name('manajemen-kegiatan.detail');

Route::middleware(['auth', 'verified', 'puskaka'])->post('/manajemen-kegiatan/{id}/update-review', [
    \App\Http\Controllers\ManajemenKegiatanController::class,
    'updateReview'
])->name('manajemen-kegiatan.updateReview');

/*
|--------------------------------------------------------------------------
| Evaluasi & Laporan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'puskaka'])->get('/evaluasi-laporan', [
    \App\Http\Controllers\EvaluasiLaporanController::class,
    'index'
])->name('evaluasi-laporan.index');

Route::middleware(['auth', 'verified', 'puskaka'])->get('/evaluasi-laporan/detail/{id}', [
    \App\Http\Controllers\EvaluasiLaporanController::class,
    'show'
])->name('evaluasi-laporan.detail');

Route::middleware(['auth', 'verified', 'puskaka'])->post('/evaluasi-laporan/{id}/update-status', [
    \App\Http\Controllers\EvaluasiLaporanController::class,
    'updateStatus'
])->name('evaluasi-laporan.updateStatus');

});


/*
|--------------------------------------------------------------------------
| Program Kerja
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('program-kerja')->group(function () {
    // Route untuk menampilkan daftar program kerja
    Route::get('/', [ProgramKerjaController::class, 'index'])->name('program-kerja.index');

    // Route untuk menambahkan program kerja
    Route::get('/tambah', [ProgramKerjaController::class, 'create'])->name('program-kerja.tambah');
    Route::post('/', [ProgramKerjaController::class, 'store'])->name('program-kerja.store');

    // Route untuk menampilkan detail program kerja
    Route::get('/detail/{id}', [ProgramKerjaController::class, 'show'])->name('program-kerja.detail');

    // Route untuk edit program kerja
    Route::get('/edit/{id}', [ProgramKerjaController::class, 'edit'])->name('program-kerja.edit');
    Route::put('/{id}', [ProgramKerjaController::class, 'update'])->name('program-kerja.update');

    // Menambahkan route untuk tombol ajukan
Route::put('/ajukan/{id}', [ProgramKerjaController::class, 'ajukan'])->name('program-kerja.ajukan');

    // Route untuk menghapus program kerja
    Route::delete('/{id}', [ProgramKerjaController::class, 'destroy'])->name('program-kerja.destroy');

});

/*
|--------------------------------------------------------------------------
| Routes Lain (Jika perlu ditutup auth, silakan dipindah)
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Pengajuan Kegiatan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('pengajuan-kegiatan')->group(function () {
    Route::get('/', [PengajuanKegiatanController::class, 'index'])->name('pengajuan.kegiatan.index');
    Route::get('/detail/{id}', [PengajuanKegiatanController::class, 'show'])->name('pengajuan.kegiatan.detail');
    Route::get('/buatProposal', [PengajuanKegiatanController::class, 'create'])->name('pengajuan.kegiatan.buatProposal');
    Route::post('/', [PengajuanKegiatanController::class, 'store'])->name('pengajuan.kegiatan.store');
    Route::get('/edit/{id}', [PengajuanKegiatanController::class, 'edit'])->name('pengajuan.kegiatan.edit');
    Route::put('/{id}', [PengajuanKegiatanController::class, 'update'])->name('pengajuan.kegiatan.update');
    Route::put('/ajukan/{id}', [PengajuanKegiatanController::class, 'ajukan'])->name('pengajuan.kegiatan.ajukan');
    Route::delete('/{id}', [PengajuanKegiatanController::class, 'destroy'])->name('pengajuan.kegiatan.destroy');
});

/*
|--------------------------------------------------------------------------
| Laporan Kegiatan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('laporan-kegiatan')->group(function () {
    Route::get('/', [LaporanKegiatanController::class, 'index'])->name('laporan.index');

    // Create routes (specific paths first)
    Route::get('/buatlaporanKegiatan/{pengajuan}', [LaporanKegiatanController::class, 'create'])->name('laporan.create');
    Route::post('/', [LaporanKegiatanController::class, 'store'])->name('laporan.store');

    // Detail, Edit, Download routes (specific paths first)
    Route::get('/detail/{id}', [LaporanKegiatanController::class, 'show'])->name('laporan.detail');
    Route::get('/edit/{id}', [LaporanKegiatanController::class, 'edit'])->name('laporan.edit');
    Route::get('/download/{id}/{type}', [LaporanKegiatanController::class, 'download'])->name('laporan.download');

    // Update and Delete routes (general patterns last)
    Route::put('/update/{id}', [LaporanKegiatanController::class, 'update'])->name('laporan.update');
    Route::delete('/delete/{id}', [LaporanKegiatanController::class, 'destroy'])->name('laporan.destroy');

    // Ajukan laporan
    Route::post('/ajukan/{id}', [LaporanKegiatanController::class, 'ajukan'])->name('laporan.ajukan');
});

/*
|--------------------------------------------------------------------------
| Dokumentasi & Prestasi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('dokumentasi')->group(function () {
    Route::get('/', [DokumentasiController::class, 'index'])->name('dokumentasi.index');
    Route::get('/buat', [DokumentasiController::class, 'create'])->name('dokumentasi.create');
    Route::post('/', [DokumentasiController::class, 'store'])->name('dokumentasi.store');
    Route::delete('/{id}', [DokumentasiController::class, 'destroy'])->name('dokumentasi.destroy');
});

/*
|--------------------------------------------------------------------------
| Prestasi
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('prestasi')->group(function () {
    Route::get('/', [PrestasiController::class, 'index'])->name('prestasi.index');
    Route::get('/tambah', [PrestasiController::class, 'create'])->name('prestasi.create');
    Route::post('/', [PrestasiController::class, 'store'])->name('prestasi.store');
    Route::delete('/{id}', [PrestasiController::class, 'destroy'])->name('prestasi.destroy');
    Route::get('/download/{id}', [PrestasiController::class, 'download'])->name('prestasi.download');
});

/*
|--------------------------------------------------------------------------
| Kepengurusan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('profile/kepengurusan')->group(function () {
    Route::get('/create', [KepengurusanController::class, 'create'])->name('kepengurusan.create');
    Route::post('/', [KepengurusanController::class, 'store'])->name('kepengurusan.store');
    Route::get('/{kepengurusan}', [KepengurusanController::class, 'show'])->name('kepengurusan.show');
    Route::get('/{kepengurusan}/edit', [KepengurusanController::class, 'edit'])->name('kepengurusan.edit');
    Route::put('/{kepengurusan}', [KepengurusanController::class, 'update'])->name('kepengurusan.update');
    Route::delete('/{kepengurusan}', [KepengurusanController::class, 'destroy'])->name('kepengurusan.destroy');
});

/*
|--------------------------------------------------------------------------
| Jadwal Latihan
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->prefix('profile/jadwal-latihan')->group(function () {
    Route::get('/create', [JadwalLatihanController::class, 'create'])->name('jadwal-latihan.create');
    Route::post('/', [JadwalLatihanController::class, 'store'])->name('jadwal-latihan.store');
    Route::get('/{jadwalLatihan}', [JadwalLatihanController::class, 'show'])->name('jadwal-latihan.show');
    Route::get('/{jadwalLatihan}/edit', [JadwalLatihanController::class, 'edit'])->name('jadwal-latihan.edit');
    Route::put('/{jadwalLatihan}', [JadwalLatihanController::class, 'update'])->name('jadwal-latihan.update');
    Route::delete('/{jadwalLatihan}', [JadwalLatihanController::class, 'destroy'])->name('jadwal-latihan.destroy');
});

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
