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
		'ingredients'
	];

	public function order(){
		return $this->hasMany('Order');
	}
}