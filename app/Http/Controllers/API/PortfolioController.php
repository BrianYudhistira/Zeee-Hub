<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

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

    public function editportfolio(Request $request)
    {
        if ($request->hasFile('about_image') || $request->hasFile('about_cv')) {
            Log::info('Handling form-data request');
            return $this->handleFormData($request);
        } else {
            Log::info('Handling JSON request');
            return $this->handleJsonData($request);
        }
    }

    public function handleFormData(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'about_image' => 'nullable|image|max:2048', // 2MB
            'about_cv' => 'nullable|mimes:pdf,doc,docx|max:5120', // 5MB
        ]);

        $portfolio_data = [
            'slug' => $request->input('slug'),
            'theme' => $request->input('theme'),
            'is_active' => $request->input('is_active') === '1',
            'sections' => json_decode($request->input('sections'), true),
            'home' => json_decode($request->input('home'), true),
            'about' => json_decode($request->input('about'), true),
            'projects' => json_decode($request->input('projects'), true),
            'contacts' => json_decode($request->input('contacts'), true),
        ];

        if ($request->hasFile('about_image')) {
            $imagePath = $request->file('about_image')->storeAs('portfolios/images', Str::uuid() . '.' . $request->file('about_image')->getClientOriginalExtension(), 'public');
            $portfolio_data['about']['image_path'] = $imagePath;
        }

        if ($request->hasFile('about_cv')) {
            $cvPath = $request->file('about_cv')->storeAs('portfolios/cvs', Str::uuid() . '.' . $request->file('about_cv')->getClientOriginalExtension(), 'public');
            $portfolio_data['about']['cv_path'] = $cvPath;
        }

        $validator = Validator::make($portfolio_data, [
            'slug' => 'nullable|string|max:255|unique:portfolio_users,slug,' . ($user->portfolioUser ? $user->portfolioUser->id : 'NULL'),
            'theme' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
            'sections' => 'nullable|array',
            'sections.*' => 'string|in:home,about,projects,contact',
            'home.greeting' => 'nullable|string|max:255',
            'home.name' => 'nullable|string|max:255',
            'home.passions' => 'nullable|array',
            'home.passions.*' => 'string|max:100',
            'home.description' => 'nullable|string',
            'home.logo_path' => 'nullable|string|max:500',
            'home.social_media_links' => 'nullable|array',
            'home.social_media_links.github' => 'nullable|url|max:500',
            'home.social_media_links.twitter' => 'nullable|url|max:500',
            'home.social_media_links.linkedin' => 'nullable|url|max:500',
            'home.social_media_links.instagram' => 'nullable|url|max:500',
            'about.title' => 'nullable|string|max:255',
            'about.description' => 'nullable|string',
            'about.image_path' => 'nullable|string|max:500',
            'about.skills' => 'nullable|array',
            'about.skills.*' => 'string|max:100',
            'about.cv_path' => 'nullable|string|max:500',
            'projects' => 'nullable|array',
            'projects.*.id' => 'nullable|integer',
            'projects.*.title' => 'required_with:projects.*|string|max:255',
            'projects.*.description' => 'nullable|string',
            'projects.*.tech_stack' => 'nullable|array',
            'projects.*.tech_stack.*' => 'string|max:100',
            'projects.*.image_path' => 'nullable|string|max:500',
            'projects.*.demo_url' => 'nullable|url|max:500',
            'projects.*.source_url' => 'nullable|url|max:500',
            'projects.*.is_featured' => 'nullable|boolean',
            'projects.*.sort_order' => 'nullable|integer|min:1',
            'contacts.email' => 'nullable|email|max:255',
            'contacts.phone' => 'nullable|string|max:20',
            'contacts.address' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $portfolio = $user->portfolioUser()->first();

        try {
            DB::beginTransaction();

            if (! $portfolio) {
                // Create new portfolio
                $portfolio = $user->portfolioUser()->create([
                    'sections' => $portfolio_data['sections'] ?? ['home', 'about', 'projects', 'contact'],
                    'theme' => $portfolio_data['theme'] ?? 'default',
                    'slug' => $portfolio_data['slug'] ?? Str::slug($user->name) . '-' . Str::random(5),
                    'is_active' => $portfolio_data['is_active'] ?? true,
                ]);

                // Create home section
                $portfolio->home()->create([
                    'greeting' => $portfolio_data['home']['greeting'] ?? 'Hello, I am',
                    'name' => $portfolio_data['home']['name'] ?? $user->name,
                    'passions' => $portfolio_data['home']['passions'] ?? [],
                    'description' => $portfolio_data['home']['description'] ?? null,
                    'logo_path' => $portfolio_data['home']['logo_path'] ?? null,
                    'social_media_links' => $portfolio_data['home']['social_media_links'] ?? [],
                ]);

                // Create about section
                $portfolio->about()->create([
                    'description' => $portfolio_data['about']['description'] ?? null,
                    'image_path' => $portfolio_data['about']['image_path'] ?? null,
                    'skills' => $portfolio_data['about']['skills'] ?? [],
                    'cv_path' => $portfolio_data['about']['cv_path'] ?? null,
                ]);

                // Create contacts section
                $portfolio->contacts()->create([
                    'email' => $portfolio_data['contacts']['email'] ?? $user->email,
                    'phone' => $portfolio_data['contacts']['phone'] ?? null,
                    'address' => $portfolio_data['contacts']['address'] ?? null,
                    
                ]);

                // Create projects if provided
                if (isset($portfolio_data['projects']) && is_array($portfolio_data['projects'])) {
                    foreach ($portfolio_data['projects'] as $projectData) {
                        if (!empty($projectData['title'])) {
                            $portfolio->projects()->create([
                                'title' => $projectData['title'],
                                'description' => $projectData['description'] ?? null,
                                'tech_stack' => $projectData['tech_stack'] ?? [],
                                'image_path' => $projectData['image_path'] ?? null,
                                'demo_url' => $projectData['demo_url'] ?? null,
                                'source_url' => $projectData['source_url'] ?? null,
                                'is_featured' => $projectData['is_featured'] ?? false,
                                'sort_order' => $projectData['sort_order'] ?? 999,
                            ]);
                        }
                    }
                }

                DB::commit();

                $portfolio->load(['home', 'about', 'projects', 'contacts']);

                return response()->json([
                    'message' => 'Portfolio created successfully',
                    'data' => $portfolio
                ], 201);
            }

            $portfolio->update([
                'sections' => $portfolio_data['sections'] ?? $portfolio->sections,
                'theme' => $portfolio_data['theme'] ?? $portfolio->theme,
                'slug' => $portfolio_data['slug'] ?? $portfolio->slug,
                'is_active' => $portfolio_data['is_active'] ?? $portfolio->is_active,
            ]);

            if (isset($portfolio_data['home']) && $portfolio->home) {
                $portfolio->home->update($portfolio_data['home']);
            }

            if (isset($portfolio_data['about']) && $portfolio->about) {
                $portfolio->about->update($portfolio_data['about']);
            }

            if (isset($portfolio_data['projects'])) {
                $projectIds = [];
                
                foreach ($portfolio_data['projects'] as $projectData) {
                    if (isset($projectData['id']) && $projectData['id']) {
                        $project = $portfolio->projects()->find($projectData['id']);
                        if ($project) {
                            $project->update([
                                'title' => $projectData['title'] ?? null,
                                'description' => $projectData['description'] ?? null,
                                'tech_stack' => $projectData['tech_stack'] ?? [],
                                'image_path' => $projectData['image_path'] ?? null,
                                'demo_url' => $projectData['demo_url'] ?? null,
                                'source_url' => $projectData['source_url'] ?? null,
                                'is_featured' => $projectData['is_featured'] ?? false,
                                'sort_order' => $projectData['sort_order'] ?? 999,
                            ]);
                            $projectIds[] = $project->id;
                        }
                    } else {
                        if (!empty($projectData['title'])) {
                            $newProject = $portfolio->projects()->create([
                                'title' => $projectData['title'],
                                'description' => $projectData['description'] ?? null,
                                'tech_stack' => $projectData['tech_stack'] ?? [],
                                'image_path' => $projectData['image_path'] ?? null,
                                'demo_url' => $projectData['demo_url'] ?? null,
                                'source_url' => $projectData['source_url'] ?? null,
                                'is_featured' => $projectData['is_featured'] ?? false,
                                'sort_order' => $projectData['sort_order'] ?? 999,
                            ]);
                            $projectIds[] = $newProject->id;
                        }
                    }
                }

                $portfolio->projects()->whereNotIn('id', $projectIds)->delete();
            } else {
                $portfolio->projects()->delete();
            }

            if (isset($portfolio_data['contacts']) && $portfolio->contacts) {
                $portfolio->contacts->update($portfolio_data['contacts']);
            }

            DB::commit();

            $portfolio->load(['home', 'about', 'projects', 'contacts']);

            return response()->json([
                'message' => 'Portfolio updated successfully',
                'data' => $portfolio
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function handleJsonData(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $portfolio = $user->portfolioUser()->first();

        $portfolio_data = $request->validate([
            'sections' => 'nullable|array',
            'sections.*' => 'string|in:home,about,projects,contact',
            'theme' => 'nullable|string|max:50',
            'slug' => 'nullable|string|max:255|unique:portfolio_users,slug,' . ($portfolio ? $portfolio->id : 'NULL'),
            'is_active' => 'nullable|boolean',

            'home.greeting' => 'nullable|string|max:255',
            'home.name' => 'nullable|string|max:255',
            'home.passions' => 'nullable|array',
            'home.passions.*' => 'string|max:100',
            'home.description' => 'nullable|string',
            'home.logo_path' => 'nullable|string|max:500',
            'home.social_media_links' => 'nullable|array',
            'home.social_media_links.github' => 'nullable|url|max:500',
            'home.social_media_links.twitter' => 'nullable|url|max:500',
            'home.social_media_links.linkedin' => 'nullable|url|max:500',
            'home.social_media_links.instagram' => 'nullable|url|max:500',
            
            'about.title' => 'nullable|string|max:255',
            'about.description' => 'nullable|string',
            'about.image_path' => 'nullable|string|max:500',
            'about.skills' => 'nullable|array',
            'about.skills.*' => 'string|max:100',
            'about.cv_path' => 'nullable|string|max:500',
            
            'projects' => 'nullable|array',
            'projects.*.id' => 'nullable|integer',
            'projects.*.title' => 'required_with:projects.*|string|max:255',
            'projects.*.description' => 'nullable|string',
            'projects.*.tech_stack' => 'nullable|array',
            'projects.*.tech_stack.*' => 'string|max:100',
            'projects.*.image_file' => 'nullable|string|max:500',
            'projects.*.demo_url' => 'nullable|url|max:500',
            'projects.*.source_url' => 'nullable|url|max:500',
            'projects.*.is_featured' => 'nullable|boolean',
            'projects.*.sort_order' => 'nullable|integer|min:1',
            
            'contacts.email' => 'nullable|email|max:255',
            'contacts.phone' => 'nullable|string|max:20',
            'contacts.address' => 'nullable|string|max:500',
            'contacts.linkedin_url' => 'nullable|url|max:500',
            'contacts.github_url' => 'nullable|url|max:500',
            'contacts.website_url' => 'nullable|url|max:500',
        ]);

        try {
            DB::beginTransaction();

            if (! $portfolio) {
                // Create new portfolio
                $portfolio = $user->portfolioUser()->create([
                    'sections' => $portfolio_data['sections'] ?? ['home', 'about', 'projects', 'contact'],
                    'theme' => $portfolio_data['theme'] ?? 'default',
                    'slug' => $portfolio_data['slug'] ?? Str::slug($user->name) . '-' . Str::random(5),
                    'is_active' => $portfolio_data['is_active'] ?? true,
                ]);

                // Create home section
                $portfolio->home()->create([
                    'greeting' => $portfolio_data['home']['greeting'] ?? 'Hello, I am',
                    'name' => $portfolio_data['home']['name'] ?? $user->name,
                    'passions' => $portfolio_data['home']['passions'] ?? [],
                    'description' => $portfolio_data['home']['description'] ?? null,
                    'logo_path' => $portfolio_data['home']['logo_path'] ?? null,
                    'social_media_links' => $portfolio_data['home']['social_media_links'] ?? [],
                ]);

                // Create about section
                $portfolio->about()->create([
                    'description' => $portfolio_data['about']['description'] ?? null,
                    'image_path' => $portfolio_data['about']['image_path'] ?? null,
                    'skills' => $portfolio_data['about']['skills'] ?? [],
                    'cv_path' => $portfolio_data['about']['cv_path'] ?? null,
                ]);

                // Create contacts section
                $portfolio->contacts()->create([
                    'email' => $portfolio_data['contacts']['email'] ?? $user->email,
                    'phone' => $portfolio_data['contacts']['phone'] ?? null,
                    'address' => $portfolio_data['contacts']['address'] ?? null,
                    
                ]);

                // Create projects if provided
                if (isset($portfolio_data['projects']) && is_array($portfolio_data['projects'])) {
                    foreach ($portfolio_data['projects'] as $projectData) {
                        if (!empty($projectData['title'])) {
                            $portfolio->projects()->create([
                                'title' => $projectData['title'],
                                'description' => $projectData['description'] ?? null,
                                'tech_stack' => $projectData['tech_stack'] ?? [],
                                'image_path' => $projectData['image_path'] ?? null,
                                'demo_url' => $projectData['demo_url'] ?? null,
                                'source_url' => $projectData['source_url'] ?? null,
                                'is_featured' => $projectData['is_featured'] ?? false,
                                'sort_order' => $projectData['sort_order'] ?? 999,
                            ]);
                        }
                    }
                }

                DB::commit();

                $portfolio->load(['home', 'about', 'projects', 'contacts']);

                return response()->json([
                    'message' => 'Portfolio created successfully',
                    'data' => $portfolio
                ], 201);
            }

            $portfolio->update([
                'sections' => $portfolio_data['sections'] ?? $portfolio->sections,
                'theme' => $portfolio_data['theme'] ?? $portfolio->theme,
                'slug' => $portfolio_data['slug'] ?? $portfolio->slug,
                'is_active' => $portfolio_data['is_active'] ?? $portfolio->is_active,
            ]);

            if (isset($portfolio_data['home']) && $portfolio->home) {
                $portfolio->home->update($portfolio_data['home']);
            }

            if (isset($portfolio_data['about']) && $portfolio->about) {
                $portfolio->about->update($portfolio_data['about']);
            }

            if (isset($portfolio_data['projects'])) {
                $projectIds = [];
                
                foreach ($portfolio_data['projects'] as $projectData) {
                    if (isset($projectData['id']) && $projectData['id']) {
                        $project = $portfolio->projects()->find($projectData['id']);
                        if ($project) {
                            $project->update([
                                'title' => $projectData['title'] ?? null,
                                'description' => $projectData['description'] ?? null,
                                'tech_stack' => $projectData['tech_stack'] ?? [],
                                'image_path' => $projectData['image_path'] ?? null,
                                'demo_url' => $projectData['demo_url'] ?? null,
                                'source_url' => $projectData['source_url'] ?? null,
                                'is_featured' => $projectData['is_featured'] ?? false,
                                'sort_order' => $projectData['sort_order'] ?? 999,
                            ]);
                            $projectIds[] = $project->id;
                        }
                    } else {
                        if (!empty($projectData['title'])) {
                            $newProject = $portfolio->projects()->create([
                                'title' => $projectData['title'],
                                'description' => $projectData['description'] ?? null,
                                'tech_stack' => $projectData['tech_stack'] ?? [],
                                'image_path' => $projectData['image_path'] ?? null,
                                'demo_url' => $projectData['demo_url'] ?? null,
                                'source_url' => $projectData['source_url'] ?? null,
                                'is_featured' => $projectData['is_featured'] ?? false,
                                'sort_order' => $projectData['sort_order'] ?? 999,
                            ]);
                            $projectIds[] = $newProject->id;
                        }
                    }
                }

                $portfolio->projects()->whereNotIn('id', $projectIds)->delete();
            } else {
                $portfolio->projects()->delete();
            }

            if (isset($portfolio_data['contacts']) && $portfolio->contacts) {
                $portfolio->contacts->update($portfolio_data['contacts']);
            }

            DB::commit();

            $portfolio->load(['home', 'about', 'projects', 'contacts']);

            return response()->json([
                'message' => 'Portfolio updated successfully',
                'data' => $portfolio
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteportfolio(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $password = $request->validate([
            'password' => 'required|string',
        ]);
        
        if(!Hash::check($password['password'], $user->password)){
            return response()->json(['message' => 'Incorrect password'], 403);
        }

        $portfolio = $user->portfolioUser()->first();
        if (!$portfolio) {
            return response()->json(['message' => 'Portfolio not found'], 404);
        }

        $portfolio->delete();

        return response()->json(['message' => 'Portfolio deleted successfully'], 200);
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