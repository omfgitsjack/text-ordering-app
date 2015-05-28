<?php

class Order extends \Eloquent {
	protected $fillable = [
		'phone',
		'quantity',
		'verified',
		'food_id'
	];

	public function food() {
		return $this->belongsTo('Food');
	}
}

