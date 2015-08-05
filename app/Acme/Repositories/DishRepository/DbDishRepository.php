<?php namespace Acme\Repositories\DishRepository;

use Acme\Repositories\BaseRepository\DbBaseRepository;

use Food;
use DB;

class DbDishRepository extends DbBaseRepository implements DishRepository {

    protected $model;

    function __construct(Food $model)
    {
        $this->model = $model;
    }

    public function getDishesForSale()
    {
        return $this->model
            ->where('available', true)
            ->where('food_type', Food::DISH)
            ->get();
    }

    public function getAll()
    {
        return $this->model
            ->where('food_type', Food::DISH)
            ->get();
    }

    public function updateAllDishes($list)
    {
        foreach ($list as $dish)
        {
            $item = DB::table('foods')
                ->where('id', '=', $dish['id'])
                ->update($dish);
        }
    }

}
