<?php

class Authentication extends \Eloquent {
	protected $fillable = [
		'phone',
		'verified',
		'payment_type',
		'paid'
	];

	public function orders() {
		return $this->hasMany('Order');
	}
}
