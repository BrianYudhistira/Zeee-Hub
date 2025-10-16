<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contacts';

    protected $fillable = [
        'portfolio_user_id',
        'email',
        'phone',
        'address',
        'linkedin_url',
        'github_url',
        'website_url',
    ];

    /**
     * Get the portfolio user that owns the contact data.
     */
    public function portfolioUser(): BelongsTo
    {
        return $this->belongsTo(PortfolioUser::class);
    }

    /**
     * Get all social media links as an array.
     */
    public function getSocialLinksAttribute(): array
    {
        return array_filter([
            'linkedin' => $this->linkedin_url,
            'github' => $this->github_url,
            'website' => $this->website_url,
        ]);
    }
}