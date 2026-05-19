<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmailVerificationController;

// Email verification with tighter rate limiting (5 requests per minute)
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/email/send_verification', [EmailVerificationController::class, 'send'])->name('email.send_verification');
});
