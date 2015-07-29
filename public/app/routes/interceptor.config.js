(function(){
  "use strict";

  angular
    .module('app.routes')
    .run(interceptorConfig);

  function interceptorConfig($rootScope, $state, $mdDialog, localStorageService) {
    $rootScope
      .$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var requireLogin = toState.data.requireLogin;

        var store;
        if (localStorageService.isSupported) {
          store = localStorageService;
        } else if (localStorageService.cookie.isSupported) {
          store = localStorageService.cookie;
        } else {
          console.log('Local Storage & Cookies are both disabled.');
          isSafariPrivateBrowsing = true;

          if (requireLogin) {
            event.preventDefault();
            alert('You cannot enter this page as it requires you to not be in safari private browsing');
            return;
          }
        }

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
