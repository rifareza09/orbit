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
        // Cek rate limit
        if ($this->limiter->tooManyAttempts($request)) {
            $this->limiter->increment($request);

            throw ValidationException::withMessages([
                'username' => __('Too many login attempts.'),
            ]);
        }

        // Autentikasi dengan username
        if (! Auth::attempt([
            'username' => $request->username,
            'password' => $request->password,
        ], $request->boolean('remember'))) {

            $this->limiter->increment($request);

            throw ValidationException::withMessages([
                Fortify::username() => __('auth.failed'),
            ]);
        }

        // Reset limit saat berhasil login
        $this->limiter->clear($request);
    }
}
