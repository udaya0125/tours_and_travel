<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\PackageImage;
use App\Models\PackageItinerary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PackageController extends Controller
{
    /**
     * Display all packages
     */
    public function index()
    {
        $packages = Package::with([
            'country',
            'categories',
            'subCategory',
            'images',
            'itineraries',
            'faqs',
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

            'country_id' => 'required|exists:countries,id',

            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',

            'sub_category_id' => 'nullable|exists:sub_categories,id',

            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',

            'include' => 'nullable|string',
            'exclude' => 'nullable|string',
            'highlight' => 'nullable|string',

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

            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required|string',
            'itineraries.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $package = Package::create([
                'title' => $request->title,
                'country_id' => $request->country_id,
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

            // Sync Categories
            $package->categories()->sync($request->category_ids);

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

            // Store Itineraries
            if ($request->filled('itineraries')) {
                foreach ($request->itineraries as $item) {
                    PackageItinerary::create([
                        'package_id' => $package->id,
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Package created successfully',
                'data' => $package->load([
                    'country',
                    'categories',
                    'subCategory',
                    'images',
                    'itineraries',
                    'faqs',
                ]),
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show Single Package
     */
    public function show($id)
    {
        $package = Package::with([
            'country',
            'categories',
            'subCategory',
            'images',
            'itineraries',
            'faqs',
        ])->findOrFail($id);

        return response()->json($package);
    }

    /**
     * Update Package
     */
    public function update(Request $request, $id)
    {
        $package = Package::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',

            'country_id' => 'required|exists:countries,id',

            'category_ids' => 'required|array|min:1',
            'category_ids.*' => 'exists:categories,id',

            'sub_category_id' => 'nullable|exists:sub_categories,id',

            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',

            'include' => 'nullable|string',
            'exclude' => 'nullable|string',
            'highlight' => 'nullable|string',

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

            'itineraries' => 'nullable|array',
            'itineraries.*.day' => 'required',
            'itineraries.*.title' => 'required|string',
            'itineraries.*.description' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $package->update([
                'title' => $request->title,
                'country_id' => $request->country_id,
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

            // Update Categories
            $package->categories()->sync($request->category_ids);

            // Add New Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('packages', 'public');

                    PackageImage::create([
                        'package_id' => $package->id,
                        'image' => $path,
                    ]);
                }
            }

            // Replace Itineraries
            if ($request->filled('itineraries')) {

                $package->itineraries()->delete();

                foreach ($request->itineraries as $item) {
                    PackageItinerary::create([
                        'package_id' => $package->id,
                        'day' => $item['day'],
                        'title' => $item['title'],
                        'description' => $item['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Package updated successfully',
                'data' => $package->load([
                    'country',
                    'categories',
                    'subCategory',
                    'images',
                    'itineraries',
                    'faqs',
                ]),
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
        $package = Package::with([
            'images',
            'itineraries',
            'categories',
        ])->findOrFail($id);

        DB::beginTransaction();

        try {

            // Delete Image Files
            foreach ($package->images as $image) {
                if (Storage::disk('public')->exists($image->image)) {
                    Storage::disk('public')->delete($image->image);
                }
            }

            // Delete Related Records
            $package->images()->delete();
            $package->itineraries()->delete();

            // Remove Category Relations
            $package->categories()->detach();

            // Delete Package
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