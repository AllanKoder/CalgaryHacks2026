<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identification extends Model
{
    /** @use HasFactory<\Database\Factories\IdentificationFactory> */
    use HasFactory;

    protected $fillable = [
        'event_id',
        'tag',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
