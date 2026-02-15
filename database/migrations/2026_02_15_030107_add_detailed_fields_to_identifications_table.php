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
        Schema::table('identifications', function (Blueprint $table) {
            $table->string('main_category')->nullable();
            $table->string('sub_category')->nullable();
            $table->json('assumptions')->nullable();
            $table->json('pattern_recognition')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('identifications', function (Blueprint $table) {
            $table->dropColumn(['main_category', 'sub_category', 'assumptions', 'pattern_recognition']);
        });
    }
};
