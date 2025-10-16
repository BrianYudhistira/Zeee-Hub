<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login( Request $request )
    {
        $credentials = $request->only( 'email', 'password' );
        if (!Auth::attempt( $credentials ) ) {
            return response()->json( [ 'message' => 'Invalid credentials' ], 401 );
        }

        $user = Auth::user();
        $token = $user->createToken( 'api_token' )->plainTextToken;

        return response()->json( [ 
            'message' => 'Login successful', 
            'user' => $user,
            'token' => $token 
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
        $userdata = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        // Create the user
        $user = User::create([
            'name' => $userdata['name'],
            'email' => $userdata['email'],
            'password' => bcrypt($userdata['password']),
        ]);

        return response()->json( [ 'message' => 'User registered successfully', 'user' => $user ], 201 );
    }

    public function dropUser( Request $request )
    {
        $user = $request->user();
        if (! $user) {
            return response()->json([ 'message' => 'Unauthenticated' ], 401);
        }

        // Revoke all personal access tokens (if using Sanctum)
        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        } else {
            // try to delete current access token as fallback (delete by id)
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
        if (! $auth) {
            return response()->json([ 'message' => 'Unauthenticated' ], 401);
        }

        // Basic admin check: assumes users table has an `is_admin` boolean column.
        if (empty($auth->is_admin)) {
            return response()->json([ 'message' => 'Forbidden' ], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json([ 'message' => 'User not found' ], 404);
        }

        if (method_exists($user, 'tokens')) {
            $user->tokens()->delete();
        }

        $user->delete();

        return response()->json([ 'message' => 'User deleted successfully' ], 200);
    }
}