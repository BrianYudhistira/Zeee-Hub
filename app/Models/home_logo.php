<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class home_logo extends Model
{
    protected $table = 'settings'; // Override table name

    protected $fillable = [
        'name',
        'path',
        'value',
    ];

    protected $casts = [
        'value' => 'array', // Auto decode JSON
    ];

    protected $appends = [
        'file_url',
    ];

    // For file-based settings (logo, favicon, etc.)
    public function getFileUrlAttribute(): ?string
    {
        return $this->path ? asset('storage/' . $this->path) : null;
    }
}