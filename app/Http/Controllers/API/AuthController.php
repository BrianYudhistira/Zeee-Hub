<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login( Request $request )
    {
        $credentials = $request->only( 'email', 'password' );
        
        if (!Auth::attempt( $credentials ) ) {
            return response()->json( [ 'message' => 'Invalid credentials' ], 401 );
        }

        $user = Auth::user();
        
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json( [ 
            'message' => 'Login successful', 
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 200 );
    }

    public function logout( Request $request )
    {
        $user = $request->user();
        if ($user) {
            $current = $user->currentAccessToken();
            if ($current && isset($current->id)) {
                DB::table('personal_access_tokens')->where('id', $current->id)->delete();
            }

            if (method_exists($user, 'tokens')) {
                $user->tokens()->delete();
            }
        }
        return response()->json( [ 'message' => 'Logged out successfully' ], 200 );
    }

    public function signin( Request $request )
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        // Basic validation (will return 422 JSON automatically on failure)
        $userdata = $request->validate($rules);

        // Pre-check uniqueness: check email first, return immediately if duplicate
        if (User::where('email', $userdata['email'])->exists()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['email' => ['The email has already been taken.']],
            ], 422);
        }
        if (User::where('name', $userdata['name'])->exists()) {
            return response()->json([
                'message' => 'The given data was invalid.',
                'errors' => ['name' => ['The name has already been taken.']],
            ], 422);
        }

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = Str::uuid()->toString() . '.' . $file->getClientOriginalExtension();
            $photoPath = $file->storeAs('users', $filename, 'public');
        }

        try{
            $user = User::create([
                'name' => $userdata['name'],
                'email' => $userdata['email'],
                'photo_path' => $photoPath,
                'password' => bcrypt($userdata['password']),
            ]);
            
            // Create token untuk user baru
            $token = $user->createToken('auth_token')->plainTextToken;
            
        }catch (\Exception $e){
            return response()->json([ 'message' => 'Registration failed', 'error' => $e->getMessage() ], 500 );
        }

        return response()->json([ 
            'message' => 'User registered successfully', 
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 201 );
    }

    public function dropUser( Request $request )
    {
        $user = $request->user();
        if (! $user) {
            return response()->json([ 'message' => 'Unauthenticated' ], 401);
        }

        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        } else {
            $token = $request->user()->currentAccessToken();
            if ($token && isset($token->id)) {
                DB::table('personal_access_tokens')->where('id', $token->id)->delete();
            }
        }

        $user->delete();

        return response()->json([ 'message' => 'User account deleted successfully' ], 200);
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
}