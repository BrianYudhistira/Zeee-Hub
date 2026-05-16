<?php

use Illuminate\Support\Facades\Route;

// Authentication routes (includes public endpoints)
require __DIR__.'/modules/auth.php';

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Portfolio routes
    require __DIR__.'/modules/portfolio.php';

    // Keuangan routes
    require __DIR__.'/modules/keuangan.php';

    require __DIR__.'/modules/email.php';

    require __DIR__.'/modules/user.php';
});
