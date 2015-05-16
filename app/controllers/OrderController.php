<?php

use Authentication;

class OrderController extends Controller {


    private function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public function makeOrder() {
        return "hi";
        $order = Input::get("phoneNumber");
        $authCode = generateRandomString(6);
        Authentication::create($authCode);
        return $authCode;
    }
}