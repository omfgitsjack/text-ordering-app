<?php namespace Acme;

use Illuminate\Support\ServiceProvider;

class BackendServiceProvider extends ServiceProvider {

    public function register()
    {
        $this->app->bind(
            'Acme\Repositories\DishRepository\DishRepository',
            'Acme\Repositories\DishRepository\DbDishRepository'
        );
        $this->app->bind(
            'Acme\Repositories\DrinkRepository\DrinkRepository',
            'Acme\Repositories\DrinkRepository\DbDrinkRepository'
        );
    }
}
