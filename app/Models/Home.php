<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Home extends Model
{
    use HasFactory;

    protected $table = 'home';

    protected $fillable = [
        'portfolio_user_id',
        'greeting',
        'description',
        'logo_path',
        'social_media_links',
    ];

    protected $casts = [
        'social_media_links' => 'array',
    ];

    /**
     * Get the portfolio user that owns the home data.
     */
    public function portfolioUser(): BelongsTo
    {
        return $this->belongsTo(PortfolioUser::class);
    }

    /**
     * Get the logo URL attribute.
     */
    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? asset('storage/' . $this->logo_path) : null;
    }
}