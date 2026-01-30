<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create some departments
        \App\Models\Department::create(['name' => 'HR', 'description' => 'Human Resources']);
        \App\Models\Department::create(['name' => 'IT', 'description' => 'Information Technology']);
        \App\Models\Department::create(['name' => 'Sales', 'description' => 'Sales and Marketing']);

        // Create an Employee User for testing
        $empUser = \App\Models\User::create([
            'name' => 'John Doe',
            'email' => 'employee@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
        ]);

        \App\Models\Employee::create([
            'user_id' => $empUser->id,
            'department_id' => 2, // IT
            'role' => 'Software Engineer',
            'phone' => '1234567890',
            'joining_date' => '2023-01-01',
            'salary' => 60000.00
        ]);
    }
}
