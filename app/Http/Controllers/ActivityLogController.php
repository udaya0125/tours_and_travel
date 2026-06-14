<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    //
    public function index()
    {
        $activityLogs = ActivityLog::latest()->paginate(10);

        return response()->json([
            'status' => 'success',
            'activity_logs' => $activityLogs,
        ]);
    }
}
