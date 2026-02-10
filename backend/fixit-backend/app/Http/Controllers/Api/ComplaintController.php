<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
   
    public function index(Request $request)
    {
        $query = Complaint::where('user_id', $request->user()->id);

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('category', 'like', '%' . $request->search . '%')
                  ->orWhere('status', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json(
            $query->orderBy('created_at', 'desc')
                  ->paginate($request->per_page ?? 5)
        );
    }

   
    public function store(Request $request)
    {
        
        if ($request->user()->status === 'blocked') {
            return response()->json([
                'message' => 'Your account is blocked. You cannot create complaints.'
            ], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('complaints', 'public');
        }

        $complaint = Complaint::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'status' => 'pending',
            'lat' => $request->lat,
            'lng' => $request->lng,
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Complaint created successfully',
            'complaint' => $complaint,
        ], 201);
    }

    
    public function show(Request $request, $id)
    {
        $complaint = Complaint::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json($complaint);
    }

   
    public function update(Request $request, $id)
    {
        
        if ($request->user()->status === 'blocked') {
            return response()->json([
                'message' => 'Your account is blocked. You cannot update complaints.'
            ], 403);
        }

        $complaint = Complaint::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $complaint->image = $request->file('image')->store('complaints', 'public');
        }

        $complaint->update($request->only([
            'title',
            'description',
            'category',
            'lat',
            'lng',
        ]));

        return response()->json([
            'message' => 'Complaint updated successfully',
            'complaint' => $complaint,
        ]);
    }

    
    public function destroy(Request $request, $id)
    {
       
        if ($request->user()->status === 'blocked') {
            return response()->json([
                'message' => 'Your account is blocked. You cannot delete complaints.'
            ], 403);
        }

        $complaint = Complaint::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $complaint->delete();

        return response()->json([
            'message' => 'Complaint deleted successfully',
        ]);
    }
}
