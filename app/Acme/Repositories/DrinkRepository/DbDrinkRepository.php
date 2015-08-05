<?php
/**
 * Created by PhpStorm.
 * User: Jack
 * Date: 2015-08-03
 * Time: 9:56 PM
 */

namespace Acme\Repositories\DrinkRepository;


use Acme\Repositories\BaseRepository\DbBaseRepository;
use DB;
use Food;

class DbDrinkRepository extends DbBaseRepository implements DrinkRepository {

    protected $model;

    function __construct(Food $model)
    {
        $this->model = $model;
    }

    public function getDrinksForSale()
    {
        return $this
            ->model
            ->where('food_type', Food::DRINK)
            ->where('available', true)
            ->get();
    }

    public function getAll()
    {
        return $this
            ->model
            ->where('food_type', Food::DRINK)
            ->get();
    }

    public function updateAllDrinks($list)
    {
        foreach ($list as $drink)
        {
            $item = DB::table('foods')
                ->where('id', '=', $drink['id'])
                ->update($drink);
        }
    }
}