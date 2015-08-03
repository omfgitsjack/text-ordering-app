<?php namespace Acme\Repositories\DishRepository;

Interface DishRepository {

  public function getDishesForSale();

  public function updateAllDishes($list);

}
