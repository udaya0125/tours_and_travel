<?php

namespace App\Services;

use App\Models\Package;
use App\Models\PackageImage;
use App\Models\PackageItinerary;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PackageService
{
    public function getAll()
    {
        return Package::with([
            'country',
            'categories',
            'subCategory',
            'images',
            'itineraries',
            'faqs'
        ])->latest()->get();
    }

    public function show($id)
    {
        return Package::with([
            'country',
            'categories',
            'subCategory',
            'images',
            'itineraries',
            'faqs'
        ])->findOrFail($id);
    }

    public function store($request)
    {
        DB::beginTransaction();

        try {

            $package = Package::create([
                'title'             => $request->title,
                'country_id'        => $request->country_id,
                'sub_category_id'   => $request->sub_category_id,
                'short_description' => $request->short_description,
                'long_description'  => $request->long_description,
                'include'           => $request->include,
                'exclude'           => $request->exclude,
                'highlight'         => $request->highlight,
                'duration'          => $request->duration,
                'difficulty'        => $request->difficulty,
                'max_altitude'      => $request->max_altitude,
                'best_season'       => $request->best_season,
                'accommodation'     => $request->accommodation,
                'meals'             => $request->meals,
                'start_point'       => $request->start_point,
                'end_point'         => $request->end_point,
                'price'             => $request->price,
            ]);

            $package->categories()->sync($request->category_ids);

            $this->uploadImages($package, $request);

            $this->saveItineraries($package, $request);

            DB::commit();

            return $package->load([
                'country',
                'categories',
                'subCategory',
                'images',
                'itineraries',
                'faqs'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            throw $e;
        }
    }

    public function update($request, $id)
    {
        DB::beginTransaction();

        try {

            $package = Package::findOrFail($id);

            $package->update([
                'title'             => $request->title,
                'country_id'        => $request->country_id,
                'sub_category_id'   => $request->sub_category_id,
                'short_description' => $request->short_description,
                'long_description'  => $request->long_description,
                'include'           => $request->include,
                'exclude'           => $request->exclude,
                'highlight'         => $request->highlight,
                'duration'          => $request->duration,
                'difficulty'        => $request->difficulty,
                'max_altitude'      => $request->max_altitude,
                'best_season'       => $request->best_season,
                'accommodation'     => $request->accommodation,
                'meals'             => $request->meals,
                'start_point'       => $request->start_point,
                'end_point'         => $request->end_point,
                'price'             => $request->price,
            ]);

            $package->categories()->sync($request->category_ids);

            if ($request->filled('delete_image_ids')) {

                $images = PackageImage::where('package_id', $package->id)
                    ->whereIn('id', $request->delete_image_ids)
                    ->get();

                foreach ($images as $image) {

                    if (Storage::disk('public')->exists($image->image)) {
                        Storage::disk('public')->delete($image->image);
                    }

                    $image->delete();
                }
            }

            $this->uploadImages($package, $request);

            if ($request->filled('itineraries')) {

                $package->itineraries()->delete();

                $this->saveItineraries($package, $request);
            }

            DB::commit();

            return $package->load([
                'country',
                'categories',
                'subCategory',
                'images',
                'itineraries',
                'faqs'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            throw $e;
        }
    }

    public function delete($id)
    {
        DB::beginTransaction();

        try {

            $package = Package::with([
                'images',
                'itineraries',
                'categories'
            ])->findOrFail($id);

            foreach ($package->images as $image) {

                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
            }

            $package->images()->delete();
            $package->itineraries()->delete();
            $package->categories()->detach();

            $package->delete();

            DB::commit();

        } catch (\Exception $e) {

            DB::rollBack();

            throw $e;
        }
    }

    public function deleteImage($packageId, $imageId)
    {
        $image = PackageImage::where('package_id', $packageId)
            ->where('id', $imageId)
            ->firstOrFail();

        if (Storage::disk('public')->exists($image->image)) {
            Storage::disk('public')->delete($image->image);
        }

        $image->delete();
    }

    public function deleteImages($packageId, array $imageIds)
    {
        $images = PackageImage::where('package_id', $packageId)
            ->whereIn('id', $imageIds)
            ->get();

        foreach ($images as $image) {

            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }

            $image->delete();
        }

        return count($images);
    }

    private function uploadImages($package, $request)
    {
        if (!$request->hasFile('images')) {
            return;
        }

        foreach ($request->file('images') as $image) {

            $path = $image->store('packages', 'public');

            PackageImage::create([
                'package_id' => $package->id,
                'image' => $path,
            ]);
        }
    }

    private function saveItineraries($package, $request)
    {
        if (!$request->filled('itineraries')) {
            return;
        }

        foreach ($request->itineraries as $item) {

            PackageItinerary::create([
                'package_id' => $package->id,
                'day' => $item['day'],
                'title' => $item['title'] ?? null,
                'description' => $item['description'] ?? null,
            ]);
        }
    }
}