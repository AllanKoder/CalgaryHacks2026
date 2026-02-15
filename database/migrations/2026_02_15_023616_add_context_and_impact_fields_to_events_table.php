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
        Schema::table('events', function (Blueprint $table) {
            // Context fields
            $table->text('location')->nullable();
            $table->text('people_present')->nullable();
            $table->text('power_dynamics')->nullable();
            $table->text('what_happened_before')->nullable();
            $table->text('mental_emotional_state')->nullable();
            $table->text('organizational_pressures')->nullable();
            
            // Impact fields
            $table->text('directly_affected')->nullable();
            $table->text('indirectly_affected')->nullable();
            $table->text('immediate_consequences')->nullable();
            $table->text('longer_term_consequences')->nullable();
            $table->integer('impact_significance')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'location',
                'people_present',
                'power_dynamics',
                'what_happened_before',
                'mental_emotional_state',
                'organizational_pressures',
                'directly_affected',
                'indirectly_affected',
                'immediate_consequences',
                'longer_term_consequences',
                'impact_significance',
            ]);
        });
    }
};
