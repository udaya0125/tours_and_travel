<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubCategoryRequest;
use App\Http\Requests\UpdateSubCategoryRequest;
use App\Models\SubCategory;
use App\Services\SubCategoryService;

class SubCategoryController extends Controller
{
    protected $subCategoryService;

    public function __construct(SubCategoryService $subCategoryService)
    {
        $this->subCategoryService = $subCategoryService;
    }

    /**
     * Display all sub categories.
     */
    public function index()
    {
        $subCategories = $this->subCategoryService->getAll();

        return response()->json([
            'status' => 'success',
            'sub_categories' => $subCategories,
        ]);
    }

    /**
     * Store a new sub category.
     */
    public function store(StoreSubCategoryRequest $request)
    {
        $subCategory = $this->subCategoryService->create(
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category created successfully.',
            'sub_category' => $subCategory->load('category'),
        ], 201);
    }

    /**
     * Update a sub category.
     */
    // public function update(
    //     UpdateSubCategoryRequest $request,
    //     SubCategory $subCategory
    // ) {
    //     $subCategory = $this->subCategoryService->update(
    //         $subCategory,
    //         $request->validated()
    //     );

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Sub Category updated successfully.',
    //         'sub_category' => $subCategory->load('category'),
    //     ]);
    // }
    public function update(
        UpdateSubCategoryRequest $request,
        int $id
    ) {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory = $this->subCategoryService->update(
            $subCategory,
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category updated successfully.',
            'sub_category' => $subCategory->load('category'),
        ]);
    }

    /**
     * Delete a sub category.
     */
    // public function destroy(SubCategory $subCategory)
    // {
    //     $this->subCategoryService->delete($subCategory);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Sub Category deleted successfully.',
    //     ]);
    // }

    public function destroy(int $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $this->subCategoryService->delete($subCategory);

        return response()->json([
            'status' => 'success',
            'message' => 'Sub Category deleted successfully.',
        ]);
    }
}
