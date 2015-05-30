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

	public function order(){
		return $this->hasMany('Order');
	}
}