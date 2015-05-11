app.controller('profileCtrl', ['$scope','$http','$rootScope', function($scope,$http,$rootScope){
	var refresh = function(){
					$scope.change = "";	
				}
	

	$scope.edit = function(id){
		console.log(id);
			$http.get('/edit/'+id).success(function(response){
				//console.log(response);
				$scope.change = response;
			})

	}

	$scope.update = function(change){
		console.log(change);
		$http.put('/update/'+$scope.change._id,change).success(function(response){
			//console.log(response);
			//console.log($rootScope.currentUser);
			$rootScope.currentUser={};
			$rootScope.currentUser=$scope.change;
			refresh();
		});
	}

	
	}]);