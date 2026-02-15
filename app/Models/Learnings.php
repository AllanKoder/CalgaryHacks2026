<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Learnings extends Model
{
    /** @use HasFactory<\Database\Factories\LearningsFactory> */
    use HasFactory;

    protected $fillable = [
        'mistake_id',
        'action_plan',
        'next_time_strategy',
        'resources',
    ];

    public function mistake()
    {
        return $this->belongsTo(Mistake::class);
    }
}
