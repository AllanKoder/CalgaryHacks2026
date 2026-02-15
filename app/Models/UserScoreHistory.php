<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserScoreHistory extends Model
{
    /** @use HasFactory<\Database\Factories\UserScoreHistoryFactory> */
    use HasFactory;

    protected $table = 'user_score_history';

    protected $fillable = [
        'user_id',
        'recorded_at',
        'overall_score',
        'delta',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'overall_score' => 'float',
        'delta' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
