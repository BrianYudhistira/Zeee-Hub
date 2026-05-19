<?php

namespace Database\Factories;

use App\Models\BalanceTrack;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BalanceTrackFactory extends Factory
{
    protected $model = BalanceTrack::class;

    /**
     * Define the model's default state.
     */
    public function definition()
    {
        $types = ['pengeluaran', 'pendapatan', 'transfer'];

        return [
            'user_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'description' => $this->faker->sentence(6),
            'amount' => $this->faker->randomFloat(2, 1, 1000000),
            'type' => $this->faker->randomElement($types),
            'transaction_date' => $this->faker->dateTimeBetween('-1 years', 'now')->format('Y-m-d'),
        ];
    }
}
