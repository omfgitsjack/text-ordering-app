<?php

use Carbon\Carbon;

class OrdersController extends \BaseController {

	const ORDERHOURCUTOFF = 10;
	const ORDERHOURMAX = 24;
	const CURTIMEZONE = 'America/Toronto';

	/**
	 * Display a listing of the resource.
	 * GET /orders
	 *
	 * @return Response
	 */
	public function index()
	{
		//
	}

	/**
	 * Show the form for creating a new resource.
	 * GET /orders/create
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /orders
	 *
	 * @return Response
	 */
	public function store()
	{
		//
	}

	/**
	 * Display the specified resource.
	 * GET /orders/{id}
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
	 * GET /orders/{id}/edit
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
	 * PUT /orders/{id}
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
	 * DELETE /orders/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

	public function todaysOrder()
	{
		$deadline = self::calculateTodaysDeadline();
		$today = Carbon::now(self::getTimeZone());

		return Order::where('updated_at','<',$deadline)
			->where('updated_at','>',$today)
			->orderBy('updated_at','desc')
			->get();
	}

	private function calculateTodaysDeadline() {
		$today = Carbon::now(self::getTimeZone());
		$todayDeadline = null;

		if ($today->hour > self::ORDERHOURCUTOFF) {
			$todayDeadline = $today->addDays(1);
		}
		$todayDeadline->startOfDay()->addHours(self::ORDERHOURCUTOFF);

		return $todayDeadline;
	}

	private function getTimeZone() {
		return new DateTimeZone(self::CURTIMEZONE);
	}

}
