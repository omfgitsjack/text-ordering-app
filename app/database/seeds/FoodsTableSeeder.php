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
				'description' => "主菜： 牛肉，生菜<br>配菜： 土豆，萝卜，洋葱<br>制作时间： 45分钟",
				'price' => rand(5,10),
				'taxedprice' => rand(5,10)+1,
				'image' => 'assets/food_pic' . (rand(1,5) . '.png'),
				'calories' => rand(0,400),
				'protein' => rand(0,400),
				'fat' => rand(0,400),
				'carbs' => rand(0,400),
				'fiber' => rand(0,400),
				'ingredients' => "主菜： 牛肉，生菜<br>配菜： 土豆，萝卜，洋葱",
				'available' => 1
			]);
		}
	}

}