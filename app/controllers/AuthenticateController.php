<?php

class AuthenticateController extends Controller {

    private $twilioClient;

    function __construct()
    {
        $this->twilioClient = new Services_Twilio(
            getenv('TWILIO_SID'),
            getenv('TWILIO_AUTH_TOKEN')
        );
    }

    public function checkAuthToken() {
        $id = Input::get('id');
        $code = Input::get('code');
        $authRecord = Authentication::where('id',$id)->get();

        return $authRecord;
    }

    public function sendAuthToken() {
        $number = Input::get("phoneNumber");

        $authCode = $this->generateRandomString(6);
        Authentication::create([
            "code" => $authCode
        ]);

        try {
            $this->twilioClient->account->messages->sendMessage(
                "+12892071270",
                $number,
                "UCafe: " . $authCode
            );
        } catch (Services_Twilio_RestException $e) {
            return $e;
        }
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
