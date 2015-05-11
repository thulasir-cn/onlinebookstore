var app = angular.module("demoapp",['ngRoute']);
var socket = io();


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
	                 }).when('/chat', {
	                 	  templateUrl: 'views/chat.html',
	                      controller: 'chatCtrl'
	                 }).otherwise({
                            
                           redirectTo: '/home'
                          
                          });
}]);


app.controller('homeCtrl', function($scope,$http,$location,$rootScope){
	
		$http.get('/bookslist').success(function(response){
			//console.log(response);
			$scope.books = response;
		});

//var kart = new Array();
	$scope.addToKart = function(book){
			//console.log(book);
			if ($rootScope.currentUser) {
					//kart.push(book);
					//console.log(kart.length);
					$location.url('/home');
					//$location.replace();
					console.log($rootScope.currentUser._id);
						$http.post('/kartlist/'+$rootScope.currentUser._id,book).success(function(response){
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
				var refresh = function (){
					$http.get('/kartdata/'+$rootScope.currentUser._id).success(function(response){
						console.log(response);
						$scope.books = response;
					});
				}
				refresh();
				// var index = $scope.kart.indexOf(book);
				

		
		$scope.remove = function(book){
			console.log(book);
			//var index = $scope.books.indexOf(book);
			$http.post('/delkart/'+$rootScope.currentUser._id,book).success(function(response){
							console.log(response);
							refresh();
						});
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

app.controller('chatCtrl', function($scope,$rootScope,$http){

var refresh = function (){
				
				$http.get('/comments').success(function(response){
					console.log(response);
				$scope.messages = response;

			});		
		}
		refresh();

	$scope.user = $rootScope.currentUser;
	
	if ($rootScope.currentUser) {

			$scope.send = function(msg){
			console.log(msg);
			socket.emit('user',$rootScope.currentUser.firstName);
							      socket.emit('chat message',msg);
							      $scope.msg = '';
							      refresh();


			}
			socket.on('from server',function(comment){
				//console.log(comment);

			});

		
		};
			
			

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

	





