<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PortfolioController
{
    public function getPortfolioByUserId(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Ensure portfolioUser relation exists and load all expected relations
        $portfolioRelation = $user->portfolioUser();
        if (! $portfolioRelation) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }

        $portfolio = $portfolioRelation->with(['home', 'about', 'projects', 'contacts'])->first();

        if (! $portfolio) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }

        return response()->json($portfolio, 200);
    }

    public function editHome(Request $request)
    {
        $content = $request->validate([
            'greeting' => 'nullable|string|max:255',
            'name' => 'nullable|string|max:255',
            'passions' => 'nullable|array',
            'passions.*' => 'string|max:100',
            'description' => 'nullable|string',
            'logo'=>'nullable|image|max:2048',
        ]);
        // dd($request->all());


        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $portfolio = $user->portfolioUser()->first();
        if (!$portfolio) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }

        $logoPath = null;

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            if ($portfolio->home->logo_path){
                Storage::disk('public')->delete($portfolio->home->logo_path);
            }
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $logoPath = $file->storeAs("logos/{$user->id}", $filename, 'public');
        }

        $portfolio->home->update([
            'greeting' => $content['greeting'] ?? $portfolio->home->greeting,
            'name' => $content['name'] ?? $portfolio->home->name,
            'passions' => $content['passions'] ?? $portfolio->home->passions,
            'description' => $content['description'] ?? $portfolio->home->description,
            'logo_path' => $logoPath ?? $portfolio->home->logo_path,
        ]);

        return response()->json(['message' => 'Home section updated successfully', 'data' => $portfolio->home->fresh()], 200);
    }

    public function editAbout(Request $request)
    {
        $content = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'skills' => 'required|array',
            'skills.*' => 'string',
            'image'=>'nullable|image|max:2048',
            'cv'=>'nullable|mimes:pdf,doc,docx|max:2048',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $portfolio = $user->portfolioUser()->first();
        if (!$portfolio) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }
        elseif($portfolio->about){
            $imagePath = $portfolio->about->image_path;
            $cvPath = $portfolio->about->cv_path;

            if ($request->hasFile('image')) {
                if ($portfolio->about->image_path) {
                    Storage::disk('public')->delete($portfolio->about->image_path);
                }
                $file = $request->file('image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $imagePath = $file->storeAs('about_images', $filename, 'public');
            }

            if ($request->hasFile('cv')) {
                if ($portfolio->about->cv_path) {
                    Storage::disk('public')->delete($portfolio->about->cv_path);
                }
                $file = $request->file('cv');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $cvPath = $file->storeAs("cvs/{$user->id}", $filename, 'public');
            }

            $portfolio->about->update([
                'title' => $content['title'],
                'description' => $content['description'],
                'skills' => $content['skills'],
                'image_path' => $imagePath,
                'cv_path' => $cvPath,
            ]);

            return response()->json(['message' => 'About section updated successfully'], 200);
        }
        else{
            $imagePath = null;
            $cvPath = null;

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $imagePath = $file->storeAs('about_images', $filename, 'public');
            }

            if ($request->hasFile('cv')) {
                $file = $request->file('cv');
                $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
                $cvPath = $file->storeAs('cvs', $filename, 'public');
            }

            $portfolio->about->create([
                'title' => $content['title'],
                'description' => $content['description'],
                'skills' => $content['skills'],
                'image_path' => $imagePath,
                'cv_path' => $cvPath,
            ]);

            return response()->json(['message' => 'About section created successfully'], 200);
        }

        return response()->json(['message' => 'About section updated successfully'], 200);
    }

    public function editProjects(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'image'=>'required|image|max:2048',
            'demo_link' => 'nullable|url',
            'repo_link' => 'nullable|url',
            'techstacks' => 'required|array',
            'techstacks.*' => 'string',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $portfolio = $user->portfolioUser()->first();
        if (!$portfolio) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }

        $imagePath = $portfolio->projects->image_path;

        if ($request->hasFile('image')) {
            if ($portfolio->projects->image_path) {
                Storage::disk('public')->delete($portfolio->projects->image_path);
            }
            $file = $request->file('image');
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $imagePath = $file->storeAs("project_images/{$user->id}", $filename, 'public');
        }

        $portfolio->projects()->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'image_path' => $imagePath,
            'demo_link' => $request->input('demo_link'),
            'repo_link' => $request->input('repo_link'),
            'techstacks' => json_encode($request->input('techstacks')),
        ]);
    }

    public function editContacts(Request $request)
    {
        $content = $request->validate([
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'linkedin' => 'nullable|url',
            'github' => 'nullable|url',
            'twitter' => 'nullable|url',
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $portfolio = $user->portfolioUser()->first();
        if (!$portfolio) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }

        $portfolio->contacts()->update([
            'email' => $content['email'],
            'phone' => $content['phone'],
            'address' => $content['address'],
            'linkedin' => $content['linkedin'],
            'github' => $content['github'],
            'twitter' => $content['twitter'],
        ]);

        return response()->json(['message' => 'Contacts section updated successfully'], 200);
    }

    public function addPortfolio(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if portfolio already exists
        if ($user->portfolioUser()->exists()) {
            return response()->json(['message' => 'Portfolio already exists'], 400);
        }

        // Create new portfolio with default sections
        $portfolio = $user->portfolioUser()->create();

        $portfolio->home()->create([
            'greeting' => 'Hello, I am',
            'name' => 'Your Name',
            'passion' => 'Your Passion',
            'description' => 'A brief description about yourself.',
            'logo_path' => null,
        ]);

        $portfolio->about()->create([
            'title' => 'About Me',
            'description' => 'A detailed description about yourself.',
            'skills' => json_encode([]),
            'image_path' => null,
            'cv_path' => null,
        ]);

        $portfolio->contacts()->create([
            'email' => '',
            'phone' => '',
            'address' => '',
            'linkedin' => '',
            'github' => '',
            'twitter' => '',
        ]);

        return response()->json(['message' => 'Portfolio created successfully'], 201);
    }
}