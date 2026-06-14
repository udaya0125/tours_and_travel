<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCountryRequest;
use App\Http\Requests\UpdateCountryRequest;
use App\Models\Country;
use App\Services\CountryService;

class CountryController extends Controller
{
    protected CountryService $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }

    /**
     * Display a listing of countries.
     */
    public function index()
    {
        $countries = $this->countryService->getAll();

        return response()->json([
            'status' => 'success',
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created country.
     */
    public function store(StoreCountryRequest $request)
    {
        $country = $this->countryService->create(
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Country created successfully.',
            'country' => $country,
        ], 201);
    }

    /**
     * Update the specified country.
     */
    public function update(UpdateCountryRequest $request, $id)
    {
        $country = Country::findOrFail($id);

        $country = $this->countryService->update(
            $country,
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Country updated successfully.',
            'country' => $country,
        ]);
    }

    /**
     * Update the specified country.
     */
    public function destroy($id)
    {
        $country = Country::findOrFail($id);

        $this->countryService->delete($country);

        return response()->json([
            'status' => 'success',
            'message' => 'Country deleted successfully.',
        ]);
    }
}
