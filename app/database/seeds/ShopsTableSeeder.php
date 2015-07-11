<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

class ShopsTableSeeder extends Seeder {

	public function run()
	{
		Shop::create([
			'is_open' => true
		]);
	}

}