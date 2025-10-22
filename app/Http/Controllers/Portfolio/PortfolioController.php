<?php

namespace App\Http\Controllers\Portfolio;

use App\Models\User;
use App\Models\PortfolioUser;
use Inertia\Inertia;

class PortfolioController{
    public function index()
    {
        $user = User::findOrFail(1);
        return Inertia::render('Portfolio/Portfolio',[
            'portfolio' => $user->portfolioUser()->with(['home', 'about', 'projects', 'contacts'])->first()
        ]);
    }

    public function getPortfolioBySlug($slug)
    {
        $portfolio = PortfolioUser::with(['user', 'home', 'about', 'projects', 'contacts'])
                    ->where(['slug' => $slug, 'is_active' => true])
                    ->first();

        if (! $portfolio) {
            abort(404, 'Portfolio not found');
        }

        return Inertia::render('Portfolio/Portfolio', [
            'portfolio' => $portfolio,
        ]);
    }
}