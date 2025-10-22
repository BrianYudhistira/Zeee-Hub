<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PortfolioController;


Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    })->name('user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::delete('/user', [AuthController::class, 'dropUser'])->name('user.drop');
    Route::delete('/users/{id}', [AuthController::class, 'deleteUserById'])->name('user.delete');
    Route::get('/portfolio', [PortfolioController::class, 'getPortfolioByUserId'])->name('portfolio');

    Route::post('/portfolio/update_home', [PortfolioController::class, 'editHome'])->name('portfolio.home.edit');
    Route::post('/portfolio/update_about', [PortfolioController::class, 'editAbout'])->name('portfolio.about.edit');
    Route::post('/portfolio/update_projects', [PortfolioController::class, 'editProjects'])->name('portfolio.projects.edit');
    Route::post('/portfolio/update_contacts', [PortfolioController::class, 'editContacts'])->name('portfolio.contacts.edit');
});

// Token-Based API Routes (Tanpa Session/CSRF untuk Mobile & Next.js)
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/signin', [AuthController::class, 'signin'])->name('signin');
