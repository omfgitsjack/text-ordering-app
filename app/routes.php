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

Route::get('api/location', 'LocationsController@index');

Route::get('api/food', 'FoodsController@index');
Route::put('api/food', 'FoodsController@update');
Route::get('api/food/all', 'FoodsController@indexAll');

Route::post('api/login', 'LoginController@login');

Route::post('api/authenticate', 'AuthenticateController@sendAuthToken');
Route::put('api/authenticate', 'AuthenticateController@update');

Route::get('api/orders/current', array('after' => 'allowOrigin', 'uses' => 'OrdersController@currentOrders'));

Route::get('api/shop', array('after' => 'allowOrigin', 'uses' => 'ShopsController@index'));
Route::put('api/shop', array('after' => 'allowOrigin', 'uses' => 'ShopsController@update'));

define('CONFIRM_ORDER', "ok");

Route::post('api/twilio', function() {
	// RESPONSE CONSTANTS

	$auth = Authentication::where('phone', Input::get('From'))->orderBy('id', 'desc')->first();
	$twiml = new Services_Twilio_Twiml();

	$responseString = strtolower(Input::get('Body'));

	if ($responseString == CONFIRM_ORDER) {
		if (!$auth->verified && $auth->created_at->diffInSeconds(Carbon::now(new DateTimeZone('America/Toronto'))) < 60 * 5) {
			// Save and confirm
			$auth->verified = true;
			$auth->paid = false;
			$auth->save();

			$msg = '订单已确认, 您的午饭会 12:45-13:15PM 到达 :) 如果想联络我们的话，请发短信给我们的微信：' . $_SERVER['WECHAT_ACC'];
		} else {
			// Reject
			$msg = "不好意思， 您没有在规定时间内回复'OK'. 您的订单没有成功录入我们的系统， 请回到"
				. $_SERVER['SITE_URL'] . "从新订单并收到短信后立即回复”ok” ：)";
		}
	} else {
			$msg = 	"想订单的话，请前往" . $_SERVER['SITE_URL'] . ".\n" .
	 						"如果想联络我们或取消订单的话，请发短信给我们的微信：" . $WECHATACC;
	}

	$twiml->message($msg);
	$response = Response::make($twiml, 200);
	$response->header('Content-Type', 'text/xml');

	return $response;
});
