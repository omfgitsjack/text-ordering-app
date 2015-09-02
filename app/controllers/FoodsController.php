<?php

use Acme\Repositories\DishRepository\DishRepository;

class FoodsController extends \BaseController {

	function __construct(DishRepository $dish)
	{
		$this->dish = $dish;
	}

	/**
	 * Display a listing of the resource.
	 * GET /foods
	 *
	 * @return Response
	 */
	public function index()
	{
		return $this->dish->getDishesForSale();
	}

	/**
	 * Display a listing of the resource.
	 * GET /foods/all
	 *
	 * @return Response
	 */
	public function indexAll()
	{
		return Response::json($this->dish->getAll());
	}

	public function update()
	{
		$this->dish->updateAllDishes(Input::get('foodList'));

		return Response::json(Food::get());
	}

}
