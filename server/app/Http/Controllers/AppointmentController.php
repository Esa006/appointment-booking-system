<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookAppointmentRequest;
use App\Http\Requests\CancelAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Services\AppointmentBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        protected AppointmentBookingService $bookingService
    ) {}

    /**
     * POST /api/appointments
     */
    public function store(BookAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->bookingService->bookSlot(
            $request->slot_id,
            $request->name,
            $request->email
        );

        return (new AppointmentResource($appointment))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/appointments?email=john@example.com
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $appointments = $this->bookingService->getAppointmentsByEmail($request->query('email'));

        return response()->json([
            'data' => [
                'upcoming' => AppointmentResource::collection($appointments['upcoming']),
                'past'     => AppointmentResource::collection($appointments['past']),
            ],
        ]);
    }

    /**
     * PATCH /api/appointments/{id}/cancel
     */
    public function cancel(CancelAppointmentRequest $request, string $id): AppointmentResource
    {
        $appointment = $this->bookingService->cancelAppointment(
            $id,
            $request->cancellation_reason
        );

        return new AppointmentResource($appointment);
    }
}
