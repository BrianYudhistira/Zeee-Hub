<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Portfolio\PortfolioController;

Route::get('/', function () {
    return redirect()->route('portfolio.index');
});

Route::group(['prefix' => 'me'], function () {
    Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/projects/{id}', [PortfolioController::class, 'getProjectById'])->name('portfolio.project');
});

Route::get('/portfolio/{slug}', [PortfolioController::class, 'getPortfolioBySlug'])->name('portfolio.slug');
Route::get('/test', function(){
    return view('emails.verify', ['url' => 'https://example.com/verify?token=123456', 'name' => 'John Doe']);
});

Route::get('/verify-email/{id}/{hash}', [App\Http\Controllers\API\EmailVerificationController::class, 'verify'])->name('verification.verify')->middleware('signed');