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
        $receipt = $receipt . "价格（请付现金）: " . $total . "\n";

        return $receipt;
    }

    public function sendAuthToken()
    {
        $number = Input::get("phoneNumber");
        $order = Input::get("order");
        $savedOrders = [];

        // Store Authentication details
        $authRecord = Authentication::create([
            "phone"    => '+1' . $number,
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
                "优厨房已收到你的订单: \n" . 
                "订单号码: " . $authRecord->id . "\n" .
                "你的午餐: \n" . $this->generateReceipt($savedOrders) .
                "取餐地点: UTSC bus loop 38路旁边\n" .
                "预计时间: 1 PM\n" . 
                "***请回复 OK 确定订单***"
            );
        } catch (Services_Twilio_RestException $e)
        {
            return $e;
        }

        return Response::json(['id' => $authRecord->id]);
    }
}
