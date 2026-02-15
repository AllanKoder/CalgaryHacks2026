<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Learnings extends Model
{
    /** @use HasFactory<\Database\Factories\LearningsFactory> */
    use HasFactory;

    protected $fillable = [
        'event_id',
        'action_plan',
        'next_time_strategy',
        'resources',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
