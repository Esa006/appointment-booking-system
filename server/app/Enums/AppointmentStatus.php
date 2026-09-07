<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case CONFIRMED = 'CONFIRMED';
    case CANCELLED = 'CANCELLED';
}
