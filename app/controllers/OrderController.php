<?php

class OrderController extends Controller {

    public function makeOrder() {
        $order = Input::all();
        return $order;
    }

}