angular.module('aaf')
  .controller('EntityReferenceItemController', ['$location', '$log', 'reference', '$scope', '$routeParams', function($location, $log, reference, $scope, $routeParams) {
    $log.log('EntityReferenceItemController');

    $log.log('$routeParams: %o', $routeParams);

    $scope.item = {};

    if ($routeParams.itemId) {
      reference.get($routeParams.itemId)
      .then(function(item) {
        $scope.item = item;
      });
    }

    $scope.storeItem = function() {
      $log.log('EntityReferenceItemController.store()');
      $log.debug('$scope.item = %o', $scope.item);

      reference.store($scope.item)
      .then(function(result) {
        $log.debug("result = %o", result);
        $scope.close();
      })
      .catch(function(err) {
        $log.error(err);
      });
    };

    $scope.removeItem = function() {
      $log.log('EntityReferenceItemController.removeItem()');
      $log.debug('$scope.item: %o', $scope.item);

      reference.remove($scope.item)
      .then(function(result) {
        $scope.close();
      })
      .catch(function(err) {
        $log.error(err);
      });
    };

    $scope.close = function() {
      $location.path("/" + reference.getItemType());
    };

  }]);
