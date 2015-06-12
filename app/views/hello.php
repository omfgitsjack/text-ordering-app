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
	<link href="bower_components/toastr/toastr.min.css" rel="stylesheet">
</head>
<body ng-app="app">
	<div ui-view class="body-container"></div>
</body>

<!-- vendor -->
<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/angular-animate/angular-animate.js"></script>
<script src="bower_components/angular-aria/angular-aria.js"></script>
<script src="bower_components/angular-material/angular-material.js"></script>
<script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script src="bower_components/angular-ui-router/release/angular-ui-router.min.js"></script>
<script src="bower_components/moment/moment.js"></script>
<script src="bower_components/moment-timezone/moment-timezone.js"></script>
<script src="bower_components/angular-moment/angular-moment.js"></script>
<script src="bower_components/toastr/toastr.min.js"></script>

<!-- models -->
<script src="app/models/models.js"></script>
<script src="app/models/food-model.service.js"></script>
<script src="app/models/order-model.service.js"></script>
<script src="app/utilities/datetime/datetime.module.js"></script>
<script src="app/utilities/datetime/datetime.config.js"></script>
<script src="app/utilities/datetime/datetime.constant.js"></script>
<script src="app/utilities/datetime/datetime.factory.js"></script>
<script src="app/admin-app.js"></script>
<script src="app/menu-app.js"></script>
<script src="app/app.js"></script>
</html>
