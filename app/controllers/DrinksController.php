<?php

use Acme\Repositories\DrinkRepository\DrinkRepository;

class DrinksController extends \BaseController {

    function __construct(DrinkRepository $drink)
    {
        $this->drink = $drink;
    }

    /**
     * Display a listing of the resource.
     * GET /drinks
     *
     * @return Response
     */
    public function index()
    {
        Log::info(Input::get('available'));

        if (Input::get('available'))
        {
            return $this->drink->getDrinksForSale();
        }
        else
        {
            return Response::json($this->drink->getAll());
        }
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

    public function update($id)
    {
        $entity = Input::get('entities')[0];

        $drink = DB::table('foods')
            ->where('id', '=', $id)
            ->update($entity);

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

    public function store()
    {
        $entity = Input::get('entities')[0];
        if ($entity['id'] < 0) // Automatically set by client side
        {
            $drink = $this->drink->store($entity);
        }
        else
        {
            $drink = $this->drink->update($entity['id'], $entity);
        }

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
