<?php

class LoginController extends Controller {

    public function login()
    {
      if (Input::get('password') === $_SERVER['ADMIN_PASSWORD'])
      {
        return Response::json("OK");
      } else {
        return Response::json("NO");
      }
    }
}
