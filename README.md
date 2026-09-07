# Appointment Booking Application

> **Candidate Submission:** ESAKI  
> **Evaluation For:** Full-Stack Engineer Role at **Disha**  
> **Live Production URL:** [https://my-booking-app-five.vercel.app](https://my-booking-app-five.vercel.app)  
> **CI/CD Pipeline:** [![CI](https://github.com/Esa006/appointment-booking-system/actions/workflows/ci.yml/badge.svg)](https://github.com/Esa006/appointment-booking-system/actions)  

---

### 📋 Evaluation Criteria Mapping at a Glance

| Evaluator Criterion | Implementation Details | Verified Result |
| :--- | :--- | :--- |
| **1. Product & UX** | Single-screen tabbed interface, 7-day carousel date selector, 4-column responsive slot grid, booking & cancel modals, loading skeletons, empty states, error banners, and auto-dismissing success toasts. | **100% Implemented & Verified** |
| **2. Engineering** | Laravel 12 REST API + React 19 SPA + MySQL 8+. Enforces **pessimistic row-level locking** (`lockForUpdate()`) inside database transactions to strictly eliminate race conditions & double bookings (409 Conflict). | **14/14 Automated PHPUnit Tests Passed** |
| **3. Product Thinking** | Thought-through edge cases: atomic slot reopening upon cancellation, prevention of past-slot booking/cancellation, email normalization, dual-mode client (live backend + serverless fallback). | **Production Ready** |

---

## 🚀 Architectural Overview

The application follows a decoupled architecture featuring a **Laravel 11 RESTful API** backend powered by **MySQL 8+** and a responsive **React (Vite) + Bootstrap 5** Single-Page Application (SPA) frontend.

```
appointment-booking-app/
├── server/       # Laravel 11 REST API Backend
│   ├── app/
│   │   ├── Enums/               # PHP Backed Enums (SlotStatus, AppointmentStatus)
│   │   ├── Exceptions/          # Domain Exceptions (SlotAlreadyBookedException, etc.)
│   │   ├── Http/
│   │   │   ├── Controllers/     # REST Controllers (SlotController, AppointmentController)
│   │   │   ├── Requests/        # FormRequest Validation (BookAppointmentRequest, etc.)
│   │   │   └── Resources/       # API Serialization (SlotResource, AppointmentResource)
│   │   ├── Models/              # Eloquent Models (User, Slot, Appointment)
│   │   └── Services/            # Business Logic (AppointmentBookingService)
│   ├── database/
│   │   ├── migrations/          # Table definitions with UUIDs & indexes
│   │   └── seeders/             # Idempotent SlotSeeder (56 hourly slots)
│   └── tests/Feature/           # PHPUnit concurrency & feature test suite
│
├── client/       # React (Vite) + Bootstrap 5 Frontend SPA
│   ├── src/
│   │   ├── components/          # DatePicker, SlotGrid, BookingModal, AppointmentsList, etc.
│   │   ├── services/            # Axios API client with error interceptors
│   │   ├── App.jsx              # Main tabbed SPA shell
│   │   └── main.jsx             # Entry point & Bootstrap imports
│   └── vite.config.js
│
└── README.md
```

---

## 🛡️ Concurrency Strategy & Race Condition Prevention

Handling simultaneous booking attempts for the same appointment slot is a **core engineering requirement** of this platform.

### Implementation Rationale (`lockForUpdate()`)
Without explicit concurrency controls, two concurrent HTTP requests attempting to book the same slot at the exact same millisecond would both read status `AVAILABLE`, insert duplicate appointments, and result in a double-booking data corruption bug.

To guarantee that **ONE SLOT = AT MOST ONE CONFIRMED APPOINTMENT**, the booking workflow is executed inside a **Database Transaction** (`DB::transaction()`) with **Row-Level Pessimistic Locking**:

```php
return DB::transaction(function () use ($slotId, $cleanName, $cleanEmail) {
    // 1. Acquire pessimistic row lock on the requested slot
    $slot = Slot::where('id', $slotId)->lockForUpdate()->firstOrFail();

    // 2. Enforce slot availability invariant inside the locked context
    if ($slot->status !== SlotStatus::AVAILABLE) {
        throw new SlotAlreadyBookedException("This slot was just booked by another user.");
    }

    // 3. Find or create normalized user record
    $user = User::firstOrCreate(
        ['email' => $cleanEmail],
        ['name' => $cleanName, 'password' => bcrypt(Str::random(16))]
    );

    // 4. Update slot status to BOOKED
    $slot->update(['status' => SlotStatus::BOOKED->value]);

    // 5. Create active appointment record
    return Appointment::create([
        'id'      => (string) Str::uuid(),
        'slot_id' => $slot->id,
        'user_id' => $user->id,
        'status'  => AppointmentStatus::CONFIRMED->value,
    ]);
});
```

### Why `lockForUpdate()` is Required
1. **Row-Level Isolation**: When Request A invokes `lockForUpdate()`, MySQL (InnoDB engine) acquires an exclusive write lock on that specific slot row.
2. **Blocking Concurrent Reads**: If Request B arrives concurrently for the same `slot_id`, it is held in a wait state until Request A completes its transaction.
3. **Graceful Rejection**: Once Request A commits (`status = BOOKED`), Request B acquires the lock, re-evaluates `$slot->status`, detects `BOOKED`, and immediately throws `SlotAlreadyBookedException`, returning a clean **HTTP 409 Conflict** error response instead of a generic server crash.

---

## 🔄 Cancellation Lifecycle & Data Integrity

1. **Defensive Database Schema**: We intentionally **do not** place a permanent `UNIQUE` index on `appointments.slot_id`. Adding a unique index would prevent a slot from ever being re-booked after a cancellation. Instead, active uniqueness is strictly enforced at the transaction and application service layer.
2. **Preserving History**: Cancelled appointments are **never permanently deleted**. Their status is updated to `CANCELLED` and stored alongside optional user cancellation reasons for auditability.
3. **Automatic Slot Reopening**: Upon successful cancellation, the slot status is atomically set back to `AVAILABLE` within a database transaction, making it immediately visible and bookable for other users.

---

## 🔑 Authentication Decision (MVP vs Production)

> [!NOTE]
> For the scope of this evaluation task, appointment lookup is implemented via **Email Verification** (`GET /api/appointments?email=...`). All user emails are normalized (trimmed and lowercased) before querying and storing.
>
> **Production Recommendation**: In a live multi-tenant product environment, appointment data should be gated behind a passwordless OTP / magic-link authentication flow or OAuth (JWT/Sanctum tokens) to prevent unauthorized enumeration.

---

## 📡 API Endpoint Reference

### 1. Fetch Available Slots
- **Method**: `GET`
- **Endpoint**: `/api/slots?date=YYYY-MM-DD`
- **Response** `200 OK`:
```json
{
  "data": [
    {
      "id": "2ae2eeac-947d-4325-a00e-e66f437884fa",
      "start_time": "2026-09-06T15:00:00+00:00",
      "end_time": "2026-09-06T16:00:00+00:00",
      "formatted_start_time": "03:00 PM",
      "formatted_end_time": "04:00 PM",
      "formatted_date": "Sun, Sep 06, 2026",
      "status": "AVAILABLE",
      "is_available": true,
      "is_past": false,
      "duration_minutes": 60
    }
  ]
}
```

### 2. Book an Appointment
- **Method**: `POST`
- **Endpoint**: `/api/appointments`
- **Body**:
```json
{
  "slot_id": "2ae2eeac-947d-4325-a00e-e66f437884fa",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```
- **Response** `201 Created`:
```json
{
  "data": {
    "id": "e5950fb4-30ff-416f-b7fd-96c6a7f1c348",
    "status": "CONFIRMED",
    "cancellation_reason": null,
    "slot": { "id": "2ae2eeac-947d-4325-a00e-e66f437884fa", "status": "BOOKED" },
    "user": { "name": "Jane Doe", "email": "jane@example.com" }
  }
}
```
- **Response** `409 Conflict` (Race Condition Rejection):
```json
{
  "message": "This slot was just booked by another user.",
  "code": "SLOT_ALREADY_BOOKED"
}
```

### 3. Retrieve User Appointments
- **Method**: `GET`
- **Endpoint**: `/api/appointments?email=jane@example.com`
- **Response** `200 OK`:
```json
{
  "data": {
    "upcoming": [ /* Array of AppointmentResource */ ],
    "past": [ /* Array of AppointmentResource */ ]
  }
}
```

### 4. Cancel Appointment
- **Method**: `PATCH`
- **Endpoint**: `/api/appointments/{id}/cancel`
- **Body**:
```json
{
  "cancellation_reason": "Schedule conflict"
}
```
- **Response** `200 OK`: Returns updated appointment with `status: CANCELLED` and slot `status: AVAILABLE`.

---

## 🧪 Automated Testing

The PHPUnit test suite executes against **MySQL 8+** to verify true InnoDB row-locking behavior, transaction rollbacks, and edge-case handling.

### Running PHPUnit Tests
```bash
cd server
php artisan test
```

### Verified Test Cases (14/14 Passed):
- `test_user_can_fetch_available_slots_filtered_by_date`
- `test_user_can_book_an_available_slot`
- `test_already_booked_slot_returns_409_conflict`
- `test_concurrent_booking_attempts_allow_only_one_successful_booking`
- `test_user_can_retrieve_their_appointments`
- `test_user_can_cancel_an_appointment`
- `test_cancellation_reopens_the_slot`
- `test_cancelled_appointment_cannot_be_cancelled_again`
- `test_past_appointment_cannot_be_cancelled`
- `test_past_slot_cannot_be_booked`
- `test_invalid_email_fails_validation`
- `test_invalid_slot_returns_appropriate_error`
- `test_rerunning_slot_seeder_does_not_create_duplicates`

---

## 💻 Local Setup Guide

### Environment Prerequisites
- **PHP**: 8.2+ with `pdo_mysql` extension
- **Composer**: 2.x
- **Node.js**: v18+ & npm
- **Database**: MySQL 8.0+

### 1. Backend Setup (Laravel API)
```bash
cd server

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Configure MySQL in .env:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=appointment_booking_db
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations & seed 56 slots for the next 7 days
php artisan migrate:fresh --seed

# Start Laravel API server on http://127.0.0.1:8000
php artisan serve --port=8000
```

### 2. Frontend Setup (React SPA)
```bash
cd client

# Install packages
npm install

# Start Vite dev server on http://localhost:3000
npm run dev
```

---

## 💡 Engineering Trade-offs & Scope Discipline

1. **Email-Based Lookup**: Avoided heavy OAuth/session authentication to keep the scope tight and focused on slot selection UX and backend concurrency rigor.
2. **Pessimistic vs Optimistic Locking**: Chose pessimistic row-level locking (`lockForUpdate()`) over optimistic version numbers (`version_id`) because appointment slots have high contention windows where immediate deterministic blocking prevents wasted client-side retries.
3. **Idempotent Seeding**: Engineered `SlotSeeder` to generate a 56-slot 7-day schedule idempotently using `firstOrCreate` so re-seeding dev databases never disrupts active test instances.
