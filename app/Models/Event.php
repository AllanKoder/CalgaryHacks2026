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
        'is_public',
        'title',
        'focus',
        'description',
        'emotional_severity',
        'triggers',
        'occurred_at',
        'context',
        'impact',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'emotional_severity' => 'integer',
        'occurred_at' => 'date',
        'context' => 'array',
        'impact' => 'array',
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

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
