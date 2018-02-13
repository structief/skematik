//Feedback factory
skematikFactories.factory('FeedbackFactory',["$resource", "$location", function($resource, $location) {
  var host = $location.host();
  return $resource('http://' + host + ':3000/feedback', {}, {
    sendFeedback: {
      method: 'POST',
      isArray: false
    }
  });
}]);