<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\MoneyController;

// Protected keuangan endpoints
Route::middleware(['throttle:60,1'])->prefix('keuangan')->group(function () {
    Route::get('/balance', [MoneyController::class, 'trackBalance'])->name('portfolio.keuangan.home');
    Route::post('/balance-custom', [MoneyController::class, 'trackBalanceCustom'])->name('portfolio.keuangan.customTrack');

    Route::get('/total', [MoneyController::class, 'totalBalance'])->name('portfolio.keuangan.total');
});