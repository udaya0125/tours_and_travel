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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->foreignId('country_id')->constrained()->onDelete('cascade');
            $table->foreignId('sub_category_id')->nullable()->constrained()->onDelete('cascade');
            $table->longText('short_description')->nullable();    
            $table->longText('long_description')->nullable();
            $table->longText('include')->nullable();
            $table->longText('exclude')->nullable();
            $table->longText('highlight')->nullable();
            $table->string('duration')->nullable();
            $table->string('difficulty')->nullable();
            $table->string('max_altitude')->nullable();
            $table->string('best_season')->nullable();
            $table->string('accommodation')->nullable();
            $table->string('meals')->nullable();
            $table->string('start_point')->nullable();
            $table->string('end_point')->nullable();
            $table->string('price')->nullable();
            $table->string('slug')->unique();    
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
