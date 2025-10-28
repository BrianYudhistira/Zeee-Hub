<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyEmailLink extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public string $url;
    public string $name;

    public function __construct(string $url, string $name)
    {
        $this->url = $url;
        $this->name = $name;
    }

    public function build()
    {
        return $this->subject('Verify Your Email Address')
                    ->view('emails.verify')
                    ->with([
                        'url' => $this->url,
                        'name' => $this->name,
                    ]);
    }
}
