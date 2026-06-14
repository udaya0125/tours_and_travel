<?php

namespace App\Services;

use App\Models\Country;

class CountryService
{
    public function getAll()
    {
        return Country::latest()->get();
    }

    public function create(array $data): Country
    {
        return Country::create($data);
    }

    public function update(Country $country, array $data): Country
    {
        $country->update($data);

        return $country->fresh();
    }

    public function delete(Country $country): bool
    {
        return $country->delete();
    }
}