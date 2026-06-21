<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePackageRequest;
use App\Http\Requests\UpdatePackageRequest;
use App\Models\ActivityLog;
use App\Models\Package;
use App\Services\PackageService;
use Illuminate\Http\Request;

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

    public function show($id)
    {
        return response()->json(
            $this->packageService->show($id)
        );
    }

    public function store(StorePackageRequest $request)
    {
        $package = $this->packageService->store($request);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Created package: {$package->title}",
        ]);

        return response()->json([
            'message' => 'Package created successfully',
            'data'    => $package,
        ], 201);
    }

    public function update(UpdatePackageRequest $request, $id)
    {
        $package = $this->packageService->update($request, $id);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Updated package: {$package->title}",
        ]);

        return response()->json([
            'message' => 'Package updated successfully',
            'data'    => $package,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        // Fetch before delete to capture the title for the log
        $package = Package::findOrFail($id);
        $packageTitle = $package->title; // ✅ was $package->name — field is 'title'

        $this->packageService->delete($id);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(), // ✅ injected Request instead of request() helper
            'title'      => "Deleted package: {$packageTitle}",
        ]);

        return response()->json([
            'message' => 'Package deleted successfully',
        ]);
    }

    public function destroyImage(Request $request, $packageId, $imageId)
    {
        $this->packageService->deleteImage($packageId, $imageId);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(), // ✅ injected Request
            'title'      => "Deleted image ID {$imageId} from package ID {$packageId}",
        ]);

        return response()->json([
            'message' => 'Image deleted successfully',
        ]);
    }

    // ✅ Fixed: $imageIds can't be type-hinted as array in a route method —
    //    it must come from the request body instead
    public function destroyImages(Request $request, $packageId)
    {
        $imageIds = $request->input('image_ids', []);

        $count = $this->packageService->deleteImages($packageId, $imageIds);

        ActivityLog::create([
            'name'       => auth()->user()->name ?? 'System',
            'ip_address' => $request->ip(),
            'title'      => "Deleted {$count} image(s) from package ID {$packageId}",
        ]);

        return response()->json([
            'message' => "{$count} image(s) deleted successfully",
        ]);
    }
}