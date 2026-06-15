<?php

namespace App\Services;

use App\Models\SubCategory;

class SubCategoryService
{
    /**
     * Get all sub categories.
     */
    public function getAll()
    {
        return SubCategory::with('category')
            ->latest()
            ->get();
    }

    /**
     * Create a new sub category.
     */
    public function create(array $data): SubCategory
    {
        return SubCategory::create($data);
    }

    /**
     * Update a sub category.
     */
    public function update(SubCategory $subCategory, array $data): SubCategory
    {
        $subCategory->update($data);

        return $subCategory->fresh();
    }

    /**
     * Delete a sub category.
     */
    public function delete(SubCategory $subCategory): bool
    {
        return $subCategory->delete();
    }
}