<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Enums\SlotStatus;
use App\Exceptions\AppointmentCancellationException;
use App\Exceptions\SlotAlreadyBookedException;
use App\Models\Appointment;
use App\Models\Slot;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AppointmentBookingService
{
    /**
     * Fetch slots for a given date (YYYY-MM-DD).
     */
    public function getSlotsByDate(string $dateString): Collection
    {
        $date = Carbon::parse($dateString)->format('Y-m-d');

        return Slot::whereDate('start_time', $date)
            ->orderBy('start_time', 'asc')
            ->get();
    }

    /**
     * Book an appointment with pessimistic row-level locking to prevent race conditions.
     *
     * @throws SlotAlreadyBookedException
     */
    public function bookSlot(string $slotId, string $name, string $email): Appointment
    {
        $cleanEmail = strtolower(trim($email));
        $cleanName = trim($name);

        return DB::transaction(function () use ($slotId, $cleanName, $cleanEmail) {
            // 1. Pessimistic row-level lock on the requested slot row
            $slot = Slot::where('id', $slotId)->lockForUpdate()->firstOrFail();

            // 2. Check slot status availability
            $statusValue = $slot->status instanceof SlotStatus ? $slot->status->value : $slot->status;
            if ($statusValue !== SlotStatus::AVAILABLE->value) {
                throw new SlotAlreadyBookedException("This slot was just booked by another user.");
            }

            // 3. Check if slot start_time is in the past
            if ($slot->start_time->isPast()) {
                throw new SlotAlreadyBookedException("Past slots cannot be booked.");
            }

            // 4. Find or create normalized user record
            $user = User::firstOrCreate(
                ['email' => $cleanEmail],
                ['name' => $cleanName, 'password' => bcrypt(Str::random(16))]
            );

            // 5. Update slot status to BOOKED
            $slot->update(['status' => SlotStatus::BOOKED->value]);

            // 6. Create active appointment record
            $appointment = Appointment::create([
                'id'      => (string) Str::uuid(),
                'slot_id' => $slot->id,
                'user_id' => $user->id,
                'status'  => AppointmentStatus::CONFIRMED->value,
            ]);

            return $appointment->load(['slot', 'user']);
        });
    }

    /**
     * Retrieve upcoming and past appointments for a given normalized email.
     */
    public function getAppointmentsByEmail(string $email): array
    {
        $cleanEmail = strtolower(trim($email));

        $user = User::where('email', $cleanEmail)->first();
        if (!$user) {
            return ['upcoming' => [], 'past' => []];
        }

        $allAppointments = Appointment::where('user_id', $user->id)
            ->with(['slot', 'user'])
            ->get()
            ->sortByDesc(fn($app) => $app->slot ? $app->slot->start_time->timestamp : $app->created_at->timestamp);

        $now = Carbon::now();
        $upcoming = [];
        $past = [];

        foreach ($allAppointments as $appointment) {
            if ($appointment->slot && $appointment->slot->start_time->greaterThanOrEqualTo($now)) {
                $upcoming[] = $appointment;
            } else {
                $past[] = $appointment;
            }
        }

        return [
            'upcoming' => array_values($upcoming),
            'past'     => array_values($past),
        ];
    }

    /**
     * Cancel an appointment and automatically reopen the slot inside a transaction.
     *
     * @throws AppointmentCancellationException
     */
    public function cancelAppointment(string $appointmentId, ?string $reason = null): Appointment
    {
        return DB::transaction(function () use ($appointmentId, $reason) {
            // 1. Lock appointment row
            $appointment = Appointment::where('id', $appointmentId)->lockForUpdate()->firstOrFail();

            $statusValue = $appointment->status instanceof AppointmentStatus ? $appointment->status->value : $appointment->status;

            // 2. Edge case: Already cancelled
            if ($statusValue === AppointmentStatus::CANCELLED->value) {
                throw new AppointmentCancellationException("Appointment is already cancelled.", 409, "ALREADY_CANCELLED");
            }

            // 3. Lock associated slot row
            $slot = Slot::where('id', $appointment->slot_id)->lockForUpdate()->firstOrFail();

            // 4. Edge case: Past appointment
            if ($slot->start_time->isPast()) {
                throw new AppointmentCancellationException("Past appointments cannot be cancelled.", 409, "PAST_APPOINTMENT");
            }

            // 5. Update appointment status to CANCELLED
            $appointment->update([
                'status'              => AppointmentStatus::CANCELLED->value,
                'cancellation_reason' => $reason ? trim($reason) : null,
            ]);

            // 6. Reopen slot status to AVAILABLE
            $slot->update(['status' => SlotStatus::AVAILABLE->value]);

            return $appointment->load(['slot', 'user']);
        });
    }
}
