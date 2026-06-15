<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Services\FaqService;

class FaqController extends Controller
{
    protected FaqService $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    /**
     * Display all FAQs.
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => $this->faqService->getAll(),
        ]);
    }

    /**
     * Store FAQ.
     */
    public function store(StoreFaqRequest $request)
    {
        $faq = $this->faqService->create(
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully.',
            'data' => $faq,
        ], 201);
    }

    /**
     * Update FAQ.
     */
    public function update(UpdateFaqRequest $request, $id)
    {
        $faq = $this->faqService->update(
            $id,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully.',
            'data' => $faq,
        ]);
    }

    /**
     * Delete FAQ.
     */
    public function destroy($id)
    {
        $this->faqService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully.',
        ]);
    }
}
