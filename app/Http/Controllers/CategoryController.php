<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\ActivityLog;
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

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created category: {$category->name}",
        ]);

        return response()->json([
            'status'   => 'success',
            'message'  => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    public function update(UpdateCategoryRequest $request, $id)
    {
        $category = Category::findOrFail($id);

        $category = $this->categoryService->update(
            $category,
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated category: {$category->name}",
        ]);

        return response()->json([
            'status'   => 'success',
            'message'  => 'Category updated successfully.',
            'category' => $category,
        ]);
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $categoryName = $category->name;

        $this->categoryService->delete($category);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => "Deleted category: {$categoryName}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Category deleted successfully.',
        ]);
    }
}