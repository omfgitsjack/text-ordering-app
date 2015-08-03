<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddFoodTypeTfoodTypeToFoodTable extends Migration {

		/**
		 * Run the migrations.
		 *
		 * @return void
		 */
		public function up()
		{
			Schema::table('foods', function($t) {
				$t->string('food_type');
			});
		}

		/**
		 * Reverse the migrations.
		 *
		 * @return void
		 */
		public function down()
		{
			Schema::table('foods', function($t) {
				$t->dropColumn('food_type');
			});
		}

}
