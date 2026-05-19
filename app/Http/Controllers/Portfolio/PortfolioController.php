<?php

namespace App\Http\Controllers\Portfolio;

use App\Models\User;
use App\Models\PortfolioUser;
use App\Models\Project;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMailToMe;

class PortfolioController
{
    public function index()
    {
        $user = User::findOrFail(1);
        return Inertia::render('Portfolio/Portfolio', [
            'portfolio' => $user->portfolioUser()->with(['home', 'about', 'projects.techStacks', 'contacts', 'experiences', 'userSkills.techStack'])->first()
        ]);
    }

    public function getProjectById($slug)
    {
        $project = Project::with(['techStacks', 'images'])->where('slug', $slug)->first();

        if (! $project) {
            abort(404, 'Project not found');
        }

        return Inertia::render('Projects/Projects', [
            'project' => $project,
        ]);
    }

    public function getPortfolioBySlug($slug)
    {
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

    public function sendMessage(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        try {
            Mail::to(env('MAIL_TO_ADDRESS'))->send(
                new SendMailToMe($request->name, $request->email, $request->message)
            );

            return redirect()->back()->with('success', 'Message sent successfully!');
        } catch (\Exception $e) {
            Log::error('Failed to send message: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Failed to send message. Please try again later.');
        }
    }
}
