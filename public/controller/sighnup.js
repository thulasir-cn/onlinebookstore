app.controller('signupCtrl',  function($scope,$http,$location,$rootScope){
			$scope.register = function(user){
				//console.log(user);
				if (user.password == user.password2) {
						$http.post('/register',user).success(function(user){
							$rootScope.currentUser = user;
							console.log(user);
							if (user) {
									$location.url('/profile');
							}
							
						});
				}else{
					console.log("passwords are not same");
				}
			}
	});