angular.module('sampleApp', ['ngRoute', 'aaf'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when("/", {
        redirectTo: '/ref-animal'
      })
      .when('/ref-animal', {
        templateUrl: './partials/animal-list.html',
        controller: 'AnimalListController'
      })
      .when('/ref-animal/item/:itemId?', {
        templateUrl: './partials/animal-item.html',
        controller: 'AnimalItemController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['entityReferenceProvider', function(entityReferenceProvider) {
    entityReferenceProvider.setDbName('animaldb');

    var db = new PouchDB('animaldb');
    var promises = [];
    promises.push(db.createIndex({
      index: {
        name: "By name",
        fields: ["name"]
      }
    }));

    $.when.apply($, promises).done(function(arg1, arg2) {
      return true;
    });

  }])
  .config(['pouchDBProvider', 'POUCHDB_METHODS', function(pouchDBProvider, POUCHDB_METHODS) {
    var methods = {
      find: 'qify'
    };
    pouchDBProvider.methods = angular.extend({}, POUCHDB_METHODS, methods);
  }])
  .factory('AnimalReference', ['$log', 'entityReference', function($log, entityReference) {
    var get = function(itemId) {
      $log.log('AnimalReference.get(%o)', itemId);

      return entityReference.get(itemId);
    };

    var find = function() {
      $log.log('AnimalReference.find()');

      return entityReference.find('ref-animal', ['_id', 'name'], ['name']);
    };

    var store = function(item) {
      $log.log('AnimalReference.store(%o)', item);

      return entityReference.store(item, 'ref-animal');
    }

    var remove = function(item) {
      $log.log('AnimalReference.remove(%o)', item);

      return entityReference.remove(item);
    }

    var getItemType = function() {
      return "ref-animal";
    };

    return {
      get: get,
      find: find,
      store: store,
      remove: remove,
      getItemType: getItemType
    };
  }])
  .controller('AnimalListController', ['$controller', '$scope', '$location', 'AnimalReference', '$log', function($controller, $scope, $location, animalReference, $log) {
    $log.log("AnimalListController.init()");
    $controller('EntityReferenceListController', {
      $scope: $scope,
      $location: $location,
      reference: animalReference,
      $log: $log
    });
  }])
  .controller('AnimalItemController', ['$controller', '$scope', '$location', 'AnimalReference', '$log', function($controller, $scope, $location, animalReference, $log) {
    $log.log('AnimalItemController');
    $controller('EntityReferenceItemController', {
      $scope: $scope,
      $location: $location,
      reference: animalReference,
      $log: $log
    });
  }]);
