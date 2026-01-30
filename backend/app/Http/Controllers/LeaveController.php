<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeaveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            return Leave::with('employee.user')->get();
        } else {
            if ($user->employee) {
                return $user->employee->leaves()->withTrashed()->get();
            }
            return [];
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'leave_type' => 'required|string|max:50',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $user = $request->user();

        if (!$user->employee) {
            return response()->json(['message' => 'Employee record not found for this user.'], 404);
        }

        $leave = $user->employee->leaves()->create($validated);

        return response()->json($leave, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Leave $leaf)
    {
        // Add authorization check if needed (only own leave or admin)
        return $leaf->load('employee.user');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Leave $leaf)
    {
        // Admin updates status
        $user = $request->user();

        if ($user->role === 'admin') {
            $validated = $request->validate([
                'status' => 'required|in:pending,approved,rejected',
            ]);
            $leaf->update($validated);
        } else {
            // Employee might want to update details if pending? 
            // For now assume only admin updates status. 
            // If employee needs to edit, logic goes here.
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $leaf;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Leave $leaf)
    {
        $leaf->delete();

        return response()->json(null, 204);
    }
}
