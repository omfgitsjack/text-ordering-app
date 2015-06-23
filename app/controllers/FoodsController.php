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

	public function updateAll()
	{
		// Loop through each one and update
	}

}