<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePackageRequest extends FormRequest
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
            'title'                     => 'required|string|max:255',
            'country_id'                => 'required|exists:countries,id',
            'category_ids'              => 'required|array|min:1',
            'category_ids.*'            => 'exists:categories,id',
            'sub_category_id'           => 'nullable|exists:sub_categories,id',

            'short_description'         => 'nullable|string',
            'long_description'          => 'nullable|string',
            'include'                   => 'nullable|string',
            'exclude'                   => 'nullable|string',
            'highlight'                 => 'nullable|string',

            'duration'                  => 'nullable|string',
            'difficulty'                => 'nullable|string',
            'max_altitude'              => 'nullable|string',
            'best_season'               => 'nullable|string',
            'accommodation'             => 'nullable|string',
            'meals'                     => 'nullable|string',
            'start_point'               => 'nullable|string',
            'end_point'                 => 'nullable|string',

            'price'                     => 'nullable|numeric',

            'images.*'                  => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',

            'delete_image_ids'          => 'nullable|array',
            'delete_image_ids.*'        => 'integer|exists:package_images,id',

            'itineraries'               => 'nullable|array',
            'itineraries.*.day'         => 'required',
            'itineraries.*.title'       => 'nullable|string',
            'itineraries.*.description' => 'nullable|string',
        ];
    }
}
