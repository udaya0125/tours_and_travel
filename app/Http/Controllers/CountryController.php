<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    /**
     * Display a listing of countries.
     */
    public function index()
    {
        $countries = Country::latest()->get();

        return response()->json([
            'status' => 'success',
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created country.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:countries,name',
        ]);

        $country = Country::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Country created successfully.',
            'country' => $country,
        ], 201);
    }

    /**
     * Update the specified country.
     */
    public function update(Request $request, $id)
    {
        $country = Country::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:countries,name,' . $country->id,
        ]);

        $country->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Country updated successfully.',
            'country' => $country,
        ]);
    }

    /**
     * Remove the specified country.
     */
    public function destroy($id)
    {
        $country = Country::findOrFail($id);

        $country->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Country deleted successfully.',
        ]);
    }
}