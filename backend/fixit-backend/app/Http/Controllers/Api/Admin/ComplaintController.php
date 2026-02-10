<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
   
    public function index(Request $request)
    {
        $query = Complaint::with('user');

        
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('category', 'like', '%' . $request->search . '%');
            });
        }

        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')->paginate(5)
        );
    }

    
    public function show($id)
    {
        return response()->json(
            Complaint::with('user')->findOrFail($id)
        );
    }

   
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,in-progress,resolved',

            // admin_note REQUIRED only when resolving
            'admin_note' => $request->status === 'resolved'
                ? 'required|string'
                : 'nullable|string',
        ]);

        $complaint = Complaint::findOrFail($id);

        $complaint->update([
            'status' => $request->status,
            'admin_note' => $request->admin_note,
        ]);

        return response()->json([
            'message' => 'Complaint updated successfully',
            'complaint' => $complaint,
        ]);
    }
}
