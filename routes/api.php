<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PortfolioController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum')->name('user');

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum')->name('logout');

Route::delete('/user', [AuthController::class, 'dropUser'])->middleware('auth:sanctum')->name('user.drop');

Route::delete('/users/{id}', [AuthController::class, 'deleteUserById'])->middleware('auth:sanctum')->name('user.delete');

Route::get('/portfolio', [PortfolioController::class, 'getPortfolioByUserId'])->middleware('auth:sanctum')->name('portfolio');
