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

    public function getFileUrlAttribute(): ?string
    {
        return $this->path ? asset($this->path) : null;
    }
}