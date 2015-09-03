<?php

// Composer: "fzaninotto/faker": "v1.3.0"
use Faker\Factory as Faker;

class LocationsTableSeeder extends Seeder {

	public function run()
	{
		$faker = Faker::create();

		$locations = [
			[
				"school" => "University of Toronto",
				"pickupLocation" => "Bus loop"
			],
			[
				"school" => "University of Waterloo",
				"pickupLocation" => "Convenient store"
			],
			[
				"school" => "Ryerson",
				"pickupLocation" => "7 Eleven"
			]
		];

		foreach(range(0, 2) as $index)
		{
			Location::create($locations[$index]);
		}
	}

}