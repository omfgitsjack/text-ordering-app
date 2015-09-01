<?php

use Acme\Repositories\DrinkRepository\DrinkRepository;

class DrinksController extends \BaseController {

    function __construct(DrinkRepository $drink)
    {
        $this->drink = $drink;
    }

    /**
     * Display a listing of the resource.
     * GET /foods
     *
     * @return Response
     */
    public function index()
    {
        return $this->drink->getDrinksForSale();
    }

    /**
     * Display a listing of the resource.
     * GET /foods
     *
     * @return Response
     */
    public function indexAll()
    {
        return Response::json($this->drink->getAll());
    }

    public function update()
    {
        $this->drink->updateAllDrinks(Input::get('drinkList'));

        return Response::json($this->drink->getAll());
    }

    public function store()
    {
        $entity = Input::get('entities')[0];
        $drink = $this->drink->store($entity);

        $drink['$type'] = "drink";

        return Response::json([
            "entities"      => [$drink],
            "keyMappings"   => [
                [
                    "entityTypeName" => "drink",
                    "tempValue" => $entity['id'],
                    "realValue" => $drink['id']
                ]
            ]
        ]);
    }

}
