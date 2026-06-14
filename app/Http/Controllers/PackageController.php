<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Services\PackageService;

class PackageController extends Controller
{
    protected $packageService;

    public function __construct(PackageService $packageService)
    {
        $this->packageService = $packageService;
    }

    public function index()
    {
        return response()->json(
            $this->packageService->getAll()
        );
    }

    public function store(StorePackageRequest $request)
    {
        $package = $this->packageService->store($request);

        return response()->json([
            'message' => 'Package created successfully',
            'data' => $package,
        ], 201);
    }

    public function show($id)
    {
        return response()->json(
            $this->packageService->show($id)
        );
    }

    public function update(UpdatePackageRequest $request, $id)
    {
        $package = $this->packageService->update($request, $id);

        return response()->json([
            'message' => 'Package updated successfully',
            'data' => $package,
        ]);
    }

    public function destroy($id)
    {
        $this->packageService->delete($id);

        return response()->json([
            'message' => 'Package deleted successfully'
        ]);
    }

    public function destroyImage($packageId, $imageId)
    {
        $this->packageService->deleteImage($packageId, $imageId);

        return response()->json([
            'message' => 'Image deleted successfully'
        ]);
    }

    public function destroyImages($packageId, array $imageIds)
    {
        $count = $this->packageService->deleteImages($packageId, $imageIds);

        return response()->json([
            'message' => "{$count} image(s) deleted successfully"
        ]);
    }
}