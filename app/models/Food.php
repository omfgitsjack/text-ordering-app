<?php

class Food extends \Eloquent {
	protected $fillable = [
		'name',
		'description',
		'price',
		'image',
		'calories',
		'protein',
		'fat',
		'carbs',
		'fiber',
		'ingredients',
		'available'
	];
}