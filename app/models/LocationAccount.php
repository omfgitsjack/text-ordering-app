<?php

class LocationAccount extends \Eloquent {
	protected $fillable = [
		'username',
		'password',
		'location_id'
	];

	public function location() {
		return $this->hasOne("Location");
	}
}