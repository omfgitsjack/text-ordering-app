<?php

class AuthenticateController extends Controller {

    private $twilioClient;

    function __construct()
    {
        $this->twilioClient = new Services_Twilio(
            "PNb2fbd11455f96f24cf1f66fae0a86030",
            "41e9b88d6c81576d8ed6587e211b75cb"
        );
    }

    public function sendAuthToken() {
        $number = Input::get("phoneNumber");

        $authCode = $this->generateRandomString(6);
        Authentication::create([
            "code" => $authCode
        ]);

        $this->twilioClient->account->messages->sendMessage(
            "2892071270",
            $number,
            "UCafe: " . $authCode
        );
    }

    private function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}