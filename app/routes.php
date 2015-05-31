<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('hello');
	//return View::make('ucafe');
});

Route::get('api/food', 'FoodsController@index');

Route::post('api/authenticate', 'AuthenticateController@sendAuthToken');

Route::post('api/twilio', function() {
	$twiml = new Services_Twilio_Twiml();
	$twiml->message('Order confirmed. Your order will arrive within an hour.');
	$response = Response::make($twiml, 200);
	$response->header('Content-Type', 'text/xml');

	$auth = Authentication::where('phone', Input::get('From'))->first();
	$auth->verified = true;

	return $response;
});