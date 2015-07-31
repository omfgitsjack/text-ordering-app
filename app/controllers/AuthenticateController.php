<?php

use Carbon\Carbon;

class AuthenticateController extends Controller {

    const CASH = "Cash";

    private $twilioClient;

    function __construct()
    {
        $this->twilioClient = new Services_Twilio(
            $_SERVER['TWILIO_SID'],
            $_SERVER['TWILIO_AUTH_TOKEN']
        );
    }

    public function update()
    {
      $auth = Input::get('authentication');

      $item = DB::table('authentications')
        ->where('id','=', $auth['id'])
        ->update($auth);

      return Response::json($auth);
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

    public function sendAuthToken()
    {
        $number = Input::get("phoneNumber");
        $order = Input::get("order");
        $savedOrders = [];

        // Store Authentication details
        $authRecord = Authentication::create([
            "phone"    => '+1' . $number,
            "verified" => false,
            "paid"     => false, // CHANGE THIS WHEN WE INTRODUCE STRIPE PAYMENT
            "payment_type" => self::CASH
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
                $_SERVER['TWILIO_PHONE_NUMBER'],
                $number,
                "优厨房已收到你的订单: \n" .
                "订单号码: " . $authRecord->id . "\n" .
                "Payment Method: " . $authRecord->payment_type . "\n" .
                "你的午餐: \n" . $this->generateReceipt($savedOrders) .
                "取餐地点: Tim Hortons前面的长椅（图书馆旁边)\n" .
                "预计时间: 12:45-1:15PM\n\n" .
                "***请回复 OK 确定订单***\n" .
                "(回复 NO 取消订单）"
            );

            // Fire task to remind user if they have not verified.
            // Give them a chance to type OK instead of remaking the order.
            $remindDate = Carbon::now()->addMinutes(3);
            Queue::later($remindDate, 'AuthenticateController@remind', array('id' => $authRecord->id));

            $cancelDate = Carbon::now()->addMinutes(5);
            Queue::later($cancelDate, 'AuthenticateController@cancel', array('id' => $authRecord->id));

            return "OK";
        } catch (Services_Twilio_RestException $e)
        {
            return $e;
        }
    }

    public function remind($job, $data) {
        $auth = Authentication::where('id', $data['id'])->first();

        if (!$auth->verified) {
            $this->twilioClient->account->messages->sendMessage(
                $_SERVER['TWILIO_PHONE_NUMBER'],
                $auth->phone,
                "请在两分钟内回复 ”OK” 确定订单, 否则您的顶单会被取消"
            );
        }

        $job->delete();
    }

    public function cancel($job, $data) {
        $auth = Authentication::where('id', $data['id'])->first();

        if (!$auth->verified) {
            $this->twilioClient->account->messages->sendMessage(
                $_SERVER['TWILIO_PHONE_NUMBER'],
                $auth->phone,
                "不好意思, 您没有在规定时间内回复'OK',订单已取消。请回ucafe.ca再次下单:)"
            );
        }

        $job->delete();
    }

}
