<?php

use Carbon\Carbon;

class OrdersController extends \BaseController {

	const ORDERHOURCUTOFF = 10;
	const ORDERHOURMAX = 24;
	const CURTIMEZONE = 'America/Toronto';

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
				'foods.description','foods.price','foods.image','foods.calories','foods.taxedprice','foods.protein','foods.fat','foods.carbs','foods.fiber','foods.ingredients')
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
