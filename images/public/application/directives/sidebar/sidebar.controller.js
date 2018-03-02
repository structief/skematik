skematikControllers.controller('SidebarController',["$scope", "$rootScope", "$sce", "hotkeys", function($scope, $rootScope, $sce, hotkeys) {
	$scope.open = false;

	$rootScope.$on("sidebar.open", function(event, data){
		if(data.uuid !== undefined){
			if(data.uuid == $scope.uuid){
				$scope.open = true;
			}else{
				console.log("UUID not recognized, own uuid is: " + $scope.uuid + " <-> " + data.uuid);
			}
		}else{
			$scope.open = true;
		}
	});

	$rootScope.$on("sidebar.close", function(event, data){
		if(data.force){
			//Force all sidebars to close
			$scope.open = false;
		}else if(data.uuid !== undefined){
			if(data.uuid == $scope.uuid){
				$scope.open = false;
			}
		}else{
			$scope.open = false;
		}
	});
	
	$scope.toggleSidebar = function(){
		//Toggle state
		if($scope.open){
			$rootScope.$broadcast('sidebar.close', {uuid: $scope.uuid});
		}else{
			$rootScope.$broadcast('sidebar.open', {uuid: $scope.uuid});
		}
	}

	//Capture "escape" button
	hotkeys.bindTo($scope).add({
      combo: 'esc',
      description: 'Close sidebar on Escape',
      callback: function() {
      	$rootScope.$broadcast('sidebar.close', {uuid: $scope.uuid, "force": true});
      }
    });

}]);
