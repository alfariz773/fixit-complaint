<?php
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.frontend_url')
                . "/reset-password?token={$token}&email={$user->email}";
        });
    }
}
