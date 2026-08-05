<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Portfolio\PortfolioController;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('portfolio.index');
});

Route::group(['prefix' => 'me'], function () {
    Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
    
    Route::get('/projects', [PortfolioController::class, 'listProject'])->name('portfolio.projects');
    Route::get('/projects/{slug}', [PortfolioController::class, 'getProjectBySlug'])->name('portfolio.project');
});

Route::post('/messageMe', [PortfolioController::class, 'sendMessage'])->name('portfolio.sendMessage');

Route::get('/test', function () {
    return new \App\Mail\SendMailToMe(
        'John Doe', 
        'test@gmail.com', 
        'Hello, this is a test message.'
    );
});

Route::get('/verify-email/{id}/{hash}', [App\Http\Controllers\API\EmailVerificationController::class, 'verify'])->name('verification.verify')->middleware('signed');
