angular.module( 'sample.login', [
  'auth0'
])
.controller( 'LoginCtrl', function HomeController( $scope, auth, $location ) {

  $scope.login = function() {
        auth.signin();
    }

});
