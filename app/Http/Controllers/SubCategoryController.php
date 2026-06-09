<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    /**
     * Display all sub categories
     */
    public function index()
    {
        $subCategories = SubCategory::with('category')
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'sub_categories' => $subCategories,
        ], 200);
    }

    /**
     * Store a new sub category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $subCategory = SubCategory::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category created successfully.',
            'sub_category' => $subCategory->load('category'),
        ], 201);
    }

    /**
     * Update sub category
     */
    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $subCategory->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category updated successfully.',
            'sub_category' => $subCategory->fresh()->load('category'),
        ], 200);
    }

    /**
     * Delete sub category
     */
    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category deleted successfully.',
        ], 200);
    }
}
