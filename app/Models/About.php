<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class About extends Model
{
    use HasFactory;

    protected $table = 'about';

    protected $fillable = [
        'portfolio_user_id',
        'title',
        'description',
        'image_path',
        'skills',
        'cv_path',
    ];

    protected $casts = [
        'skills' => 'array',
    ];

    // Append computed URL attributes to model JSON automatically
    protected $appends = ['image_url', 'cv_url'];

    /**
     * Get the portfolio user that owns the about data.
     */
    public function portfolioUser(): BelongsTo
    {
        return $this->belongsTo(PortfolioUser::class);
    }

    /**
     * Get the image URL attribute.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (empty($this->image_path)) {
            return null;
        }

        return asset('storage/' . ltrim($this->image_path, '/'));
    }

    /**
     * Get the CV URL attribute.
     */
    public function getCvUrlAttribute(): ?string
    {
        if (empty($this->cv_path)) {
            return null;
        }

        return asset('storage/' . ltrim($this->cv_path, '/'));
    }
}