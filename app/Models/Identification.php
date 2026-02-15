<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Identification extends Model
{
    /** @use HasFactory<\Database\Factories\IdentificationFactory> */
    use HasFactory;

    protected $fillable = [
        'mistake_id',
        'tag',
    ];

    public function mistake()
    {
        return $this->belongsTo(Mistake::class);
    }
}
