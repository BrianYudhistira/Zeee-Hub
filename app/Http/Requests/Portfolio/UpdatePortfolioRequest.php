<?php

namespace App\Http\Requests\Portfolio;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePortfolioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $portfolioId = $this->user()->portfolioUser?->id ?? 'NULL';

        return [
            'slug' => "nullable|string|max:255|unique:portfolio_users,slug,{$portfolioId}",
            'theme' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
            
            // Accept both string (form-data JSON) and array (JSON request)
            'sections' => 'nullable', // Will be decoded in controller
            'home' => 'nullable',     // Will be decoded in controller
            'about' => 'nullable',    // Will be decoded in controller
            'projects' => 'nullable', // Will be decoded in controller
            'contacts' => 'nullable', // Will be decoded in controller
            
            // File uploads
            'about_image' => 'nullable|image|max:2048',
            'about_cv' => 'nullable|mimes:pdf,doc,docx|max:5120',
            'home_logo' => 'nullable|image|max:2048',
            'project_images' => 'nullable|array',
            'project_images.*' => 'image|max:2048',
        ];
    }
}
