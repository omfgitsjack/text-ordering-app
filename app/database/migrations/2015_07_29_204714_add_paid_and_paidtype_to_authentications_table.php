<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPaidAndPaidtypeToAuthenticationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('authentications', function($t) {
			$t->boolean('paid');
			$t->string('payment_type');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('authentications', function($t) {
			$t->dropColumn('paid');
			$t->dropColumn('payment_type');
		});
	}

}
