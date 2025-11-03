<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\PortfolioUser;
use App\Models\Home;
use App\Models\About;
use App\Models\Project;
use App\Models\Contact;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the test user
        $user = User::where('email', 'brianyudhistira1@gmail.com')->first();
        
        if (!$user) {
            $this->command->error('User with email brianyudhistira1@gmail.com not found!');
            return;
        }

        // Create portfolio user
        $portfolioUser = PortfolioUser::create([
            'user_id' => $user->id,
            'sections' => ['home', 'about', 'projects', 'contact'],
            'theme' => 'retro-cyan',
            'slug' => 'brian-yudhistira',
            'is_active' => true,
        ]);

        $this->command->info("Created portfolio user: {$portfolioUser->slug}");

        // Create home data
        $homeData = Home::create([
            'portfolio_user_id' => $portfolioUser->id,
            'greeting' => 'Hello, I\'m',
            'name' => 'Brian Yudhistira',
            'passions' => ['Fullstack Developer', 'Mobile Developer', 'Tech Enthusiast'],
            'description' => ' I am a Full-Stack Developer specializing in modern web and mobile technologies. My passion is crafting robust, scalable applications from end-to-end, focusing on seamless user experience and delivering practical value through clean, high-performance code.',
            'logo_path' => 'images/portfolio/Hero.svg',
            'social_media_links' => [
                'github' => 'https://github.com/BrianYudhistira',
                'linkedin' => 'https://linkedin.com/in/brian-yudhistira',
                'twitter' => 'https://twitter.com/brianyudhistira',
                'instagram' => 'https://instagram.com/brian_yudhistira',
            ],
        ]);

        $this->command->info("Created home data");

        // Create about data
        $aboutData = About::create([
            'portfolio_user_id' => $portfolioUser->id,
            'description' => 'Hi! I\'m Brian Yudhistira, a fresh Informatics Engineering graduate from Universitas Muhammadiyah Malang. I\'m passionate about modern full stack web development using Laravel, Next.js, and Tailwind CSS. As a tech enthusiast with a 3.79 GPA, I love learning, innovating, and creating meaningful digital experiences.',
            'image_path' => 'portfolio/Profile.png',
            'skills' => ['PHP', 'JavaScript', 'Kotlin', 'Laravel', 'NextJS', 'TailwindCSS', 'MySQL', 'Git', 'Docker'],
            'cv_path' => 'documents/cv-brian-yudhistira.pdf',
        ]);

        $this->command->info("Created about data");

        // Create projects
        $projects = [
            [
                'title' => 'Zeee-Hub Portfolio',
                'description' => 'A modern portfolio website built with Laravel, Inertia.js, and React. Features a retro cyan theme, interactive particles background, and responsive design.',
                'image_path' => 'images/projects/zeee-hub.png',
                'demo_url' => 'https://zeee-hub.com',
                'source_url' => 'https://github.com/BrianYudhistira/Zeee-Hub',
                'tech_stack' => ['Laravel', 'Inertia.js', 'React', 'Tailwind CSS', 'MySQL'],
                'sort_order' => 1,
                'is_featured' => true,
            ],
            [
                'title' => 'E-Commerce Platform',
                'description' => 'A full-featured e-commerce platform with admin dashboard, payment integration, and inventory management system.',
                'image_path' => 'images/projects/ecommerce.png',
                'demo_url' => 'https://ecommerce-demo.com',
                'source_url' => 'https://github.com/BrianYudhistira/ecommerce-platform',
                'tech_stack' => ['Laravel', 'Vue.js', 'MySQL', 'Stripe API', 'Redis'],
                'sort_order' => 2,
                'is_featured' => true,
            ],
            [
                'title' => 'Task Management App',
                'description' => 'A collaborative task management application with real-time updates, team collaboration features, and progress tracking.',
                'image_path' => 'images/projects/task-manager.png',
                'demo_url' => 'https://taskapp-demo.com',
                'source_url' => 'https://github.com/BrianYudhistira/task-manager',
                'tech_stack' => ['Laravel', 'React', 'WebSockets', 'PostgreSQL', 'Docker'],
                'sort_order' => 3,
                'is_featured' => false,
            ],
            [
                'title' => 'Weather Dashboard',
                'description' => 'A responsive weather dashboard that displays current conditions, forecasts, and weather maps using external APIs.',
                'image_path' => 'images/projects/weather-dashboard.png',
                'demo_url' => 'https://weather-dashboard-demo.com',
                'source_url' => 'https://github.com/BrianYudhistira/weather-dashboard',
                'tech_stack' => ['React', 'Node.js', 'Express', 'Weather API', 'Chart.js'],
                'sort_order' => 4,
                'is_featured' => false,
            ],
        ];

        foreach ($projects as $projectData) {
            $project = Project::create([
                'portfolio_user_id' => $portfolioUser->id,
                ...$projectData,
            ]);
            
            $this->command->info("Created project: {$project->title}");
        }

        // Create contact data
        $contactData = Contact::create([
            'portfolio_user_id' => $portfolioUser->id,
            'email' => 'brianyudhistira1@gmail.com',
            'phone' => '+62 812-3456-7890',
            'address' => 'Jakarta, Indonesia',
        ]);

        $this->command->info("Created contact data");
        $this->command->info("Portfolio seeding completed successfully!");
    }
}