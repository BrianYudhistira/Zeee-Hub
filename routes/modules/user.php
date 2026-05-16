<?php

use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:60,1'])->prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'getUserProfile'])->name('user.profile');
});