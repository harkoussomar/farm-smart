<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // If user is a farmer and trying to access farmer routes, redirect to farmer dashboard
                if (Auth::user()->type === 'farmer' && $request->is('farmer*')) {
                    return redirect(RouteServiceProvider::FARMER_HOME);
                }

                // For other users (or farmers not trying to access farmer routes)
                return redirect(RouteServiceProvider::HOME);
            }
        }

        return $next($request);
    }
}