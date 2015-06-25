<?php

class FoodsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /foods
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Food::where('available', true)->get());
	}

	/**
	 * Display a listing of the resource.
	 * GET /foods
	 *
	 * @return Response
	 */
	public function indexAll()
	{
		return Response::json(Food::get());
	}

	public function update()
	{
		// Loop through each one and update
		$rawFoodList = Input::get('foodList');

		foreach ($rawFoodList as $food) {
			$item = DB::table('foods')
				->where('id','=', $food['id'])
				->update($food);
		}

		return Response::json(Food::get());
	}

}