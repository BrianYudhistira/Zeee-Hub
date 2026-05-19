<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSkills extends Model
{
    protected $table = 'user_skills';

    protected $fillable = [
        'portfolio_user_id',
        'tech_stack_id',
        'proficiency_level',
    ];

    public function portfolioUser()
    {
        return $this->belongsTo(PortfolioUser::class);
    }

    public function techStack()
    {
        return $this->belongsTo(TechStack::class);
    }
}