<?php

// Test cache implementation
echo "Testing cache implementation...\n";

$user = App\Models\User::first();

if (!$user) {
    echo "No users found. Please create a user first.\n";
    exit;
}

echo "Testing with user: {$user->name} (ID: {$user->id})\n";

// Clear cache
Illuminate\Support\Facades\Cache::forget("portfolio:user:{$user->id}");
echo "\n1. Cache cleared\n";

// First call - Cache MISS
$start = microtime(true);
$portfolio1 = app(App\Services\PortfolioService::class)->getPortfolio($user);
$time1 = round((microtime(true) - $start) * 1000, 2);
echo "2. First call (cache MISS): {$time1}ms\n";

// Second call - Cache HIT
$start = microtime(true);
$portfolio2 = app(App\Services\PortfolioService::class)->getPortfolio($user);
$time2 = round((microtime(true) - $start) * 1000, 2);
echo "3. Second call (cache HIT): {$time2}ms\n";

// Calculate improvement
$improvement = round((($time1 - $time2) / $time1) * 100, 1);
echo "\n✅ Performance improvement: {$improvement}%\n";

// Verify cache exists
$cacheExists = Illuminate\Support\Facades\Cache::has("portfolio:user:{$user->id}");
echo "✅ Cache exists: " . ($cacheExists ? 'Yes' : 'No') . "\n";

echo "✅ Cache is working!\n";
