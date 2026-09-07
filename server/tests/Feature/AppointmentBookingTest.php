<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Enums\SlotStatus;
use App\Models\Appointment;
use App\Models\Slot;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\SlotSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class AppointmentBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_fetch_available_slots_filtered_by_date()
    {
        $today = Carbon::today()->format('Y-m-d');

        $slotToday = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::today()->setHour(10),
            'end_time'   => Carbon::today()->setHour(11),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        $slotTomorrow = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(10),
            'end_time'   => Carbon::tomorrow()->setHour(11),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        $response = $this->getJson("/api/slots?date={$today}");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $slotToday->id);
    }

    public function test_user_can_book_an_available_slot()
    {
        $slot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(14),
            'end_time'   => Carbon::tomorrow()->setHour(15),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        $response = $this->postJson('/api/appointments', [
            'slot_id' => $slot->id,
            'name'    => 'John Doe',
            'email'   => 'JOHN@Example.com ',
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('data.slot.id', $slot->id);
        $response->assertJsonPath('data.user.email', 'john@example.com');
        $response->assertJsonPath('data.status', 'CONFIRMED');

        $this->assertDatabaseHas('slots', [
            'id'     => $slot->id,
            'status' => 'BOOKED',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name'  => 'John Doe',
        ]);

        $this->assertDatabaseHas('appointments', [
            'slot_id' => $slot->id,
            'status'  => 'CONFIRMED',
        ]);
    }

    public function test_already_booked_slot_returns_409_conflict()
    {
        $slot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(11),
            'end_time'   => Carbon::tomorrow()->setHour(12),
            'status'     => SlotStatus::BOOKED->value,
        ]);

        $response = $this->postJson('/api/appointments', [
            'slot_id' => $slot->id,
            'name'    => 'Jane Doe',
            'email'   => 'jane@example.com',
        ]);

        $response->assertStatus(409);
        $response->assertJsonPath('code', 'SLOT_ALREADY_BOOKED');
    }

    public function test_concurrent_booking_attempts_allow_only_one_successful_booking()
    {
        $slot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(16),
            'end_time'   => Carbon::tomorrow()->setHour(17),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        // First attempt successfully books
        $response1 = $this->postJson('/api/appointments', [
            'slot_id' => $slot->id,
            'name'    => 'User One',
            'email'   => 'user1@example.com',
        ]);
        $response1->assertStatus(201);

        // Second attempt on the same slot must fail with 409 Conflict
        $response2 = $this->postJson('/api/appointments', [
            'slot_id' => $slot->id,
            'name'    => 'User Two',
            'email'   => 'user2@example.com',
        ]);

        $response2->assertStatus(409);
        $response2->assertJsonPath('code', 'SLOT_ALREADY_BOOKED');

        // Confirm database integrity: exactly 1 appointment for slot
        $this->assertDatabaseCount('appointments', 1);
        $this->assertDatabaseHas('slots', [
            'id'     => $slot->id,
            'status' => 'BOOKED',
        ]);
    }

    public function test_user_can_retrieve_their_appointments()
    {
        $user = User::create([
            'name'  => 'Alice Smith',
            'email' => 'alice@example.com',
        ]);

        $futureSlot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(9),
            'end_time'   => Carbon::tomorrow()->setHour(10),
            'status'     => SlotStatus::BOOKED->value,
        ]);

        $pastSlot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::yesterday()->setHour(9),
            'end_time'   => Carbon::yesterday()->setHour(10),
            'status'     => SlotStatus::BOOKED->value,
        ]);

        $upcomingApp = Appointment::create([
            'id'      => (string) Str::uuid(),
            'slot_id' => $futureSlot->id,
            'user_id' => $user->id,
            'status'  => AppointmentStatus::CONFIRMED->value,
        ]);

        $pastApp = Appointment::create([
            'id'      => (string) Str::uuid(),
            'slot_id' => $pastSlot->id,
            'user_id' => $user->id,
            'status'  => AppointmentStatus::CONFIRMED->value,
        ]);

        $response = $this->getJson('/api/appointments?email=ALICE@example.com');

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data.upcoming');
        $response->assertJsonCount(1, 'data.past');
        $response->assertJsonPath('data.upcoming.0.id', $upcomingApp->id);
        $response->assertJsonPath('data.past.0.id', $pastApp->id);
    }

    public function test_user_can_cancel_an_appointment()
    {
        $user = User::create(['name' => 'Bob', 'email' => 'bob@example.com']);
        $slot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(10),
            'end_time'   => Carbon::tomorrow()->setHour(11),
            'status'     => SlotStatus::BOOKED->value,
        ]);

        $appointment = Appointment::create([
            'id'      => (string) Str::uuid(),
            'slot_id' => $slot->id,
            'user_id' => $user->id,
            'status'  => AppointmentStatus::CONFIRMED->value,
        ]);

        $response = $this->patchJson("/api/appointments/{$appointment->id}/cancel", [
            'cancellation_reason' => 'Schedule conflict',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.status', 'CANCELLED');
        $response->assertJsonPath('data.cancellation_reason', 'Schedule conflict');

        // Verify slot automatically reopened
        $this->assertDatabaseHas('slots', [
            'id'     => $slot->id,
            'status' => 'AVAILABLE',
        ]);

        $this->assertDatabaseHas('appointments', [
            'id'     => $appointment->id,
            'status' => 'CANCELLED',
        ]);
    }

    public function test_cancelled_appointment_cannot_be_cancelled_again()
    {
        $user = User::create(['name' => 'Charlie', 'email' => 'charlie@example.com']);
        $slot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(12),
            'end_time'   => Carbon::tomorrow()->setHour(13),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        $appointment = Appointment::create([
            'id'                  => (string) Str::uuid(),
            'slot_id'             => $slot->id,
            'user_id'             => $user->id,
            'status'              => AppointmentStatus::CANCELLED->value,
            'cancellation_reason' => 'Prior cancellation',
        ]);

        $response = $this->patchJson("/api/appointments/{$appointment->id}/cancel", []);

        $response->assertStatus(409);
        $response->assertJsonPath('code', 'ALREADY_CANCELLED');
    }

    public function test_past_appointment_cannot_be_cancelled()
    {
        $user = User::create(['name' => 'Dave', 'email' => 'dave@example.com']);
        $pastSlot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::yesterday()->setHour(14),
            'end_time'   => Carbon::yesterday()->setHour(15),
            'status'     => SlotStatus::BOOKED->value,
        ]);

        $appointment = Appointment::create([
            'id'      => (string) Str::uuid(),
            'slot_id' => $pastSlot->id,
            'user_id' => $user->id,
            'status'  => AppointmentStatus::CONFIRMED->value,
        ]);

        $response = $this->patchJson("/api/appointments/{$appointment->id}/cancel", []);

        $response->assertStatus(409);
        $response->assertJsonPath('code', 'PAST_APPOINTMENT');
    }

    public function test_past_slot_cannot_be_booked()
    {
        $pastSlot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::yesterday()->setHour(10),
            'end_time'   => Carbon::yesterday()->setHour(11),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        $response = $this->postJson('/api/appointments', [
            'slot_id' => $pastSlot->id,
            'name'    => 'Eve',
            'email'   => 'eve@example.com',
        ]);

        $response->assertStatus(409);
    }

    public function test_invalid_email_fails_validation()
    {
        $slot = Slot::create([
            'id'         => (string) Str::uuid(),
            'start_time' => Carbon::tomorrow()->setHour(10),
            'end_time'   => Carbon::tomorrow()->setHour(11),
            'status'     => SlotStatus::AVAILABLE->value,
        ]);

        $response = $this->postJson('/api/appointments', [
            'slot_id' => $slot->id,
            'name'    => 'Frank',
            'email'   => 'not-an-email',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_invalid_slot_returns_appropriate_error()
    {
        $response = $this->postJson('/api/appointments', [
            'slot_id' => (string) Str::uuid(),
            'name'    => 'Grace',
            'email'   => 'grace@example.com',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['slot_id']);
    }

    public function test_rerunning_slot_seeder_does_not_create_duplicates()
    {
        $this->seed(SlotSeeder::class);
        $initialCount = Slot::count();
        $this->assertEquals(56, $initialCount);

        // Re-run seeder
        $this->seed(SlotSeeder::class);
        $secondCount = Slot::count();

        $this->assertEquals(56, $secondCount);
    }
}
