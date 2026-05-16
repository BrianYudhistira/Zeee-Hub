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
        Schema::create('balance_track', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('description')->nullable();
            $table->integer('category')->default(9);
            $table->bigInteger('amount');
            $table->integer('type');
            $table->boolean('cash');
            $table->dateTime("transaction_date");
            $table->softDeletes();

            $table->timestamps();
            $table->index(['user_id', 'transaction_date', 'type']);
        });

        // Schema::create('balance_summary', function (Blueprint $table) {
        //     $table->id();
        //     $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        //     $table->decimal('total_pengeluaran', 20, 2)->default(0);
        //     $table->decimal('total_pendapatan', 20, 2)->default(0);
        //     $table->decimal('total_transfer', 20, 2)->default(0);
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('balance_track');
        Schema::dropIfExists('balance_summary');
    }
};
