<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Services\LogService;

class AuthController extends Controller
{
    protected $logService;

    public function __construct(LogService $logService)
    {
        $this->logService = $logService;
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($validated, false)) {
                $this->logService->warningLog(
                    'Auth',
                    'Failed login attempt for email: ' . $validated['email']
                );
                throw new \Exception('Invalid credentials', 401);
            }

            $request->session()->regenerate();

            $user = User::where('email', $validated['email'])->firstOrFail();

            $this->logService->infoLog(
                'Auth',
                'Success: User logged in'
            );

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
            ], 200);

        } catch (\Exception $e) {
            $this->logService->errorLog(
                'Auth',
                'Login error: ' . $e->getMessage()
            );
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function rememberedLogin(Request $request)
    {
        try{
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if(!Auth::attempt($validated, true)) {
                throw new \Exception('Invalid credentials', 401);
            }

            $request->session()->regenerate();

            $user = User::where('email', $validated['email'])->firstOrFail();

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
            ], 200);
        } catch(\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $this->logService->infoLog(
            'Auth',
            'Success: User logged out'
        );

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function logoutAll(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $this->logService->infoLog(
            'Auth',
            'Success: User logged out from all devices'
        );

        DB::table('sessions')->where('user_id', $user->id)->delete();
        $user->setRememberToken(Str::random(60));
        $user->save();

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out from all devices successfully'], 200);
    }
}