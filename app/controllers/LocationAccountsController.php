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
		$locations = [];
		$locationAccounts = LocationAccount::get();

		foreach ($locationAccounts as $account) {
			$school = Location::where("id", "=", $account->location_id)->first();

			$locations[] = $this->buildFullLocation($school, $account);
		}

		return Response::json($locations);
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
		$location = Location::create([
			"pickupLocation" => Input::get("pickupLocation"),
			"school" => Input::get("school")
		]);

		$locationAccount = LocationAccount::create([
			"username" => Input::get("username"),
			"password" => Input::get("password"),
			"location_id" => $location->id,
		]);

		return $this->buildFullLocation($location, $locationAccount);
	}

	private function buildFullLocation($school, $account) {
		return [
			"location_id" => $school->id,
			"school" => $school->pickupLocation,
			"pickupLocation" => $school->pickupLocation,
			"location_account_id" => $account->id,
			"username" => $account->username,
			"password" => $account->password
		];
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /locationaccounts
	 *
	 * @return Response
	 */
	public function store()
	{
		$location = Location::where("id", '=', Input::get("location_id"))->firstOrFail();
		$account = LocationAccount::where("id", "=", Input::get("location_account_id"))->firstOrFail();

		$location->pickupLocation = Input::get("pickupLocation");
		$location->school = Input::get("school");

		$account->username = Input::get("username");
		$account->password = Input::get("password");

		$location->save();
		$account->save();

		return $this->buildFullLocation($location, $account);
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