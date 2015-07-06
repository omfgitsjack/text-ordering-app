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
        $total = $order[0]->quantity * $order[0]->food->taxedprice;

        for ($i = 1; $i < sizeof($order); $i++)
        {
            $receipt = $receipt . $order[$i]->quantity . 'x ' . $order[$i]->food->name . "\n";
            $total += $order[$i]->quantity * $order[$i]->food->taxedprice;
        }
        $receipt = $receipt . "价格（请付现金）: " . $total . "\n";

        return $receipt;
    }

    // Receive initial order placement, send out confirmation message &
    // schedule reminder text message to confirm order.
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
                "取餐地点: Tim Hortons前面的长椅（图书馆旁边\n" .
                "预计时间: 1 PM\n" . 
                "***请回复 OK 确定订单***"
            );

            // Fire task to remind user if they have not verified.
            // Give them a chance to type OK instead of remaking the order.
            $date = Carbon::now()->addMinutes(3);
            Queue::later($date, 'AuthenticateController@remind', array('id' => $authRecord->id));

            return "OK";
        } catch (Services_Twilio_RestException $e)
        {
            return $e;
        }
    }

    // Remind a user to confirm order if they have yet to do so.
    public function remind($job, $data) {
        $auth = Authentication::where('id', $data['id'])->first();
        
        if (!$auth->verified) {
            $this->twilioClient->account->messages->sendMessage(
                "+12892071270",
                $auth->phone,
                "不好意思， 您没有立即确认”ok”, 您的订单没有成功录入我们的系统， 请回复 ”OK” 确定订单"
            );
        }

        $job->delete();
    }

}
