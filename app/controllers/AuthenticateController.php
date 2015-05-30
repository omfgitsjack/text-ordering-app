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

    public function generateReceipt($order)
    {
        // Has to have at least one item in the order.
        $receipt = $order[0]->quantity . 'x ' . $order[0]->food->name . "\n";
        $total = $order[0]->quantity * $order[0]->food->price;

        for ($i = 1; $i < sizeof($order); $i++)
        {
            $receipt = $receipt . $order[$i]->quantity . 'x ' . $order[$i]->food->name . "\n";
            $total += $order[$i]->quantity * $order[$i]->food->price;
        }
        $receipt = $receipt . "Total: " . $total . "\n";

        return $receipt;
    }

    public function checkAuthToken()
    {
        $id = Input::get('id');
        $code = Input::get('code');
        $order = Input::get('order');
        $authRecord = Authentication::where('id', $id)->first();
        $validAuthToken = $authRecord->code == $code;

        if ($validAuthToken)
        {
            $this->twilioClient->account->messages->sendMessage(
                "+12892071270",
                $authRecord->phone,
                "优厨房\n" .
                "You have successfully ordered your meal!\nYour Order:" .
                $this->generateReceipt($order));

            return Response::json(['success' => true]);
        } else
        {
            return Response::json(['success' => false]);
        }
    }

    public function sendAuthToken()
    {
        $number = Input::get("phoneNumber");
        $order = Input::get("order");
        $savedOrders = [];

        // Store Authentication details
        $authRecord = Authentication::create([
            "phone"    => $number,
            "verified" => false
        ]);

        // Store Order
        for ($i = 0; $i < sizeof($order); $i++)
        {
            array_push($savedOrders, Order::create([
                'authentication_id' => $authRecord->id,
                'food_id'           => $order[$i]['id'],
                'quantity'          => $order[$i]['order']['quantity']
            ]));
        }

        try
        {
            $this->twilioClient->account->messages->sendMessage(
                "+12892071270",
                $number,
                "优厨房 Order Confirmation: \n" . $this->generateReceipt($savedOrders) .
                "请回答 OK to confirm"
            );
        } catch (Services_Twilio_RestException $e)
        {
            return $e;
        }

        return Response::json(['id' => $authRecord->id]);
    }
}
