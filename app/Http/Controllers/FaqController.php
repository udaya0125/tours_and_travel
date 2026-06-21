<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFaqRequest;
use App\Http\Requests\UpdateFaqRequest;
use App\Models\ActivityLog;
use App\Models\Faq;
use App\Services\FaqService;

class FaqController extends Controller
{
    protected FaqService $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => $this->faqService->getAll(),
        ]);
    }

    public function store(StoreFaqRequest $request)
    {
        $faq = $this->faqService->create(
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created FAQ: {$faq->question}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully.',
            'data'    => $faq,
        ], 201);
    }

    public function update(UpdateFaqRequest $request, $id)
    {
        $faq = $this->faqService->update(
            $id,
            $request->validated()
        );

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated FAQ: {$faq->question}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully.',
            'data'    => $faq,
        ]);
    }

    public function destroy($id)
    {
        // Fetch before delete so we can log the question
        $faq = Faq::findOrFail($id);
        $faqQuestion = $faq->question;

        $this->faqService->delete($id);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => request()->ip(),
            'title'      => "Deleted FAQ: {$faqQuestion}",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully.',
        ]);
    }
}