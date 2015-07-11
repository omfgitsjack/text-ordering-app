<?php

class ShopsController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 * GET /shops
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Shop::get()->first());
	}

	/**
	 * Show the form for creating a new resource.
	 * GET /shops/create
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /shops
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 * GET /shops/{id}
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
	 * GET /shops/{id}/edit
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
	 * PUT /shops
	 * @return Response
	 */
	public function update()
	{
				// Loop through each one and update
		$shop = Input::get('shop');

		$item = DB::table('shops')
			->where('id','=', 1) // Only 1 shop...
			->update($shop);

		return Response::json(Shop::get()->first());
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /shops/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
