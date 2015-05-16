<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>UTCafe</title>
	<link href="http://bootswatch.com/yeti/bootstrap.css" rel="stylesheet">
	<link href="app/style.css" rel="stylesheet">
</head>
<body ng-app="app.main">
	<div ng-controller="mainController">
		<div class="header-area">
			<h1>UTCafe</h1>
			<h3 class="text-muted">Affordable Delicious Chinese Cuisine</h3>
		</div>

		<div class="food-items">

			<!-- Food Items -->
			<div class="food-item panel panel-default" ng-repeat="item in food">
				<div class="panel-body">
					<img class="food-img" src="assets/mapo.jpg" alt="mapo"/>
					<div class="food-item-description">
						<p class="pull-left">{{item.name}} <span class="text-muted">${{item.price}}</span></p>
						<button
							ng-hide="item.selected"
							class="btn btn-sm btn-primary pull-right"
							ng-click="item.selected = true">
							Add Item
						</button>
						<button
							ng-show="item.selected"
							class="btn btn-sm btn-danger pull-right"
							ng-click="item.selected = false">
							Remove Item
						</button>
					</div>
				</div>
			</div>

			<!-- Checkout Area -->
			<div class="checkout-area">

				<!-- Order List -->
				<h3>Your Order</h3>
				<p class="text-muted"
				   ng-show="order.length === 0">No selected items</p>
				<ul class="list-group">
					<li class="list-group-item"
						ng-repeat="item in order">
						<p>
							<span class="pull-left">{{item.name}}</span>
							<span class="text-muted pull-right">${{item.price}}</span></p>
					</li>
				</ul>
				<h4 ng-hide="order.length === 0">Total: ${{orderTotal(order)}}</h4>

				<!-- Order Submission Area -->
				<h3>Order Confirmation</h3>
				<row class="phone">
					<div class="col-md-9" id="phone-number">
						<input
							class="form-control"
							type="text"
							placeholder="e.g. 6478325099"
							ng-model="phoneNumber"/>
					</div>
					<div class="col-md-3" id="submit-button">
						<button
							class="btn btn-success"
							ng-click="makeOrder()"
							ng-disabled="order.length === 0">Make Order</button>
					</div>
				</row>
			</div>
		</div>
	</div>
</body>

<script src="bower_components/angular/angular.js"></script>
<script src="app/app.js"></script>
</html>
