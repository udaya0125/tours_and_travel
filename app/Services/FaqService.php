<?php

namespace App\Services;

use App\Models\Faq;

class FaqService
{
    /**
     * Get all FAQs.
     */
    public function getAll()
    {
        return Faq::with(['category', 'package'])
            ->latest()
            ->get();
    }

    /**
     * Create FAQ.
     */
    public function create(array $data): Faq
    {
        return Faq::create($data);
    }

    /**
     * Update FAQ.
     */
    public function update(int $id, array $data): Faq
    {
        $faq = Faq::findOrFail($id);

        $faq->update($data);

        return $faq->fresh();
    }

    /**
     * Delete FAQ.
     */
    public function delete(int $id): void
    {
        $faq = Faq::findOrFail($id);

        $faq->delete();
    }
}