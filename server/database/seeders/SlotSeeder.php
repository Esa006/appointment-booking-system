<?php

namespace Database\Seeders;

use App\Enums\SlotStatus;
use App\Models\Slot;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Generates 8 hourly slots per day over the next 7 days (56 slots total).
     * Idempotent: re-running will not create duplicates.
     */
    public function run(): void
    {
        $today = Carbon::today();
        $hours = [
            [9, 10],
            [10, 11],
            [11, 12],
            [12, 13],
            [13, 14],
            [14, 15],
            [15, 16],
            [16, 17],
        ];

        for ($day = 0; $day < 7; $day++) {
            $currentDate = $today->copy()->addDays($day);

            foreach ($hours as [$startHour, $endHour]) {
                $startTime = $currentDate->copy()->setHour($startHour)->setMinute(0)->setSecond(0);
                $endTime = $currentDate->copy()->setHour($endHour)->setMinute(0)->setSecond(0);

                // Idempotent creation based on start_time
                Slot::firstOrCreate(
                    ['start_time' => $startTime->toDateTimeString()],
                    [
                        'id'         => (string) Str::uuid(),
                        'end_time'   => $endTime->toDateTimeString(),
                        'status'     => SlotStatus::AVAILABLE->value,
                    ]
                );
            }
        }
    }
}
