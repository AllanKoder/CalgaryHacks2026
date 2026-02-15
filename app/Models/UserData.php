<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserData extends Model
{
    /** @use HasFactory<\Database\Factories\UserDataFactory> */
    use HasFactory;

    protected $table = 'user_data';

    protected $fillable = [
        'user_id',
        'EmotionalMastery',
        'CognitiveClarity',
        'SocialRelational',
        'PhysicalHealth',
        'EthicalMoral',
        'IdentityGrowth',
    ];

    protected $casts = [
        'EmotionalMastery' => 'integer',
        'CognitiveClarity' => 'integer',
        'SocialRelational' => 'integer',
        'PhysicalHealth' => 'integer',
        'EthicalMoral' => 'integer',
        'IdentityGrowth' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
