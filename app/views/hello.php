<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>UTCafe</title>
	<link href="http://bootswatch.com/yeti/bootstrap.css" rel="stylesheet">
	<link href="bower_components/angular-material/angular-material.css" rel="stylesheet">
	<link href="app/style.css" rel="stylesheet">
	<link href="app/menu-styles.css" rel="stylesheet">
	<link href="assets/fonts/font-awesome/css/font-awesome.css" rel="stylesheet">
</head>
<body ng-app="app.main">
	<div ng-controller="mainController">
		<div class="header-area">
			<h1>优厨房</h1>
			<h3 class="text-muted">精彩在味蕾绽放</h3>
		</div>

		<div class="title-area">
			<h3>today's utsc brunch menu</h3>
		</div>

		<div class="food-items">
			<div class="food-item"
				 ng-controller="foodController"
				 ng-repeat="item in food">

				<div class="img-container">
					<img ng-src="{{item.image}}" alt="Food Image"/>
				</div>
				<md-button class="description-button" ng-click="isCollapsed = !isCollapsed">
					description <span class="pull-right">
					<!--<i ng-show="isCollapsed" class="fa fa-plus"></i>-->
					<md-icon ng-show='isCollapsed' md-svg-src="assets/icons/ic_add_48px.svg" alt="plus"></md-icon>
				<md-icon ng-hide="isCollapsed" md-svg-src="assets/icons/ic_remove_48px.svg" alt="minus"></md-icon>
				</md-button>
				<div class="food-description-box" ng-class="{open: !isCollapsed}">
					<div class="card-text-top">
						{{item.description}}
					</div>
					<div class="card-text-bottom">
						<md-tabs md-stretch-tabs="never" md-dynamic-height="true">
							<md-tab>
								<md-tab-label>材料</md-tab-label>
								<md-tab-body>
									<md-content class="ingredients-section-content">
										{{item.ingredients}}
									</md-content>
									<div class="ingredients-section">
										{{item.ingredients}}
									</div>
								</md-tab-body>
							</md-tab>
							<md-tab>
								<md-tab-label>营养价值</md-tab-label>
								<md-tab-body>
									<div class="nutrition-tab">
										<div class="nutrition-item">
											<div class="nutrition-value">{{item.calories}}</div>
											<div class="nutrition-label">Calories</div>
										</div>
										<div class="nutrition-item">
											<div class="nutrition-value">{{item.protein}}g</div>
											<div class="nutrition-label">Protein</div>
										</div>
										<div class="nutrition-item">
											<div class="nutrition-value">{{item.fat}}g</div>
											<div class="nutrition-label">Fat</div>
										</div>
										<div class="nutrition-item">
											<div class="nutrition-value">{{item.carbs}}g</div>
											<div class="nutrition-label">Carbs</div>
										</div>
										<div class="nutrition-item">
											<div class="nutrition-value">{{item.fiber}}g</div>
											<div class="nutrition-label">Fiber</div>
										</div>
									</div>
								</md-tab-body>
							</md-tab>
						</md-tabs>
					</div>

				</div>
				<div class="cost-section">
					<div>
						<div class="menu-title">{{item.name}}</div>
						<div class="price">${{item.price}}</div>
					</div>
					<div class="quantity-selector">
						<md-button class="minus-icon md-fab md-warn md-mini md-hue-3" aria-label="Remove"
							ng-click="decrement(item)"
							ng-disabled="item.order.quantity === 0">
							<md-icon md-svg-src="assets/icons/ic_remove_48px.svg"></md-icon>
						</md-button>
						<div class="amount">
							{{item.order.quantity}}
						</div>
						<md-button class="plus-icon md-fab md-warn md-mini" aria-label="Plus"
							ng-click="increment(item)">
							<md-icon md-svg-src="assets/icons/ic_add_48px.svg"></md-icon>
						</md-button>
					</div>
				</div>
			</div>
		</div>

		<div class="food-items">
			<!-- Checkout Area -->
			<row class="checkout-area">
				<div class="col-md-6">
					<!-- Order List -->
					<h3>Your Order</h3>
					<p class="text-muted"
					   ng-show="order.length === 0">No selected items</p>
					<ul class="list-group">
						<li class="list-group-item"
							ng-repeat="item in order">
							<p>
								<span class="pull-left">{{item.order.quantity}}x {{item.name}}</span>
								<span class="text-muted pull-right">${{item.order.cost()}}</span></p>
						</li>
					</ul>
					<h4 ng-hide="order.length === 0">Total: ${{orderTotal(order)}}</h4>
				</div>
				<div class="col-md-6">
					<!-- Order Submission Area -->
					<h3>Order Confirmation</h3>
					<row class="phone">
						<div class="input-group">
							<input
								class="form-control"
								type="text"
								placeholder="e.g. 6478325099"
								ng-model="phoneNumber"/>
							<span class="input-group-btn">
								<button
									class="btn btn-success"
									type="button"
									ng-click="makeOrder()"
									ng-disabled="order.length === 0">Order</button>
							</span>
						</div><!-- /input-group -->
						<p  class="text-muted"
							ng-show="auth.id !== -1">
							Check your phone for a confirmation code.
						</p>
						<div class="input-group">
							<input
								class="form-control"
								type="text"
								placeholder="SMS Code"
								ng-show="auth.id !== -1"
								ng-model="auth.code"/>
							<span class="input-group-btn">
								<button
									class="btn btn-success"
									ng-show="auth.id !== -1"
									ng-click="checkSMSCode(auth)">
									Confirm
								</button>
							</span>
						</div><!-- /input-group -->
					</row>
				</div>
			</row>
		</div>
	</div>
</body>

<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-animate/angular-animate.js"></script>
<script src="bower_components/angular-aria/angular-aria.js"></script>
<script src="bower_components/angular-material/angular-material.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<!-- models -->
<script src="app/models/models.js"></script>
<script src="app/models/food-model.service.js"></script>
<script src="app/app.js"></script>
</html>
