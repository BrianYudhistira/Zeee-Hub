<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_user_id',
        'title',
        'description',
        'image_path',
        'demo_url',
        'source_url',
        'tech_stack',
        'sort_order',
        'is_featured',
    ];

    protected $casts = [
        'tech_stack' => 'array',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'image_url',
    ];

    /**
     * Get the portfolio user that owns the project.
     */
    public function portfolioUser(): BelongsTo
    {
        return $this->belongsTo(PortfolioUser::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        return asset('storage/' . ltrim($this->image_path, '/'));
    }
}