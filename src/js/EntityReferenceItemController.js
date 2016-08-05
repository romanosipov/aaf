angular.module('aaf')
  .controller('EntityReferenceListController', ['$scope', '$log', 'reference', '$location', function($scope, $log, reference, $location) {
    $log.log('EntityReferenceListController');
    $scope.items = [];

    var init = function() {
      $log.log('EntityReferenceListController.init()');

      reference.find()
      .then(function(result) {
        $log.debug("result = %o", result);
        $scope.items = result.docs;
      })
      .catch(function(err) {
        $log.error(err);
      });
    };

    init();

    $scope.editItem = function(item) {
      $location.path('/' + reference.getItemType() + '/item/' + item._id);
    };

    $scope.selectAll = false;
    $scope.selected = [];

    $scope.toggle = function() {
      for (var n in $scope.items) {
        $scope.selected[n] = $scope.selectAll;
      }
    };

    $scope.removeItems = function() {
      $log.log("EntityReferenceListController.removeItems()");

      var itemsToRemove = [];
      for (var n in $scope.selected) {
        itemsToRemove.push($scope.items[n]._id);
      }

      if (itemsToRemove.length > 0) {
        reference.remove(itemsToRemove)
        .then(function(result) {
          $scope.selectAll = false;
          $scope.selected.length = 0;
          init();
        })
        .catch(function(err) {
          $log.error(err);
        });

      }
    };
  }]);
