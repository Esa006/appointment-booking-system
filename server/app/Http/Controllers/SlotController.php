<?php

namespace App\Http\Controllers;

use App\Http\Resources\SlotResource;
use App\Services\AppointmentBookingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SlotController extends Controller
{
    public function __construct(
        protected AppointmentBookingService $bookingService
    ) {}

    /**
     * GET /api/slots?date=YYYY-MM-DD
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $dateString = $request->query('date', Carbon::today()->format('Y-m-d'));

        $slots = $this->bookingService->getSlotsByDate($dateString);

        return SlotResource::collection($slots);
    }
}
