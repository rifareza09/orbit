<?php

namespace App\Actions\Fortify;

use Illuminate\Contracts\Auth\StatefulGuard;
use Laravel\Fortify\LoginRateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Fortify;
use Illuminate\Validation\ValidationException;

class AttemptToAuthenticate
{
    protected $guard;
    protected $limiter;

    public function __construct(StatefulGuard $guard, LoginRateLimiter $limiter)
    {
        $this->guard = $guard;
        $this->limiter = $limiter;
    }

    public function __invoke(Request $request)
    {
        // Cek rate limit: 5 percobaan per menit
        if ($this->limiter->tooManyAttempts($request)) {
            $seconds = $this->limiter->availableIn($request);

            throw ValidationException::withMessages([
                'username' => "Terlalu banyak percobaan login. Silakan coba lagi dalam {$seconds} detik.",
            ]);
        }

        // Autentikasi dengan username
        if (! Auth::attempt([
            'username' => $request->username,
            'password' => $request->password,
        ], $request->boolean('remember'))) {

            $this->limiter->increment($request);

            throw ValidationException::withMessages([
                Fortify::username() => 'Username atau password salah.',
            ]);
        }

        // Reset limit saat berhasil login
        $this->limiter->clear($request);

        return Auth::user();
    }
}
