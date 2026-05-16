<?php

namespace App\Http\Controllers\API;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerifyEmailLink;
use Illuminate\Support\Facades\URL;

class EmailVerificationController extends Controller
{
    public function send(Request $request){
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $url = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );
        $name = $user->name;

        Mail::to($user->email)->send(new VerifyEmailLink($url, $name));

        return response()->json(['message' => 'Verification email sent'], 200);
    }

    public function verify($id, $hash)
    {
        $user = User::findOrFail($id);

        if (! hash_equals(sha1($user->email), $hash)) {
            abort(403, 'Invalid verification link');
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified'], 200);
        }

        $user->markEmailAsVerified();

        return response()->json(['message' => 'Email verified successfully'], 200);
    }
}