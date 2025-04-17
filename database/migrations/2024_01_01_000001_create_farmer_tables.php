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
        Schema::create('farm_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farmer_id')->constrained('users')->onDelete('cascade');
            $table->string('farm_name');
            $table->text('address');
            $table->decimal('latitude', 10, 6)->nullable();
            $table->decimal('longitude', 10, 6)->nullable();
            $table->decimal('size', 10, 2);
            $table->string('size_unit')->default('hectares');
            $table->timestamps();
        });

        Schema::create('farm_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('farm_profile_id')->constrained()->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->integer('file_size');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('farm_photos');
        Schema::dropIfExists('farm_profiles');
    }
};
