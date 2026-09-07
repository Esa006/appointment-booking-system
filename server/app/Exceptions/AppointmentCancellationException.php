<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class AppointmentCancellationException extends Exception
{
    protected string $errorCode;

    public function __construct(string $message, int $statusCode = 409, string $errorCode = 'CANCELLATION_FAILED')
    {
        $this->errorCode = $errorCode;
        parent::__construct($message, $statusCode);
    }

    public function render($request): JsonResponse
    {
        return response()->json([
            'message' => $this->getMessage(),
            'code'    => $this->errorCode,
        ], $this->getCode());
    }
}
