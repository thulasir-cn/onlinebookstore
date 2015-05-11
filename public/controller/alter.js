var app = angular.module("demoapp",['ngRoute']);

app.config(['$routeProvider',function($routeProvider) {


// 	$locationProvider.html5Mode({
//   enabled: true,
//   requireBase: false
// });


	      $routeProvider.when('/home', {
			             
			              templateUrl: 'views/home/home.html',
			              controller: 'homeCtrl'
	                  }).when('/kart', {
			             
			              templateUrl: 'views/home/kart.html',
			              controller: 'kartCtrl'
	                  }).when('/aboutus', {
	                     
	                      templateUrl: 'views/aboutus.html',
	                      controller: 'aboutCtrl'
	                 }).when('/services', {
	                     
	                      templateUrl: 'views/services.html',
	                      controller: 'servicesCtrl'
	                 }).when('/login', {
	                 	  templateUrl: 'views/login.html',
	                      controller: 'logintCtrl'
	                 }).when('/dashboard', {
	                 	  templateUrl: 'views/dashboard.html',
	                      controller: 'dashboardCtrl',
	                      resolve  :{
	                      	logincheck : checkLogin
	                      }
	                 }).when('/contact', {
	                 	  templateUrl: 'views/contactus.html',
	                      controller: 'contactCtrl'
	                 }).when('/profile', {
	                 	  templateUrl: 'views/profile.html',
	                      controller: 'profileCtrl',
	                      resolve  :{
	                      	logincheck : checkLogin
	                      }
	                 }).when('/logout', {
 	                      controller: 'navCtrl'
	                 }).when('/signup', {
	                 	  templateUrl: 'views/signup.html',
	                      controller: 'signupCtrl'
	                 }).otherwise({
                            
                           redirectTo: '/home'
                          
                          });
}]);


app.controller('homeCtrl', function($scope,$http,$location,$rootScope){
	
		// $http.get('/bookslist').success(function(response){
		// 	//console.log(response);
		// 	$scope.books = response;
		// });

$scope.books = bookService.getBooks();
	
	
	$scope.addToKart = function(book) {
	
		kartService.addToKart(book);
	
	}

			var kart = new Array();
				$scope.addToKart = function(book){
						//console.log(book);
						if ($rootScope.currentUser) {
								kart.push(book);
								console.log(kart.length);
								//$location.url('/home');
								console.log($rootScope.currentUser._id);
									$http.put('/kartlist/'+$rootScope.currentUser._id,kart).success(function(response){
										console.log(response);
						
								});
						}
						else{
							$location.url('/login');
						}
				

				};
				
		
});

app.controller('kartCtrl', function($scope,$http,$location,$rootScope){
		
				console.log($rootScope.currentUser._id);
		
				
				$http.get('/kartdata/'+$rootScope.currentUser._id).success(function(response){
					console.log(response);
					$scope.books = response;
						});




//$scope.kart = kartService.getKart();
	

});



app.factory('bookservice', function(){

	$http.get('/bookslist').success(function(response){
			//console.log(response);
			$scope.books = response;
		});
	
	return {
		getBooks: function() {
			return books;
		}
		
	}
})
app.factory('kartservice'function($http,$location,$rootScope){
	var kart = [];
	return {
		// getKart: function() {
		// 	return kart;

		// },
		addToKart: function(book) {
			//kart.push(book);
				if ($rootScope.currentUser) {
								kart.push(book);
								console.log(kart.length);
								//$location.url('/home');
								console.log($rootScope.currentUser._id);
									$http.put('/kartlist/'+$rootScope.currentUser._id,kart).success(function(response){
										console.log(response);
						
								});
						}
						else{
							$location.url('/login');
						}
		}
})

app.controller('aboutCtrl', ['$scope', function($scope){
	
}]);
app.controller('contactCtrl', ['$scope', function($scope){
	
}]);
app.controller('servicesCtrl', ['$scope', function($scope){
	
	}]);

app.controller('navCtrl', function($scope,$http,$location,$rootScope){
				$scope.logout = function(){
						$http.get('/logout').success(function(){
							$location.url('/login');
							$rootScope.currentUser = null;
						});
					}
		});

var checkLogin = function($q,$http,$location,$rootScope){
			
			var deferred = $q.defer();
			
			$http.get('/loggedin').success(function(user){
						//$rootScope.errorMessage = null;
						//user autenticted 
						if (user !== '0') {
								$rootScope.currentUser = user; 
								deferred.resolve();

						}
						//user is not autenticated
						else{
							//$rootScope.errorMessage = "you need to log in";
							deferred.reject();
							$location.url('/login');
						}
			
			})
			return deferred.promise;
};

	





