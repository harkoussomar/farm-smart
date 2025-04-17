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
        Schema::table('farm_profiles', function (Blueprint $table) {
            // Make primary_crops column nullable since it's no longer required
            $table->json('primary_crops')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('farm_profiles', function (Blueprint $table) {
            // Revert back to required
            $table->json('primary_crops')->nullable(false)->change();
        });
    }
};
