<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

// Public endpoints with strict rate limiting (10 requests per minute)
Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login-remember', [AuthController::class, 'rememberedLogin'])->name('rememberedLogin');
    Route::post('/signin', [AuthController::class, 'signin'])->name('signin');
});

// Protected endpoints
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/logoutall', [AuthController::class, 'logoutAll'])->name('logoutAll');
    Route::post('/user/update', [AuthController::class, 'editUser'])->name('user.edit');
    Route::delete('/user', [AuthController::class, 'dropUser'])->name('user.drop');
    Route::delete('/users/{id}', [AuthController::class, 'deleteUserById'])->name('user.delete');
});