<?php

class Authentication extends \Eloquent {
	protected $fillable = [
		'phone',
		'verified'
	];

	public function orders() {
		return $this->hasMany('Order');
	}
}
