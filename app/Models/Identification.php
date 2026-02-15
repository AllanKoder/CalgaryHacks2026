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
        'main_category',
        'sub_category',
        'assumptions',
        'pattern_recognition',
    ];

    protected $casts = [
        'assumptions' => 'array',
        'pattern_recognition' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
