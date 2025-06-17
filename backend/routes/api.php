<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ImageController;

Route::middleware(['auth:sanctum'])
    ->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::apiResource('/images', ImageController::class)
            ->only(['index', 'store', 'destroy']);

    });
