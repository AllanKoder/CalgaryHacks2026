<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mistake extends Model
{
    /** @use HasFactory<\Database\Factories\MistakeFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'description',
        'emotional_severity',
        'analysis',
    ];

    protected $casts = [
        'emotional_severity' => 'integer',
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
