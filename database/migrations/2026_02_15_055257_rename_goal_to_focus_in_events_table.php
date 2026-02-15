<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        if (Schema::hasColumn('events', 'focus')) {
                    Schema::table('events', function (Blueprint $table) {
                        $table->renameColumn('focus', 'goal');
                    });
                }
    }
};
