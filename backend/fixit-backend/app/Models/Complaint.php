<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

 
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'status',
        'image',
        'lat',
        'lng',
        'admin_note',
    ];

   
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
