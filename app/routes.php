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

Route::get('api/orders/today', 'OrdersController@todaysOrder');
Route::get('api/orders/yesterday', 'OrdersController@yesterdaysOrder');

Route::post('api/twilio', function() {
	$auth = Authentication::where('phone', Input::get('From'))->orderBy('id', 'desc')->first();
	$twiml = new Services_Twilio_Twiml();

	if (!$auth->verified) {
		$auth->verified = true;
		$auth->save();

		$twiml->message('Order confirmed. Your order will arrive within an hour.');
		$response = Response::make($twiml, 200);
		$response->header('Content-Type', 'text/xml');	
	} else {
		$twiml->message("Please visit http://www.ucafe.ca to order.\nIf you have any queries, please add ucafe_ca on WeChat.");
		$response = Response::make($twiml, 200);
		$response->header('Content-Type', 'text/xml');
	}

	return $response;
});
