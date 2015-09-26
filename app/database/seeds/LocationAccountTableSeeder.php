<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

class LocationAccountTableSeeder extends Seeder {

	public function run()
	{
		$faker = Faker::create();

		$locations = [
			[
				"school" => "UTSC",
				"pickupLocation" => "Bus loop"
			],
			[
				"school" => "UTSG",
				"pickupLocation" => "Convenient store"
			],
			[
				"school" => "Ryerson",
				"pickupLocation" => "7 Eleven"
			],
			[
				"school" => "GGLA",
				"pickupLocation" => "Circle K"
			]
		];

		foreach(range(1, 2) as $index)
		{
			LocationAccount::create([
				"username" => $locations[$index]["school"],
				"password" => $locations[$index]["school"],
				"location_id" => $index+1,
			]);
		}
	}

}