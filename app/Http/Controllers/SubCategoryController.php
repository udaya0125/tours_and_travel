<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubCategoryRequest;
use App\Http\Requests\UpdateSubCategoryRequest;
use App\Models\SubCategory;

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
        ]);
    }

    /**
     * Store a new sub category
     */
    public function store(StoreSubCategoryRequest $request)
    {
        $subCategory = SubCategory::create(
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category created successfully.',
            'sub_category' => $subCategory->load('category'),
        ], 201);
    }

    /**
     * Update sub category
     */
    public function update(
        UpdateSubCategoryRequest $request,
        SubCategory $subCategory
    ) {
        $subCategory->update(
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category updated successfully.',
            'sub_category' => $subCategory->fresh()->load('category'),
        ]);
    }

    /**
     * Delete sub category
     */
    public function destroy(SubCategory $subCategory)
    {
        $subCategory->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category deleted successfully.',
        ]);
    }
}