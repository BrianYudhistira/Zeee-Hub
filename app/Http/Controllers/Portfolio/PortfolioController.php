<?php

namespace App\Http\Controllers\Portfolio;

use App\Models\User;
use App\Models\PortfolioUser;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class PortfolioController{
    public function index()
    {
        $user = User::findOrFail(1);
        return Inertia::render('Portfolio/Portfolio',[
            'portfolio' => $user->portfolioUser()->with(['home', 'about', 'projects.techStacks', 'contacts', 'experiences', 'userSkills.techStack'])->first()
        ]);
    }

    public function getProjectById($id)
    {
        $project = \App\Models\Project::with(['techStacks', 'images'])->find($id);

        if (! $project) {
            abort(404, 'Project not found');
        }

        return Inertia::render('Projects/Projects', [
            'project' => $project,
        ]);
    }

    public function getPortfolioBySlug($slug)
    {
        // Debug: Log the slug being searched
        Log::info('Searching for portfolio with slug: ' . $slug);
        
        $portfolio = PortfolioUser::with(['user', 'home', 'about', 'projects.techStacks', 'contacts', 'experiences', 'userSkills.techStack'])
                    ->where('slug', $slug)
                    ->where('is_active', true)
                    ->first();

        // Debug: Log what was found
        Log::info('Portfolio found:', ['id' => $portfolio?->id, 'slug' => $portfolio?->slug]);

        if (! $portfolio) {
            abort(404, 'Portfolio not found');
        }

        return Inertia::render('Portfolio/Portfolio', [
            'portfolio' => $portfolio,
        ]);
    }
}