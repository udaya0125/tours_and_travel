<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubCategoryRequest;
use App\Http\Requests\UpdateSubCategoryRequest;
use App\Models\ActivityLog;
use App\Models\SubCategory;
use App\Services\SubCategoryService;

class SubCategoryController extends Controller
{
    protected $subCategoryService;

    public function __construct(SubCategoryService $subCategoryService)
    {
        $this->subCategoryService = $subCategoryService;
    }

    public function index()
    {
        $subCategories = $this->subCategoryService->getAll();

        return response()->json([
            'status'         => 'success',
            'sub_categories' => $subCategories,
        ]);
    }

    public function store(StoreSubCategoryRequest $request)
    {
        $subCategory = $this->subCategoryService->create(
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created sub category: {$subCategory->name}",
        ]);

        return response()->json([
            'status'       => 'success',
            'message'      => 'Sub Category created successfully.',
            'sub_category' => $subCategory->load('category'),
        ], 201);
    }

    public function update(UpdateSubCategoryRequest $request, int $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory = $this->subCategoryService->update(
            $subCategory,
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated sub category: {$subCategory->name}",
        ]);

        return response()->json([
            'status'       => 'success',
            'message'      => 'Sub Category updated successfully.',
            'sub_category' => $subCategory->load('category'),
        ]);
    }

    public function destroy(int $id)
    {
        $subCategory = SubCategory::findOrFail($id);
        $subCategoryName = $subCategory->name;

        $this->subCategoryService->delete($subCategory);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => "Deleted sub category: {$subCategoryName}",
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Sub Category deleted successfully.',
        ]);
    }
}