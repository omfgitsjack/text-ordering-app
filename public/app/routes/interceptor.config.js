(function(){
  "use strict";

  angular
    .module('app.routes')
    .run(interceptorConfig);

  function interceptorConfig($rootScope, $state, store, $mdDialog) {
    $rootScope
      .$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && !store.get('loggedIn')) {
            event.preventDefault();
            displayLoginModal($mdDialog, $state, toState);
        }
      });
  }

  function displayLoginModal(mdDialog, state, toState) {
    mdDialog.show({
      controller: 'adminLoginController',
      templateUrl: 'app/admin-login/admin-login.tmpl.html',
      parent: angular.element(document.body)
    }).then(function(res) {
      state.go(toState);
    });
  }

})();
