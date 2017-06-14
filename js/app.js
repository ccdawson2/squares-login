// script.js

var myApp = angular.module('myApp', ['ngRoute']);

myApp.value('config', {
    authURL:    "http://localhost:10100/",
    usersURL:   "http://localhost:10101/",
    squaresURL: "http://localhost:10104/",
	loggedInUserId: "",
	loggedInFullName: "",
	authToken: ""
});

myApp.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })
        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController'
        })
        .when('/register', {
            templateUrl : 'pages/register.html',
            controller  : 'registerController'
        })
        .when('/squares', {
            templateUrl : 'pages/squares.html',
            controller  : 'squaresController'
        })
        .when('/logout', {
            templateUrl : 'pages/logout.html',
            controller  : 'logoutController'
        });
});

myApp.controller('mainController', ['$scope', '$route', 'config', mainController]);
	
function mainController($scope, $route, config)	{
	
    if ($scope.user == undefined)
 	   $scope.message = 'Please Log In or Register';		
	   
	var defaultMenus = [
	   {"href":"#",         "menuName":"Home"},
	   {"href":"#login",    "menuName":"Login"},
	   {"href":"#register", "menuName":"Register"}];
	   
	$scope.menuitems = defaultMenus;
       
    $scope.$on('userChange', function(event, data) {

       $scope.user = data;
       $scope.message = 'Welcome ' + config.loggedInFullName;
	      
	   if ($scope.user == undefined)
          $scope.menuitems = defaultMenus;
		   
	   else
	      $scope.menuitems = [
	           {"href":"#",         "menuName":"Home"},
		       {"href":"#squares",  "menuName":"Squares"},
	   	       {"href":"#logout",   "menuName":"Logout"}];

       $route.reload();
	   }
	);
};

myApp.controller('loginController', ['$scope', '$location', '$http', 'config', loginController]);

function loginController($scope, $location, $http, config) {

    $scope.message = 'Please Log In';
	
	$scope.validateUser = function() {

	$http({
       method: 'GET',
       url: config.authURL + 'authenticateUser/?name=' + $scope.name +
                                              '&pword=' + $scope.password
    }).then(function successCallback(response) {
       {
    	  config.loggedInUserId = response.data.userId;
          config.loggedInFullName = response.data.fullName;
		  
	      config.authToken = response.data.token;	  
          $location.path("/");	
          $scope.$emit('userChange', $scope.name);	   
	   } 

    }, function errorCallback(response) {
       alert('Invalid Login');
    });	
  };
};

myApp.controller('logoutController', ['$scope', '$location', logoutController]);

function logoutController($scope, $location) {

    $scope.message = 'Please Log Out';
 
	$scope.logout = function() {

	   $scope.$emit('userChange', undefined);
       $location.path("/");	
	};
};

myApp.controller('registerController', function($scope) {
    $scope.message = 'Please Register as a New User';

	$scope.registerUser = function() {
	};
});

myApp.controller('squaresController', ['$scope', '$http', 'config', squaresController]);

function squaresController ($scope, $http, config) {
	
    $scope.message = 'Squares owned by ' + config.loggedInFullName;
	
	var postData = {};
	postData.token = config.authToken;

    console.log("postData.token = " + postData.token);

	$http({
       method: 'POST',
       url: config.squaresURL + 'tokens',
	   data: postData
    }).then(function successCallback(response) {
	
	   $http({
          method: 'GET',
		  headers: postData, // {'token':'sdfdfd'}
          url: config.squaresURL + 'squares/?size=100' +
                                             '&user='  + config.loggedInUserId
											  
       }).then(function successCallback(response) {

console.log(response.data);
		  $scope.squares = response.data;
   
       }, function errorCallback(response) {
          alert('Error 1 returned from squares GET');
       });
	   
    }, function errorCallback(response) {
       alert('Error 2 returned from squares GET');
    });	
	
    $scope.view = function(squareId) {

	   alert(squareId);	
	};
};
