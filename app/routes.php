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
});

Route::post('api/authenticate', 'AuthenticateController@sendAuthToken');

Route::match(['GET','POST'],'api/test', function()
{
	$twiml = new Services_Twilio_Twiml();
	$twiml->say('Hello - your app just answered the phone. Neat, eh?', array('voice' => 'alice'));
	$response = Response::make($twiml, 200);
	$response->header('Content-Type', 'text/xml');
	return $response;
});
