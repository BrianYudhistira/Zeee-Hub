<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BalanceTrack extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'balance_track';

    protected $fillable = [
        'user_id',
        'description',
        'amount',
        'type',
        'deleted',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'deleted' => 'boolean',
    ];

    /**
     * Get the user that owns the balance track.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
