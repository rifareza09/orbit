# Copilot Instructions for Orbit

## Architecture Overview

**Orbit** is a Laravel 12 + React 19 + Inertia.js full-stack application for managing organizational activities and proposals.

### Tech Stack
- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, TypeScript, Inertia.js for server-driven UI
- **Styling**: Tailwind CSS 4 with custom color scheme (#0B132B primary)
- **Build**: Vite with SSR support
- **Testing**: Pest (PHP), no frontend tests configured yet
- **Database**: Migrations use enums and foreign keys with cascade deletes
- **UI Components**: Radix UI headless components wrapped in custom `ui/` directory

### Role-Based Access Structure
The app distinguishes two user types enforced in middleware:
- **Puskaka** (admin): Dashboard at `/dashboard/puskaka`, manages activities via Manajemen Kegiatan
- **UKM/BEM/Kongres** (normal): Dashboard at `/dashboard`, submit proposals and reports

All protected routes require `auth` and `verified` middleware (see `routes/web.php:27`).

## Critical Data Flows

### Activity Submission Flow
1. **ProgramKerja** (work program) - User creates outline
2. **PengajuanKegiatan** (activity proposal) - Detailed proposal with budget, links to ProgramKerja
3. **ItemPengajuanDana** (budget items) - Line items in proposal
4. **LaporanKegiatan** (activity report) - Final report with realization data, status workflow
5. **Dokumentasi** (documentation) - Photo evidence, stored in `storage/` via Spatie

Models with relationships:
- User → hasMany LaporanKegiatan, ProgramKerja, etc. (user_id foreign key)
- ProgramKerja → hasMany PengajuanKegiatan
- PengajuanKegiatan → hasMany ItemPengajuanDana, LaporanKegiatan

## Frontend Patterns

### Inertia.js Pages & Layouts
- Pages in `resources/js/pages/` auto-resolve via `import.meta.glob`
- **DashboardLayout** (`resources/js/layouts/DashboardLayout.tsx`): Main layout with collapsible sidebar, role-based menu
- Use `usePage()` to access server props and auth data: `const { dokumentasi } = usePage().props`
- Navigate with `router.visit()` or `Link` from `@inertiajs/react`

### Component Organization
- Reusable UI components in `resources/js/components/ui/` (Radix UI wrappers)
- Page-specific components in same folder as pages
- Shared components: `app-header.tsx`, `app-sidebar.tsx`, `nav-main.tsx`, `UserProfile.tsx`

### Tailwind & Colors
- Primary color: `#0B132B` (dark blue)
- Hover state: `hover:bg-[#1C2541]`
- Use `cn()` utility from `lib/utils.ts` for className merging

## Backend Patterns

### Controllers & Form Requests
- Controllers extend `Controller` base, use `Inertia::render()` to return React pages with props
- Form validation via `StoreLaporanRequest`, `UpdateLaporanRequest` in `app/Http/Requests/`
- Example: `DokumentasiController::store()` handles file upload to `storage/dokumentasi/` then creates DB record with `foto_path`

### Database & Migrations
- Migrations use Laravel's modern syntax with Blueprint
- Status fields use enum casting: `'status' => 'in:Belum Diajukan,Diajukan,Direview,Disetujui,Direvisi,Ditolak'`
- File columns store relative paths (e.g., `foto_path` for dokumentasi)

### Authentication
- Uses Laravel Fortify with 2FA support
- User model casts: `password => hashed`, `email_verified_at => datetime`
- Access `Auth::user()` and `Auth::id()` in controllers

## Development Workflows

### Setup
```bash
composer setup  # Installs, copies .env, generates key, migrates, installs npm, builds frontend
```

### Development
```bash
composer dev    # Runs: php artisan serve + queue:listen + npm run dev (concurrently)
npm run dev     # Vite dev server only
npm run build   # Production build
npm run lint    # Fix ESLint issues
npm run format  # Prettier format
npm run types   # Check TypeScript
```

### Testing
```bash
composer test   # Runs: config:clear + artisan test (Pest)
```

### Database
Migrations use `Database\Migrations\` namespace. Fresh migrations: `php artisan migrate:fresh`

## Key Files Reference

| Path | Purpose |
|------|---------|
| `app/Models/` | 7 core models: User, ProgramKerja, PengajuanKegiatan, LaporanKegiatan, Dokumentasi, Prestasi, ItemPengajuanDana |
| `app/Http/Controllers/` | Controllers per main feature (Dokumentasi, ProgramKerja, etc.) |
| `routes/web.php` | All route definitions with role checks (`Auth::user()->role === 'puskaka'`) |
| `resources/js/pages/` | Inertia pages auto-resolved from folder structure |
| `resources/js/layouts/DashboardLayout.tsx` | Main authenticated layout with role-based sidebar |
| `resources/js/components/ui/` | Radix UI component wrappers (button, dialog, select, etc.) |
| `resources/css/app.css` | Tailwind entry point |
| `vite.config.ts` | Build config with Laravel + React + Tailwind plugins |
| `phpunit.xml` | Pest test config |

## Common Patterns

### Adding a New Feature
1. Create migration in `database/migrations/` (timestamp prefix auto-added)
2. Create model in `app/Models/` with relationships
3. Create controller in `app/Http/Controllers/`
4. Add routes to `routes/web.php` (wrap in auth middleware if needed)
5. Create React page in `resources/js/pages/{feature}/index.tsx`
6. Use `Inertia::render('feature/index', ['data' => $data])` to pass props

### File Uploads
- Store files via Laravel's Storage: `$request->file('foto')->store('dokumentasi', 'public')`
- Access in frontend: `asset('storage/' . $item->foto_path)`
- Validate: `'foto' => 'required|image|mimes:png,jpg,jpeg|max:5120'` (5MB)

### Status Workflows
Many models use status enums (ProgramKerja, LaporanKegiatan, PengajuanKegiatan):
- Diajukan → Direview → Disetujui (or Ditolak/Direvisi)
- Enforce in validation rules and controller logic

### Appearance/Theme
- Custom hook `useAppearance` in `resources/js/hooks/` manages dark/light mode
- Middleware `HandleAppearance` (see `HandleAppearance.php`) processes theme in backend if needed

## Important Constraints

- **Auth requirement**: All feature routes must be wrapped in `['auth', 'verified']` middleware
- **Role-based access**: Check `Auth::user()->role` explicitly in controllers; no automatic policy enforcement visible
- **No API routes heavily used**: `api.php` exists but main workflows are Inertia SSR
- **SSR support**: Config at `vite.config.ts` includes `ssr: 'resources/js/ssr.tsx'` and `dev:ssr` composer script available
