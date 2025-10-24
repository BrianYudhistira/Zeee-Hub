<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    protected $fillable = [
        'user_id',
        'last_login_at',
        'ip_address',
        'location',
        'user_agent',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}