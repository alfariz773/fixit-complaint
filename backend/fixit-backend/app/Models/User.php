<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Notifications\ResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

   
    public function sendPasswordResetNotification($token)
    {
        $url = 'http://localhost:3000/auth/reset-password?token=' . $token . '&email=' . $this->email;

        $notification = new ResetPassword($token);

       
        $notification->createUrlUsing(function ($user, $token) use ($url) {
            return $url;
        });

        $this->notify($notification);
    }

  
    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

  
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',   
        'status', 
    ];

    
    protected $hidden = [
        'password',
        'remember_token',
    ];

    
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}