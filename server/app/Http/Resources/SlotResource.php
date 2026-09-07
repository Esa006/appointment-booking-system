<?php

namespace App\Http\Resources;

use App\Enums\SlotStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SlotResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $statusValue = $this->status instanceof SlotStatus ? $this->status->value : $this->status;
        $isAvailable = $statusValue === SlotStatus::AVAILABLE->value;
        $isPast = $this->start_time->isPast();

        return [
            'id'                   => $this->id,
            'start_time'           => $this->start_time->toIso8601String(),
            'end_time'             => $this->end_time->toIso8601String(),
            'formatted_start_time' => $this->start_time->format('h:i A'),
            'formatted_end_time'   => $this->end_time->format('h:i A'),
            'formatted_date'       => $this->start_time->format('D, M d, Y'),
            'status'               => $statusValue,
            'is_available'         => $isAvailable && !$isPast,
            'is_past'              => $isPast,
            'duration_minutes'     => (int) $this->start_time->diffInMinutes($this->end_time),
        ];
    }
}
