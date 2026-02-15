<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_label_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('label_key', 64);
            $table->dateTimeTz('recorded_at');
            $table->decimal('score', 5, 2);
            $table->timestamps();

            $table->unique(['user_id', 'label_key', 'recorded_at']);
            $table->index(['user_id', 'label_key', 'recorded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_label_history');
    }
};
