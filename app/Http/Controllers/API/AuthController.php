<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;

class AuthController extends Controller
{
    public function __construct(
        protected AuthService $authService
    ) {}
    public function login(LoginRequest $request)
    {
        try {
            $metadata = [
                'ip_address' => $request->ip(),
                'location' => $request->header('X-Location', 'Unknown'),
                'user_agent' => $request->userAgent(),
            ];

            $result = $this->authService->login($request->validated(), $metadata);

            return response()->json([
                'message' => 'Login successful',
                'user' => $result['user'],
                'access_token' => $result['access_token'],
                'token_type' => 'Bearer',
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }
    }

    public function logout(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $this->authService->logout($user);

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function signin(RegisterRequest $request)
    {
        try {
            $result = $this->authService->register(
                $request->validated(),
                $request->file('photo')
            );

            return response()->json([
                'message' => 'User registered successfully',
                'user' => $result['user'],
                'access_token' => $result['access_token'],
                'token_type' => 'Bearer'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function dropUser(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $this->authService->deleteAccount($user);

        return response()->json(['message' => 'User account deleted successfully'], 200);
    }

    public function deleteUserById(Request $request, $id)
    {
        $auth = $request->user();

        if(! $auth) {
            return response()->json([ 'message' => 'Unauthenticated' ], 401);
        }
        if ($auth->role !== 'admin') {
            return response()->json([ 'message' => 'Forbidden' ], 403);
        }
        $user = User::find($id);
        if (! $user) {
            return response()->json([ 'message' => 'User not found' ], 404);
        }

        $user->delete();

        return response()->json([ 'message' => 'User deleted successfully' ], 200);
    }

    public function editUser(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $rules = [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'username' => 'sometimes|required|string|max:255',
            'bio' => 'sometimes|nullable|string|max:1000',
            'status' => 'sometimes|nullable|string|max:255',
            'password' => 'required|string|min:6',
            'photo' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        $userdata = $request->validate($rules);

        try {
            $updatedUser = $this->authService->updateProfile(
                $user,
                $userdata,
                $request->file('photo')
            );

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $updatedUser
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Update failed',
                'error' => $e->getMessage()
            ], 422);
        }
    }
}