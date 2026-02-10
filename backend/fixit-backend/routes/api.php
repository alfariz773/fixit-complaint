<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\ResetPasswordController;

use App\Http\Controllers\Api\Admin\ComplaintController as AdminComplaintController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| PASSWORD RESET ROUTES (PUBLIC)
|--------------------------------------------------------------------------
*/

Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);

/*
|--------------------------------------------------------------------------
| USER COMPLAINT ROUTES (AUTHENTICATED USER)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/complaints', [ComplaintController::class, 'index']);
    Route::post('/complaints', [ComplaintController::class, 'store']);
    Route::get('/complaints/{id}', [ComplaintController::class, 'show']);
    Route::put('/complaints/{id}', [ComplaintController::class, 'update']);
    Route::delete('/complaints/{id}', [ComplaintController::class, 'destroy']);

});

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES (AUTH + ROLE = ADMIN)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:admin'])
    ->prefix('admin')
    ->group(function () {

        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

        Route::get('/complaints', [AdminComplaintController::class, 'index']);
        Route::get('/complaints/{id}', [AdminComplaintController::class, 'show']);
        Route::put('/complaints/{id}', [AdminComplaintController::class, 'update']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::put('/users/{id}/status', [AdminUserController::class, 'updateStatus']);
});


