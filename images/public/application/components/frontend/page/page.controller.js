skematikControllers.controller('PageController',["$scope", "$state", "$stateParams", "$sce", function($scope, $stateProvider, $stateParams, $sce) {
	//A hardcoded object of the pages. The backend should send this, so we can add it dynamically.
	var pages = {
		'faq': {
			'blocks': [
				{
					'type': 'faq',
					'title': 'Frequently Asked Questions',
					'data': [
						{
							'question': 'Cras mattis consectetur purus sit amet fermentum.',
							'label': 'Elit Pharetra',
							'answer': 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.'
						},
						{
							'question': 'Nulla vitae elit libero, a pharetra augue.',
							'label': 'Inceptos Amet Mollis',
							'answer': 'Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Maecenas faucibus mollis interdum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'						},
						{
							'question': 'Curabitur blandit tempus porttitor.',
							'label': 'Mollis Ornare',
							'answer': 'Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur blandit tempus porttitor. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Curabitur blandit tempus porttitor.'
						},
					]
				}
			]
		},
		'status': {
			'blocks': [
				{
					'type': 'html',
					'data': "<h2>I'm a title!</h2>"
				},
				{
					'type': 'faq',
					'data': [
						{
							'question': 'Cras mattis consectetur purus sit amet fermentum.',
							'label': 'Elit Pharetra',
							'answer': 'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas sed diam eget risus varius blandit sit amet non magna. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.'
						}
					]
				}
			]
		}
	};

	//Track the page
	if ($stateParams.slug in pages){
		$scope.page = pages[$stateParams.slug];

		//If there's any html-blocks, trust them
		for(var i=0; i<$scope.page.blocks; i++){
			if($scope.page.blocks[i].type == 'html'){
				$scope.page.blocks[i].data = $sce.trustAsHtml($scope.page.blocks[i].data);
			}
		}
	}else{
		$scope.page = 404;
	}
}]);