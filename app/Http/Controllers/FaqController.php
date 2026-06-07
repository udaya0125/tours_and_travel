<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * Display all FAQs
     */
    public function index()
    {
        $faqs = Faq::with(['category', 'package'])
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $faqs
        ]);
    }

    /**
     * Store a new FAQ
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'question'    => 'required|string|max:255',
            'answer'      => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'package_id'  => 'nullable|exists:packages,id',
        ]);

        $faq = Faq::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ created successfully.',
            'data' => $faq
        ], 201);
    }

    /**
     * Update FAQ
     */
    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);

        $validated = $request->validate([
            'question'    => 'required|string|max:255',
            'answer'      => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'package_id'  => 'nullable|exists:packages,id',
        ]);

        $faq->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'FAQ updated successfully.',
            'data' => $faq
        ]);
    }

    /**
     * Delete FAQ
     */
    public function destroy($id)
    {
        $faq = Faq::findOrFail($id);

        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ deleted successfully.'
        ]);
    }
}