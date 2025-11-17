<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PortfolioController;

// Public endpoints with strict rate limiting (10 requests per minute)
Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/signin', [AuthController::class, 'signin'])->name('signin');
});

// Protected endpoints with standard rate limiting (60 requests per minute)
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::delete('/user', [AuthController::class, 'dropUser'])->name('user.drop');
    Route::delete('/users/{id}', [AuthController::class, 'deleteUserById'])->name('user.delete');
    Route::get('/portfolio', [PortfolioController::class, 'getPortfolioByUserId'])->name('portfolio');

    Route::get('/asset/logos', [PortfolioController::class, 'getLogo'])->name('asset.logo');


    Route::post('/user/update', [AuthController::class, 'editUser'])->name('user.edit');

    Route::post('/portfolio/update_home', [PortfolioController::class, 'editHome'])->name('portfolio.home.edit');
    Route::post('/portfolio/update_about', [PortfolioController::class, 'editAbout'])->name('portfolio.about.edit');
    Route::post('/portfolio/update_projects/order', [PortfolioController::class, 'editProjectsOrder'])->name('portfolio.projects.edit');
    Route::post('/portfolio/update_contacts', [PortfolioController::class, 'editContacts'])->name('portfolio.contacts.edit');
    Route::post('/update_portfolioForm', [PortfolioController::class, 'editPortfolioFormData'])->name('portfolio.edit.form');
    Route::post('/update_portfolioJson', [PortfolioController::class, 'editPortfolioJsonData'])->name('portfolio.edit');

    Route::delete('/portfolio/delete', [PortfolioController::class, 'deleteportfolio'])->name('portfolio.delete');
    
    // Email verification with tighter rate limiting (5 requests per minute)
    Route::middleware(['throttle:5,1'])->group(function () {
        Route::post('/email/send_verification', [App\Http\Controllers\API\EmailVerificationController::class, 'send'])->name('email.send_verification');
    });
});
