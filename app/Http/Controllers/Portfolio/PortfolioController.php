<?php

namespace App\Http\Controllers\Portfolio;

use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortfolioController{
    public function index()
    {
        return Inertia::render('Portfolio/Portfolio',[
            'userphoto' =>Storage::url('portfolio/Profile.png'),
        ]);
    }
}