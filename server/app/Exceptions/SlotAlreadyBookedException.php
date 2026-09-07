<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class SlotAlreadyBookedException extends Exception
{
    public function __construct(string $message = "This slot was just booked by another user.")
    {
        parent::__construct($message, 409);
    }

    public function render($request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'code'    => 'SLOT_ALREADY_BOOKED',
        ], 409);
    }
}
