app.controller('logintCtrl',function($scope,$http,$rootScope,$location){
		$scope.login = function(user){
				//console.log(user);
				$http.post('/login',user).success(function(responce){
					$rootScope.currentUser = responce;
					//console.log(responce);
				 if ($rootScope.currentUser.username !== 'admin@gmail.com') {
						$location.url('/profile');
				}else{
					$location.url('/dashboard');
				}
				
			});
		}
	});