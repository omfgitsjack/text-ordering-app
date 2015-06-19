!function(){"use strict";function t(t){t.theme("default").primaryPalette("grey",{"default":"900"}).accentPalette("grey",{"default":"800"}).warnPalette("deep-orange"),t.theme("redThemeBtn").primaryPalette("deep-orange"),t.theme("greenThemeBtn").primaryPalette("green")}function e(t,e){e.otherwise("/menu"),t.state("/",{url:"/",templateUrl:o+"promo.html"}).state("menu",{url:"/menu",templateUrl:o+"menu.html",controller:"menuController"}).state("admin",{url:"/admin",templateUrl:o+"admin.html",controller:"adminController"})}function n(){toastr.options.timeOut=1e4,toastr.options.positionClass="toast-bottom-right"}var r="app",o="app/templates/";angular.module(r,["ui.bootstrap","ngMaterial","ui.router","app.menu","app.admin","utilities.datetime","ngSanitize"]).config(t).config(e).config(n),t.$inject=["$mdThemingProvider"],e.$inject=["$stateProvider","$urlRouterProvider"]}(),function(){"use strict";angular.module("app.admin",[])}(),function(){"use strict";var t="app.menu";angular.module(t,["app.models"])}(),function(){"use strict";angular.module("app.models",[])}(),function(){"use strict";angular.module("utilities.datetime",["angularMoment"])}(),function(){"use strict";angular.module("utilities.datetime").constant("moment",moment).constant("angularMomentConfig",{timezone:"America/Detroit"}).constant("UTC_TIMEFORMAT","YYYY-MM-DD HH:MM:SS")}(),function(){"use strict";function t(t){t.lang("en",{week:{dow:1},calendar:{lastDay:"[Yesterday], dddd MMM D",sameDay:"[Today], dddd MMM D",nextDay:"[Tomorrow], dddd MMM D",lastWeek:"dddd, MMM D",nextWeek:"dddd, MMM D",sameElse:"dddd, MMM D"}}),t.tz.add(["America/Detroit|EST EDT|50 40|01010101010101010101010|1BQT0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Rd0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0 Op0 1zb0","Etc/UTC|UTC|0|0|"])}angular.module("utilities.datetime").config(t),t.$inject=["moment"]}(),function(){"use strict";function t(t,e,n,r){t.orderService=n;var o=this,i=r.now();t.todayDay=r.now().startOf("day"),t.tomorrowDay=r.now().add(1,"days").startOf("day"),t.tomorrow=function(){t.currentDay=t.tomorrowDay},t.today=function(){t.currentDay=t.todayDay},o.init=function(){o.getOrders=function(){return 0<=i.get("hour")&&i.get("hour")<16?t.today():t.tomorrow(),n.getCurrent().success(function(e){return t.currentAggregateOrder=t.orderService.aggregateTransformer(e),t.currentOrderList=t.orderService.orderListTransformer(e),!0})},o.initPoll=function(){e(function(){o.getOrders().success(function(){toastr.info("Updated Order List"),o.initPoll()})},15e3)},o.getOrders(),o.initPoll()},o.init()}angular.module("app.admin").controller("adminController",t),t.$inject=["$scope","$timeout","OrderService","DateTimeService"]}(),function(){"use strict";function t(t){t.isCollapsed=!0}var e="app.menu";angular.module(e,["app.models"]).controller("foodController",t),t.$inject=["$scope"]}(),function(){"use strict";function t(t,e,n,r,o,i){t.order=[],t.auth={id:-1,code:""};var a=i.now();t.tomorrowDay=i.now().add(1,"days").startOf("day").format("dddd, MMMM Do"),0<=a.get("hour")&&a.get("hour")<10||toastr.warning("All orders made from this point on will be for "+t.tomorrowDay),o.get().success(function(e){t.food=e.map(function(t){return t.order={quantity:0,cost:function(){return this.quantity*t.taxedprice}},t})}),t.increment=function(t){t.order.quantity++},t.decrement=function(t){t.order.quantity--},t.$watch("food",function(e,n){e!=n&&(t.order=t.food.filter(function(t){return t.order.quantity>0}))},!0),t.orderTotal=function(t){return t.reduce(function(t,e){return t+e.order.quantity*e.taxedprice},0)},t.isCountingDown=function(){return t.countDownVal>0},t.countDownVal=0,t.disableOrderBtn=!1,t.inputPlaceHolder=function(){return t.isCountingDown()?"请等"+t.countDownVal+"秒":"下单"},t.makeOrder=function(){e.post("api/authenticate",{phoneNumber:t.phoneNumber,order:t.order}).success(function(e){toastr.success("谢谢！你的订单已经收到。请查看短信完成订单");var r=function(e){t.countDownVal=e,n(function(){e>0&&r(--e)},1e3)};r(60)})}}var e="app.menu";angular.module(e).controller("menuController",t),t.$inject=["$scope","$http","$timeout","$filter","FoodService","DateTimeService"]}(),function(){"use strict";function t(t){function e(){return moment.tz(new Date,"America/Detroit")}function n(e){return moment.isMoment(e)||exceptionService.catcher("Non-moment object detected"),e.tz("Etc/UTC").format(t)}function r(t){return moment.tz(t,"America/Detroit")}function o(){return i(e())}function i(t){for(var e=t.startOf("week"),n=[],r=0;7>r;r++)n.push(angular.copy(e).add(r,"days"));return n}var a={now:e,toUTC:n,parseUTC:r,getDaysInThisWeek:o};return a}angular.module("utilities.datetime").factory("DateTimeService",t),t.$inject=["UTC_TIMEFORMAT"]}(),function(){"use strict";angular.module("app.models").service("FoodService",["$http",function(t){return{items:[],get:function(){var e=this;return t.get("api/food").success(function(t){return e.items=t,e.items})}}}])}(),function(){"use strict";angular.module("app.models").service("OrderService",["$http",function(t){return{getCurrent:function(){return t.get("api/orders/current")},aggregateTransformer:function(t){for(var e=[],n=this,r=0;r<t.length;r++){var o=n.isInList(t[r].name,"name",e);o!==!1?e[o].quantity+=t[r].quantity:e.push({name:t[r].name,quantity:t[r].quantity})}return e},orderListTransformer:function(t){for(var e=this,n=[],r=0;r<t.length;r++){var o=e.isInList(t[r].id,"id",n);o!==!1?n[o].items.push({name:t[r].name,quantity:t[r].quantity}):n.push({id:t[r].id,phone:t[r].phone,items:[{name:t[r].name,quantity:t[r].quantity}]})}return n},isInList:function(t,e,n){for(var r=0;r<n.length;r++)if(n[r]&&n[r][e]===t)return r;return!1}}}])}();