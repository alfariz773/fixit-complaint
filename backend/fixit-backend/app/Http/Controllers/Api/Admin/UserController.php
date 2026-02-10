<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
   
    public function index(Request $request)
    {
        $query = User::where('role', 'user');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        return response()->json(
            $query->latest()->paginate(5)
        );
    }

   
    public function show($id)
    {
        $user = User::with(['complaints' => function ($q) {
            $q->latest();
        }])->findOrFail($id);

        return response()->json($user);
    }

    
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,blocked',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'User status updated successfully',
            'user' => $user,
        ]);
    }
}
