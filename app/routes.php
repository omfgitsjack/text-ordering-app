<?php

use Carbon\Carbon;

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
Route::put('api/food', 'FoodsController@update');
Route::get('api/food/all', 'FoodsController@indexAll');

Route::post('api/authenticate', 'AuthenticateController@sendAuthToken');

Route::get('api/orders/current', array('after' => 'allowOrigin', 'uses' => 'OrdersController@currentOrders'));

Route::post('api/twilio', function() {
	$auth = Authentication::where('phone', Input::get('From'))->orderBy('id', 'desc')->first();
	$twiml = new Services_Twilio_Twiml();
	$WECHATACC = 'ucafe_ca';
	
	if (!$auth->verified && $auth->created_at->diffInSeconds(Carbon::now(new DateTimeZone('America/Toronto'))) < 60 * 5) {
		$auth->verified = true;
		$auth->save();

		$twiml->message('订单已确认, 您的午饭会在1点到达 :) 如果想联络我们的话，请发短信给我们的微信：' . $WECHATACC);
		$response = Response::make($twiml, 200);
		$response->header('Content-Type', 'text/xml');	
	} else {
		$twiml->message("不好意思， 您没有立即确认”ok”, 您的订单没有成功录入我们的系统， 请回到ucafe.ca从新订单并收到短信后立即回复”ok” ：)");
		$response = Response::make($twiml, 200);
		$response->header('Content-Type', 'text/xml');
	}

	return $response;
});
