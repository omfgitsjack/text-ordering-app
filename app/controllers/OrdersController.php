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

	public function getOrders()
	{
		$timePeriod = self::calculateDeadline();
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
				'phone','authentications.id','foods.name','orders.quantity',
				'foods.description','foods.price','foods.image','foods.calories','foods.protein','foods.fat','foods.carbs','foods.fiber','foods.ingredients')
			->get();

		return $records;
	}

	public function currentOrders() {
		return self::getOrders();
	}

	private function calculateDeadline() {
		$now = Carbon::now(self::getTimeZone());
		$todayDeadline = Carbon::now(self::getTimeZone());
		$todayStart = Carbon::now(self::getTimeZone());

		if (0 <= $now->hour && $now->hour < 16) {
			return [
				'deadline' => $todayDeadline->startOfDay()->addHours(self::ORDERHOURCUTOFF),
				'start'	=> $todayStart->startOfDay()->subDays(1)->addHours(self::ORDERHOURCUTOFF)
			];
		} else {
			return [
				'deadline' => $todayDeadline->addDays(1)->startOfDay()->addHours(self::ORDERHOURCUTOFF),
				'start'	=> $todayStart->startOfDay()->addHours(self::ORDERHOURCUTOFF)
			];
		}
	}

	private function getTimeZone() {
		return new DateTimeZone(self::CURTIMEZONE);
	}

}
