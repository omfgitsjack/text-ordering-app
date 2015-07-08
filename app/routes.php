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

define('CONFIRM_ORDER', "ok");
define('CANCEL_ORDER', "cancel");

Route::post('api/twilio', function() {
	// RESPONSE CONSTANTS
	
	$auth = Authentication::where('phone', Input::get('From'))->orderBy('id', 'desc')->first();
	$twiml = new Services_Twilio_Twiml();
	$WECHATACC = 'ucafe_ca';

	var responseString = strtolower(Input::get('Body'));

	if (responseString == CONFIRM_ORDER) {
		if (!$auth->verified && $auth->created_at->diffInSeconds(Carbon::now(new DateTimeZone('America/Toronto'))) < 60 * 5) {
			// Save and confirm
			$auth->verified = true;
			$auth->save();

			$msg = '订单已确认, 您的午饭会在1点到达 :) 如果想联络我们的话，请发短信给我们的微信：' . $WECHATACC;
		} else {
			// Reject
			$msg = "不好意思， 您没有在规定时间内回复'OK'. 您的订单没有成功录入我们的系统， 请回到ucafe.ca从新订单并收到短信后立即回复”ok” ：)";
		}
	} else if (responseString == CANCEL_ORDER) {
		$auth->verified = false;
		$auth->save();

		$msg = "我们取消了你的订单";
	} else {
		$msg = '如果想联络我们的话，请发短信给我们的微信：' . $WECHATACC;
	}

	$twiml->message($msg);
	$response = Response::make($twiml, 200);
	$response->header('Content-Type', 'text/xml');	

	return $response;
});
