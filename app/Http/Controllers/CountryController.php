<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCountryRequest;
use App\Http\Requests\UpdateCountryRequest;
use App\Models\ActivityLog;
use App\Models\Country;
use App\Services\CountryService;

class CountryController extends Controller
{
    protected CountryService $countryService;

    public function __construct(CountryService $countryService)
    {
        $this->countryService = $countryService;
    }

    public function index()
    {
        $countries = $this->countryService->getAll();

        return response()->json([
            'status'    => 'success',
            'countries' => $countries,
        ]);
    }

    public function store(StoreCountryRequest $request)
    {
        $country = $this->countryService->create(
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created country: {$country->name}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Country created successfully.',
            'country' => $country,
        ], 201);
    }

    public function update(UpdateCountryRequest $request, $id)
    {
        $country = Country::findOrFail($id);

        $country = $this->countryService->update(
            $country,
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated country: {$country->name}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Country updated successfully.',
            'country' => $country,
        ]);
    }

    public function destroy($id)
    {
        $country = Country::findOrFail($id);

        $countryName = $country->name;

        $this->countryService->delete($country);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => "Deleted country: {$countryName}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Country deleted successfully.',
        ]);
    }
}