(function () {
    "use strict";

    var ns = 'app.main';
    var food = [
        {
            name: "Bacon and Veggie Quiche",
            price: 12,
            image: 'assets/food_pic1.png',
            selected: false,
            description: "Organic grilled red onions, spinach, cremini mushrooms, free-range bacon and roasted peppers baked in a rich egg custard with a puff pastry crust. Side salad of arugula, apples, and fennel with apple cider vinaigrette.",
            ingredients: "Puff pastry, eggs, heavy cream, creme fraiche, fontina cheese, never ever bacon, roasted red peppers, spinach, red onion, cremini mushrooms, nutmeg, cayenne, grapeseed oil, kosher salt, pepper, apple arugula salad (arugula, pink lady apples, fennel, apple cider, lime zest, lime juice), vinaigrette (shallot, apple cider vinegar, olive oil, grapeseed oil, kosher salt, black pepper, honey).",
            nutrition: [
                { 'nutrition-label':'Calories', 'nutrition-value':'470' },
                { 'nutrition-label':'Protein', 'nutrition-value':'10g' },
                { 'nutrition-label':'Fat', 'nutrition-value':'22g' },
                { 'nutrition-label':'Carbs', 'nutrition-value':'13g' },
                { 'nutrition-label':'Fiber', 'nutrition-value':'1g' }
            ]
        },
        {
            name: "Grougere Sandwich",
            image: 'assets/food_pic2.png',
            price: 12,
            selected: false,
            description: "Housemade Gougere filled with cage-free scrambled egg, cauliflower-gruyere bechamel, Canadian bacon, and onion-bacon jam. Side salad of arugula, apples, and fennel with apple cider vinaigrette.",
            ingredients: "Canadian bacon, butter, flour, whole milk, cage-free eggs, gruyere, cauliflower, black pepper, thyme, onion, bacon, grapeseed oil, salt, pepper, mixed greens, house vinaigrette.",
            nutrition: [
                { 'nutrition-label':'Calories', 'nutrition-value':'470' },
                { 'nutrition-label':'Protein', 'nutrition-value':'10g' },
                { 'nutrition-label':'Fat', 'nutrition-value':'22g' },
                { 'nutrition-label':'Carbs', 'nutrition-value':'13g' },
                { 'nutrition-label':'Fiber', 'nutrition-value':'1g' }
            ]
        }
    ];

    angular
        .module(ns, [
            'ui.bootstrap',
            'ngMaterial'
        ])
        .config(materialConfig)
        .controller('mainController', mainController)
        .controller('foodController', foodController);

    function materialConfig($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('grey', {
                'default': '900'
            })
            .accentPalette('grey', {
                'default': '800'
            });
    }

    function mainController($scope, $http)
    {
        $scope.food = food; // replace later
        $scope.order = [];
        $scope.auth = {
            id: -1,
            code: ''
        };

        // Watch food collection and update order.
        $scope.$watch('food', function(newVal, oldVal) {
            if (newVal != oldVal) {
                // Update Order
                $scope.order = $scope.food.filter(function(el) {
                   return el.selected;
                });
            }
        }, true);

        // Calculate total price of order
        $scope.orderTotal = function(order) {
            return order.reduce(function(prevVal, curVal) {
                return prevVal + curVal.price;
            }, 0);
        };

        $scope.makeOrder = function() {
            $http
                .post('api/authenticate', {
                    phoneNumber: $scope.phoneNumber
                })
                .success(function(res) {
                    $scope.auth.id = res.id;
                });
        };

        $scope.checkSMSCode = function(authObj) {
	        authObj.order = $scope.order;
            $http
                .post('api/authenticate/check', authObj)
                .success(function(res) {
                    console.log(res);
                });
        }

    }

    function foodController($scope) {
        $scope.isCollapsed = true;
    }

})();
