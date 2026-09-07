<?php

namespace App\Enums;

enum SlotStatus: string
{
    case AVAILABLE = 'AVAILABLE';
    case BOOKED = 'BOOKED';
}
