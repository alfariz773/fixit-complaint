<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;

class DashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_complaints' => Complaint::count(),

            // Cards
            'pending_complaints' => Complaint::where('status', 'pending')->count(),
            'in_progress_complaints' => Complaint::where('status', 'in-progress')->count(),
            'resolved_complaints' => Complaint::where('status', 'resolved')->count(),

            // Charts
            'complaints_by_status' => [
                'pending' => Complaint::where('status', 'pending')->count(),
                'in-progress' => Complaint::where('status', 'in-progress')->count(),
                'resolved' => Complaint::where('status', 'resolved')->count(),
            ],
        ]);
    }
}
