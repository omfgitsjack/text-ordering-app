<?php namespace Acme\Repositories\DishRepository;

use Acme\Repositories\BaseRepository\BaseRepository;

Interface DishRepository extends BaseRepository{

  public function getDishesForSale();

  public function updateAllDishes($list);

}
