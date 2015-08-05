<?php
/**
 * Created by PhpStorm.
 * User: Jack
 * Date: 2015-08-03
 * Time: 9:54 PM
 */

namespace Acme\Repositories\DrinkRepository;


Interface DrinkRepository {

    public function getDrinksForSale();

    public function updateAllDrinks($list);

}