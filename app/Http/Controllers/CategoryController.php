<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        return response()->json([
            'status' => 'success',
            'categories' => $this->categoryService->getAll(),
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $this->categoryService->create(
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    // public function update(UpdateCategoryRequest $request, Category $category)
    // {
    //     $category = $this->categoryService->update(
    //         $category,
    //         $request->validated()
    //     );

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Category updated successfully.',
    //         'category' => $category,
    //     ]);
    // }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);

        $category = $this->categoryService->update(
            $category,
            $request->validated()
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Category updated successfully.',
            'category' => $category,
        ]);
    }

    // public function destroy(Category $category)
    // {
    //     $this->categoryService->delete($category);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Category deleted successfully.',
    //     ]);
    // }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $this->categoryService->delete($category);

        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully.',
        ]);
    }
}
