<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use App\Enums\SlotStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Slot extends Model
{
    use HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'start_time',
        'end_time',
        'status',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time'   => 'datetime',
        'status'     => SlotStatus::class,
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }

    public function activeAppointment(): HasOne
    {
        return $this->hasOne(Appointment::class)->where('status', AppointmentStatus::CONFIRMED->value);
    }

    public function appointments(): HasOne
    {
        return $this->hasOne(Appointment::class);
    }
}
