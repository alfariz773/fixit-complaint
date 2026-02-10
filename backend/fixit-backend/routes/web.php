<?php
Route::get('/password/reset/{token}', function () {
    return response()->json([
        'message' => 'Use frontend reset password page'
    ]);
})->name('password.reset');
