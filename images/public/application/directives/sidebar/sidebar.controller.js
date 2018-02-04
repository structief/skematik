skematikControllers.controller('SidebarController',["$scope", "$rootScope", "$sce", function($scope, $rootScope, $sce) {
	$scope.open = false;

	$rootScope.$on("sidebar.open", function(){
		$scope.open = true;
	});
	$rootScope.$on("sidebar.close", function(){
		$scope.open = false;
	});
	
	$scope.toggleSidebar = function(){
		//Toggle state
		if($scope.open){
			$rootScope.$broadcast('sidebar.close', {});
		}else{
			$rootScope.$broadcast('sidebar.open', {});
		}
	}

	//Capture "escape" button
}]);
