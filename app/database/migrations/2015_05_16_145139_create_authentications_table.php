<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateAuthenticationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('authentications', function(Blueprint $table)
		{
			$table->increments('id');
			$table->text('phone');
			$table->boolean('verified');
			$table->boolean('paid');
			$table->string('payment_type');
			$table->integer('location_id')->unsigned();
			$table->timestamps();

			$table->foreign('location_id')->references('id')->on('locations');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('authentications');
	}

}
