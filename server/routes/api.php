<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SlotController;
use Illuminate\Support\Facades\Route;

Route::get('/slots', [SlotController::class, 'index']);
Route::post('/appointments', [AppointmentController::class, 'store']);
Route::get('/appointments', [AppointmentController::class, 'index']);
Route::patch('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);
