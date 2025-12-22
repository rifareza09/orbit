<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent clickjacking attacks
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Protection
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Content Security Policy - More permissive in development for Vite HMR
        $isDev = app()->environment('local', 'development');

        $csp = "default-src 'self'; ";

        if ($isDev) {
            // Allow Vite dev server and HMR in development
            $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:5173 ws://localhost:5173 https://fonts.bunny.net; ";
            $csp .= "style-src 'self' 'unsafe-inline' http://localhost:5173 https://fonts.bunny.net; ";
            $csp .= "connect-src 'self' http://localhost:5173 ws://localhost:5173; ";
        } else {
            // Stricter CSP for production
            $csp .= "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.bunny.net; ";
            $csp .= "style-src 'self' 'unsafe-inline' https://fonts.bunny.net; ";
            $csp .= "connect-src 'self'; ";
        }

        $csp .= "img-src 'self' data: blob:; ";
        $csp .= "font-src 'self' https://fonts.bunny.net data:; ";
        $csp .= "frame-ancestors 'self';";

        $response->headers->set('Content-Security-Policy', $csp);

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        // HSTS (only in production with HTTPS)
        if (app()->environment('production') && $request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        return $response;
    }
}
