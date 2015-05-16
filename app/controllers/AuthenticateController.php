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

    public function generateReceipt($order) {
	$receipt = "";
	$total = 0;

	foreach($order as $item) {
		$receipt = $receipt . ", ". $item['name'];
		$total += $item['price'];
        }
	$receipt = $receipt . ".\n Total: " . $total;

	return $receipt;
    }


    public function checkAuthToken() {
        $id = Input::get('id');
        $code = Input::get('code');
	$order = Input::get('order');
        $authRecord = Authentication::where('id',$id)->first();
	$validAuthToken = $authRecord->code == $code;

	if ($validAuthToken) {
		$this->twilioClient->account->messages->sendMessage(
			"+12892071270",
			$authRecord->phone,
			"UCafe\n" . 
			"You have successfully ordered your meal!\nYour Order:" . 
			$this->generateReceipt($order));
		return Response::json(['success'=>true]);
	} else {
		return Response::json(['success'=>false]);
	}
    }

    public function sendAuthToken() {
        $number = Input::get("phoneNumber");

        $authCode = $this->generateRandomString(6);
        $authRecord = Authentication::create([
            "code" => $authCode,
	    "phone" => $number
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

	return Response::json(['id' => $authRecord->id]);
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
