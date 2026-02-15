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
<<<<<<< HEAD:database/migrations/2026_02_15_055257_rename_goal_to_focus_in_events_table.php
        if (Schema::hasColumn('events', 'goal')) {
                  Schema::table('events', function (Blueprint $table) {
                      $table->renameColumn('goal', 'focus');
                  });
              } else {
                  // If goal doesn't exist, just add focus
                  Schema::table('events', function (Blueprint $table) {
                      $table->string('focus')->nullable();
                  });
              }
=======
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('is_public')->default(false)->after('user_id');
        });
>>>>>>> ac1ba35ed867a407806228c8355b26d4dcc5cde0:database/migrations/2026_02_15_060852_add_is_public_to_events_table.php
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
<<<<<<< HEAD:database/migrations/2026_02_15_055257_rename_goal_to_focus_in_events_table.php
        if (Schema::hasColumn('events', 'focus')) {
                    Schema::table('events', function (Blueprint $table) {
                        $table->renameColumn('focus', 'goal');
                    });
                }
=======
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('is_public');
        });
>>>>>>> ac1ba35ed867a407806228c8355b26d4dcc5cde0:database/migrations/2026_02_15_060852_add_is_public_to_events_table.php
    }
};
