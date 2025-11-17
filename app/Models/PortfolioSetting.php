<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PortfolioSetting extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'name',
        'path',
        'value',
    ];

    protected $casts = [
        'value' => 'array', 
    ];

    protected $appends = [
        'file_url',
    ];

    /**
     * Get full URL for file-based settings (logo, favicon, etc.)
     * Returns null if no file path is set
     */
    public function getFileUrlAttribute(): ?string
    {
        return $this->path ? asset('storage/' . $this->path) : null;
    }
}