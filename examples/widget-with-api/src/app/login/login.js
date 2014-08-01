angular.module( 'sample.login', [

])
.controller( 'LoginCtrl', function HomeController( $scope, auth, $location ) {

  $scope.login = function() {
        auth.signin({
          popup: true,
        }, function() {
            $location.path('/');
        }, function() {
            console.log("There was an error signin in");
        });
    }

});
