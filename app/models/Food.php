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
		'available'
	];
}