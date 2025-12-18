<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use App\Models\ProgramKerja;
use App\Models\PengajuanKegiatan;
use App\Models\LaporanKegiatan;
use App\Models\Dokumentasi;
use App\Policies\ProgramKerjaPolicy;
use App\Policies\PengajuanKegiatanPolicy;
use App\Policies\LaporanKegiatanPolicy;
use App\Policies\DokumentasiPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register Policies
        Gate::policy(ProgramKerja::class, ProgramKerjaPolicy::class);
        Gate::policy(PengajuanKegiatan::class, PengajuanKegiatanPolicy::class);
        Gate::policy(LaporanKegiatan::class, LaporanKegiatanPolicy::class);
        Gate::policy(Dokumentasi::class, DokumentasiPolicy::class);
    }
}
