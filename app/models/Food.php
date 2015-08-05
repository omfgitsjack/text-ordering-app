<?php

class Food extends \Eloquent {
	protected $fillable = [
		'name',
		'description',
		'price',
		'taxedprice',
		'image',
		'calories',
		'protein',
		'fat',
		'carbs',
		'fiber',
		'ingredients',
		'available',
		'spicy',
		'food_type'
	];

	// Constants for Types of Food
	const DISH = "dish";
	const DRINK = "drink";

}
