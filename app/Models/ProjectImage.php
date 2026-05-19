<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'image_path',
        'project_id',
        'title',
        'description',
    ];

    protected $appends = [
        'image_url',
    ];

    protected $casts = [
        'image_path' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getImageUrlAttribute(): array|string|null
    {
        if (empty($this->image_path)) {
            return null;
        }

        if (is_array($this->image_path)) {
            return array_map(function($path) {
                return asset('storage/' . ltrim($path, '/'));
            }, $this->image_path);
        }

        return asset('storage/' . ltrim($this->image_path, '/'));
    }
}
