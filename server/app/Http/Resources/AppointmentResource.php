<?php

namespace App\Http\Resources;

use App\Enums\AppointmentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusValue = $this->status instanceof AppointmentStatus ? $this->status->value : $this->status;

        return [
            'id'                  => $this->id,
            'status'              => $statusValue,
            'cancellation_reason' => $this->cancellation_reason,
            'created_at'          => $this->created_at?->toIso8601String(),
            'slot'                => new SlotResource($this->whenLoaded('slot', $this->slot)),
            'user'                => [
                'id'    => $this->user->id ?? null,
                'name'  => $this->user->name ?? null,
                'email' => $this->user->email ?? null,
            ],
            'is_upcoming'         => $this->slot ? $this->slot->start_time->isFuture() : false,
        ];
    }
}
