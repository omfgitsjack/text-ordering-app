<?php

class Order extends \Eloquent {
	protected $fillable = [
		'food_id',
		'authentication_id',
		'quantity'
	];

	public function food() {
		return $this->belongsTo('Food');
	}
}

