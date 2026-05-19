<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Authenticate user and generate token
     */
    public function login(array $credentials, array $metadata = []): array
    {
        if (!Auth::attempt($credentials)) {
            throw new \Exception('Invalid credentials', 401);
        }

        $user = Auth::user();

        // Update login metadata
        $user->update([
            'last_login_at' => now(),
            'ip_address' => $metadata['ip'] ?? null,
            'location' => $metadata['location'] ?? 'Unknown',
        ]);

        // Create user log
        $user->logs()->create([
            'message' => 'Login successful',
            'ip_address' => $metadata['ip'] ?? null,
            'location' => $metadata['location'] ?? 'Unknown',
            'user_agent' => $metadata['user_agent'] ?? null,
        ]);
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user->load('portfolioUser'),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Register new user
     */
    public function register(array $data, $photoFile = null): array
    {
        // Check uniqueness
        if (User::where('email', $data['email'])->exists()) {
            throw new \Exception('Email already taken', 422);
        }

        if (User::where('name', $data['name'])->exists()) {
            throw new \Exception('Name already taken', 422);
        }

        // Handle photo upload
        $photoPath = null;
        if ($photoFile) {
            $filename = Str::uuid()->toString() . '.' . $photoFile->getClientOriginalExtension();
            $photoPath = $photoFile->storeAs('users', $filename, 'public');
        }

        // Create user
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'photo_path' => $photoPath,
            'password' => Hash::make($data['password']),
        ]);

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ];
    }

    /**
     * Logout user and revoke tokens
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Update user profile
     */
    public function updateProfile(User $user, array $data, $photoFile = null): User
    {
        // Verify password
        if (!Hash::check($data['password'], $user->password)) {
            throw new \Exception('Incorrect password', 422);
        }

        // Check email uniqueness if changed
        if (isset($data['email']) && $data['email'] !== $user->email) {
            if (User::where('email', $data['email'])->exists()) {
                throw new \Exception('Email already taken', 422);
            }
        }

        // Check name uniqueness if changed
        if (isset($data['name']) && $data['name'] !== $user->name) {
            if (User::where('name', $data['name'])->exists()) {
                throw new \Exception('Name already taken', 422);
            }
        }

        // Handle photo upload
        if ($photoFile) {
            // Delete old photo
            if ($user->photo_path) {
                Storage::disk('public')->delete($user->photo_path);
            }

            $filename = Str::uuid()->toString() . '.' . $photoFile->getClientOriginalExtension();
            $data['photo_path'] = $photoFile->storeAs('users', $filename, 'public');
        }

        // Remove password from update data
        unset($data['password']);

        // Update user
        $user->update($data);

        // Invalidate user cache after update
        $this->clearUserCache($user->id);

        return $user->fresh();
    }

    /**
     * Delete user account
     */
    public function deleteAccount(User $user): void
    {
        $userId = $user->id;

        // Delete photo if exists
        if ($user->photo_path) {
            Storage::disk('public')->delete($user->photo_path);
        }

        // Revoke all tokens
        $user->tokens()->delete();

        // Delete user
        $user->delete();

        // Invalidate cache
        $this->clearUserCache($userId);
    }

    /**
     * Clear user cache for specific user
     * Called after profile update or account deletion
     */
    private function clearUserCache(int $userId): void
    {
        Cache::forget("user:{$userId}");
        Cache::forget("portfolio:user:{$userId}"); // Also clear portfolio cache
    }
}
