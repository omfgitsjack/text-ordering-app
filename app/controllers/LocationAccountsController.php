<?php

class LocationAccountsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /locationaccounts
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(LocationAccount::get());
	}

	public function auth()
	{
		$username = Input::get('username');
		$password = Input::get('password');

		$matches = LocationAccount::
		where('username', '=', $username)->
		where('password', '=', $password)
			->get();

		if (count($matches) === 1)
		{
			return Response::json([
				"success" => true,
				"location" => Location::where("id","=",$matches[0]->location_id)->first()
			]);
		}
		else
		{
			return Response::json([
				"success" => false,
				"location" => null
			]);
		}
	}

	/**
	 * Show the form for creating a new resource.
	 * GET /locationaccounts/create
	 *
	 * @return Response
	 */
	public function create()
	{
		return LocationAccount::create([
			"username" => Input::get("username"),
			"password" => Input::get("password"),
			"location_id" => Input::get("location_id"),
		]);
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /locationaccounts
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 * GET /locationaccounts/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 * GET /locationaccounts/{id}/edit
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 * PUT /locationaccounts/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /locationaccounts/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}