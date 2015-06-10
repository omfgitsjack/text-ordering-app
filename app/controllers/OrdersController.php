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

	public function getOrders($dayOffset)
	{
		$timePeriod = self::calculateDeadline($dayOffset);
		$deadline = $timePeriod['deadline'];
		$today = $timePeriod['start'];
		
		$records = DB::table('authentications')
			->join('orders','authentications.id','=','orders.authentication_id')
			->join('foods','foods.id','=','orders.food_id')
			->where('authentications.updated_at','<',$deadline)
			->where('authentications.updated_at','>',$today)
			->where('authentications.verified','=',true)
			->orderBy('authentications.updated_at','desc')
			->select('authentications.updated_at',
				'phone','authentications.id','foods.name',
				'foods.description','foods.price','foods.image','foods.calories','foods.protein','foods.fat','foods.carbs','foods.fiber','foods.ingredients')
			->get();

		return $records;
	}

	public function yesterdaysOrder()
	{
		return self::getOrders(-1);
	}

	public function todaysOrder()
	{
		return self::getOrders(0);
	}

	private function calculateDeadline($dayOffset) {
		$now = Carbon::now(self::getTimeZone());
		$todayDeadline = Carbon::now(self::getTimeZone());
		$todayStart = Carbon::now(self::getTimeZone());

		if ($now->hour > self::ORDERHOURCUTOFF) {
			$todayDeadline = $todayDeadline->addDays($dayOffset + 1);
		} else {
			$todayStart = $todayStart->subDays($dayOffset + 1);
		}

		$todayDeadline->startOfDay()->addHours(self::ORDERHOURCUTOFF);
		$todayStart->startOfDay()->addHours(self::ORDERHOURCUTOFF)->addDays($dayOffset);

		return [ 'deadline' => $todayDeadline,
			 'start'    => $todayStart     ];
	}

	private function getTimeZone() {
		return new DateTimeZone(self::CURTIMEZONE);
	}

}
