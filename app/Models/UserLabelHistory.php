<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLabelHistory extends Model
{
    /** @use HasFactory<\Database\Factories\UserLabelHistoryFactory> */
    use HasFactory;

    protected $table = 'user_label_history';

    protected $fillable = [
        'user_id',
        'label_key',
        'recorded_at',
        'score',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'score' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
