<?php

class Authentication extends \Eloquent {
	protected $fillable = [
		'phone',
		'verified',
		'reminded'
	];

	public function orders() {
		return $this->hasMany('Order');
	}
}
