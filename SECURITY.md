# Security Implementation - ORBIT

## ✅ Implemented Security Features

### 1. **Authentication & Authorization**

#### Middleware
- **`EnsurePuskaka`**: Centralized role checking for Puskaka-only routes
  - Location: `app/Http/Middleware/EnsurePuskaka.php`
  - Usage: Applied to all admin routes via `->middleware(['puskaka'])`

#### Policies
- **ProgramKerjaPolicy**: Authorization for Program Kerja resources
- **PengajuanKegiatanPolicy**: Authorization for Pengajuan Kegiatan
- **LaporanKegiatanPolicy**: Authorization for Laporan Kegiatan  
- **DokumentasiPolicy**: Authorization for Dokumentasi

All policies check:
- ✅ Owner access (user can only access their own data)
- ✅ Puskaka access (admin can access all data)
- ✅ Status-based permissions (can't edit approved items)

### 2. **Rate Limiting**

Configured in `app/Providers/FortifyServiceProvider.php`:

```php
'login' => 5 attempts per minute (per username + IP)
'two-factor' => 5 attempts per minute (per session)
'register' => 3 attempts per minute (per IP)
'password-reset' => 3 attempts per minute (per IP)
'api' => 60 attempts per minute (per user/IP)
```

Applied to sensitive routes in `routes/web.php`:
- Profile password change: 10/minute
- Reset akun: 5/minute
- Toggle status: 10/minute
- Delete arsip: 10/minute

Protects against brute force attacks and abuse.

### 3. **Session Security**

Enhanced configuration in `config/session.php`:

- ✅ `SESSION_ENCRYPT=true` - All session data encrypted
- ✅ `SESSION_SECURE_COOKIE=true` - HTTPS only (production)
- ✅ `SESSION_HTTP_ONLY=true` - JavaScript cannot access cookies
- ✅ `SESSION_SAME_SITE=strict` - Prevents CSRF attacks

### 4. **Security Headers**

Middleware: `app/Http/Middleware/SecurityHeaders.php`

Automatically adds headers to all responses:

- **X-Frame-Options**: `SAMEORIGIN` - Prevents clickjacking
- **X-Content-Type-Options**: `nosniff` - Prevents MIME sniffing
- **X-XSS-Protection**: `1; mode=block` - XSS protection
- **Content-Security-Policy**: Restricts resource loading
- **Referrer-Policy**: `strict-origin-when-cross-origin`
- **Permissions-Policy**: Disables geolocation, microphone, camera
- **Strict-Transport-Security**: HSTS (production + HTTPS only)

### 5. **Password Security**

#### Enhanced Generation Algorithm
Location: `app/Http/Controllers/DataOrmawaController.php`

```php
// 16-character password with mix of:
// - 4 lowercase letters
// - 4 uppercase letters  
// - 4 numbers
// - 4 special characters
// Then shuffled for randomness
```

#### Storage
- ✅ Bcrypt hashing (Laravel default)
- ✅ `BCRYPT_ROUNDS=12` (strong cost factor)

### 6. **Input Validation**

- ✅ Form Request classes for all user inputs
- ✅ File upload validation (MIME types, max size)
- ✅ SQL injection protection (100% Eloquent ORM, no raw queries)
- ✅ CSRF protection (automatic Laravel tokens)

### 7. **File Upload Security**

- ✅ Validated MIME types: `mimes:png,jpg,jpeg,pdf`
- ✅ Max file size: 5MB-20MB depending on type
- ✅ Storage in non-executable directory: `storage/app/public`
- ✅ No direct file execution possible

## 🔧 Configuration

### Environment Variables (.env)

```env
# Session Security
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict

# Password Hashing
BCRYPT_ROUNDS=12

# For Production
APP_DEBUG=false
APP_ENV=production
```

### Middleware Registration

In `bootstrap/app.php`:

```php
// Global middleware
$middleware->web(append: [
    SecurityHeaders::class,
]);

// Named middleware
$middleware->alias([
    'puskaka' => EnsurePuskaka::class,
]);
```

## 🛡️ Security Checklist

### Before Deployment

- [ ] Set `APP_DEBUG=false` in production
- [ ] Set `APP_ENV=production`
- [ ] Generate new `APP_KEY`: `php artisan key:generate`
- [ ] Ensure HTTPS is enabled
- [ ] Set `SESSION_SECURE_COOKIE=true`
- [ ] Configure proper `SESSION_DOMAIN`
- [ ] Set strong database credentials
- [ ] Enable firewall rules
- [ ] Disable directory listing
- [ ] Set proper file permissions (755 directories, 644 files)
- [ ] Configure backup system

### Regular Maintenance

- [ ] Keep Laravel and dependencies updated
- [ ] Monitor logs for suspicious activity
- [ ] Review user permissions regularly
- [ ] Test authentication flows
- [ ] Audit file uploads
- [ ] Check for failed login attempts

## 🚨 Security Incident Response

If you suspect a security breach:

1. **Isolate**: Take affected systems offline
2. **Document**: Log all suspicious activity
3. **Notify**: Inform system administrator
4. **Rotate**: Change all credentials (database, API keys, etc.)
5. **Audit**: Review all access logs
6. **Patch**: Fix vulnerability and deploy update
7. **Monitor**: Watch for similar patterns

## 📚 Additional Resources

- [Laravel Security Documentation](https://laravel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)

## 🔐 Security Contacts

For security issues, contact:
- Developer: [Your Team]
- Puskaka Admin: [Admin Contact]

---

**Last Updated**: December 18, 2025  
**Version**: 1.0
