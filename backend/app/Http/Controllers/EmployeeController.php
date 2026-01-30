<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Employee::with(['user', 'department'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'department_id' => 'required|exists:departments,id',
            'role' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'joining_date' => 'required|date',
            'salary' => 'required|numeric',
        ]);

        $employee = Employee::create($validated);

        return response()->json($employee, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        return $employee->load(['user', 'department']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'department_id' => 'exists:departments,id',
            'role' => 'string|max:255',
            'phone' => 'nullable|string|max:20',
            'joining_date' => 'date',
            'salary' => 'numeric',
            // user_id typically shouldn't change, but can be added if needed
        ]);

        $employee->update($validated);

        return $employee;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json(null, 204);
    }
}
