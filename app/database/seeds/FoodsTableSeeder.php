<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

class FoodsTableSeeder extends Seeder {

	public function run()
	{
		$faker = Faker::create();

		foreach(range(1, 10) as $index)
		{
			Food::create([
				'id' => $index,
				'name' => $faker->sentence(3),
				'description' => $faker->sentence(rand(10, 100)),
				'price' => rand(5,10),
				'image' => 'assets/food_pic' . (rand(1,5) . '.png'),
				'calories' => rand(0,400),
				'protein' => rand(0,400),
				'fat' => rand(0,400),
				'carbs' => rand(0,400),
				'fiber' => rand(0,400),
				'ingredients' => $faker->sentence(rand(300, 500)),
				'available' => 1
			]);
		}
	}

}