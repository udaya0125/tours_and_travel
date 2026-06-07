<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageImage;
use App\Models\PackageItinerary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PackageController extends Controller
{
    /**
     * Display all packages
     */
    public function index()
    {
        $packages = Package::with([
            'country',
            'category',
            'subCategory',
            'images',
            'itineraries',
        ])->latest()->get();

        return response()->json($packages);
    }

    /**
     * Store Package
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug'              => Str::slug($request->title) . '-' . uniqid(), // 👈 add this
            'country_id' => 'required|exists:countries,id',
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',

            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',

            'duration' => 'nullable|string',
            'difficulty' => 'nullable|string',
            'max_altitude' => 'nullable|string',
            'best_season' => 'nullable|string',
            'accommodation' => 'nullable|string',
            'meals' => 'nullable|string',
            'start_point' => 'nullable|string',
            'end_point' => 'nullable|string',
            'price' => 'nullable|numeric',

            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        DB::beginTransaction();

        try {

            $package = Package::create([
                'title' => $request->title,
                'country_id' => $request->country_id,
                'category_id' => $request->category_id,
                'sub_category_id' => $request->sub_category_id,

                'short_description' => $request->short_description,
                'long_description' => $request->long_description,

                'include' => $request->include,
                'exclude' => $request->exclude,
                'highlight' => $request->highlight,

                'duration' => $request->duration,
                'difficulty' => $request->difficulty,
                'max_altitude' => $request->max_altitude,
                'best_season' => $request->best_season,
                'accommodation' => $request->accommodation,
                'meals' => $request->meals,
                'start_point' => $request->start_point,
                'end_point' => $request->end_point,
                'price' => $request->price,
            ]);

            // Upload Images
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('packages', 'public');

                    PackageImage::create([
                        'package_id' => $package->id,
                        'image' => $path,
                    ]);
                }
            }

            // Store Itinerary
            if ($request->itineraries) {

                foreach ($request->itineraries as $item) {

                    PackageItinerary::create([
                        'package_id' => $package->id,
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Package created successfully',
                'data' => $package->load('images', 'itineraries'),
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Package
     */
    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        DB::beginTransaction();

        try {

            $package->update([
                'title' => $request->title,
                'slug'  => Str::slug($request->title) . '-' . uniqid(),
                'country_id' => $request->country_id,
                'category_id' => $request->category_id,
                'sub_category_id' => $request->sub_category_id,

                'short_description' => $request->short_description,
                'long_description' => $request->long_description,

                'include' => $request->include,
                'exclude' => $request->exclude,
                'highlight' => $request->highlight,

                'duration' => $request->duration,
                'difficulty' => $request->difficulty,
                'max_altitude' => $request->max_altitude,
                'best_season' => $request->best_season,
                'accommodation' => $request->accommodation,
                'meals' => $request->meals,
                'start_point' => $request->start_point,
                'end_point' => $request->end_point,
                'price' => $request->price,
            ]);

            /**
             * Add New Images
             */
            if ($request->hasFile('images')) {

                foreach ($request->file('images') as $image) {

                    $path = $image->store('packages', 'public');

                    PackageImage::create([
                        'package_id' => $package->id,
                        'image' => $path,
                    ]);
                }
            }

            /**
             * Replace Itinerary
             */
            if ($request->itineraries) {

                $package->itineraries()->delete();

                foreach ($request->itineraries as $item) {

                    PackageItinerary::create([
                        'package_id' => $package->id,
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'],
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Package updated successfully',
                'data' => $package->load('images', 'itineraries'),
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete Package
     */
    public function destroy($id)
    {
        $package = Package::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {

            foreach ($package->images as $image) {

                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
            }

            $package->images()->delete();
            $package->itineraries()->delete();

            $package->delete();

            DB::commit();

            return response()->json([
                'message' => 'Package deleted successfully',
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
