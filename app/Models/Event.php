<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'emotional_severity',
        'triggers',
        'occurred_at',
        // Context fields
        'location',
        'people_present',
        'power_dynamics',
        'what_happened_before',
        'mental_emotional_state',
        'organizational_pressures',
        // Impact fields
        'directly_affected',
        'indirectly_affected',
        'immediate_consequences',
        'longer_term_consequences',
        'impact_significance',
    ];

    protected $casts = [
        'emotional_severity' => 'integer',
        'impact_significance' => 'integer',
        'occurred_at' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function identification()
    {
        return $this->hasOne(Identification::class);
    }

    public function learning()
    {
        return $this->hasOne(Learnings::class);
    }
}
