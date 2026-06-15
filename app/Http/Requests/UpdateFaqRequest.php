<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
              'question'    => 'required|string|max:255',
            'answer'      => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'package_id'  => 'nullable|exists:packages,id',
        ];
    }
    public function messages(): array
    {
        return [
            'question.required' => 'Question is required.',
            'answer.required'   => 'Answer is required.',
        ];
    }
}
