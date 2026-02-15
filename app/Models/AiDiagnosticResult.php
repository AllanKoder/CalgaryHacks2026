<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiDiagnosticResult extends Model
{
    protected $fillable = [
        'user_id',
        'event_id',
        'label_scores',
        'sublabel_scores',
        'summary',
        'overall_score',
        'conversation_length',
    ];

    protected $casts = [
        'label_scores' => 'array',
        'sublabel_scores' => 'array',
        'summary' => 'array',
        'overall_score' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
