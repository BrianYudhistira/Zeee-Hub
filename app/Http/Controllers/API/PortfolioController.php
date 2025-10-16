<?php

namespace App\Http\Controllers\API; 
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class PortfolioController
{
      public function getPortfolioByUserId(Request $request)
      {
          $user = $request->user();
          if (!$user) {
              return response()->json(['message' => 'Unauthorized'], 401);
          }

          // Ensure portfolioUser relation exists and load all expected relations
          $portfolioRelation = $user->portfolioUser();
          if (! $portfolioRelation) {
              return response()->json(['message' => 'Portfolio not found'], 404);
          }

          $portfolio = $portfolioRelation->with(['home', 'about', 'projects', 'contacts'])->first();

          if (! $portfolio) {
              return response()->json(['message' => 'Portfolio not found'], 404);
          }

          return response()->json($portfolio, 200);
      }
}