<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Portfolio\PortfolioController;

Route::get('/', function () {
    return redirect()->route('portfolio.index');
});

Route::get('/me', [PortfolioController::class, 'index'])->name('portfolio.index');
