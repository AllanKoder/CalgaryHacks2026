<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ai_diagnostic_results', function (Blueprint $table) {
            $table->text('user_input')->nullable()->after('conversation_length');
            $table->text('ai_question')->nullable()->after('user_input');
            $table->text('user_answer')->nullable()->after('ai_question');
        });
    }

    public function down(): void
    {
        Schema::table('ai_diagnostic_results', function (Blueprint $table) {
            $table->dropColumn(['user_input', 'ai_question', 'user_answer']);
        });
    }
};
