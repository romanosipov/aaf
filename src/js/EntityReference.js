angular.module('aaf')
  .provider('entityReference', function EntityReferenceProvider() {
    var dbName = null;

    this.setDbName = function(value) {
      dbName = value;
    };

    this.$get = ['pouchDB', '$log', '$q', 'dbName', function(pouchdb, $log, $q, dbName) {
      var db = pouchdb(dbName);

      var get = function(itemId) {
        $log.log('EntityReference.get(%o)', itemId);

        var promise =
          db.get(itemId)
          .then(function(doc) {
            return doc;
          })
          .catch(function(err) {
            $log.console.error(err);
          });

        return promise;
      };

      var find = function(itemType, fields, sort) {
        fields = typeof fields !== 'undefined' ? fields : ['_id', 'name'];
        sort = typeof sort !== 'undefined' ? sort : ['name'];

        $log.log('EntityReference.find(%o, %o, %o)', itemType, fields, sort);

        var selector = {
          itemType: itemType
        };

        for (var key in sort) {
          var value = sort[key];
          selector[value] = {$gte: ""};
        }

        $log.debug("selector: %o", selector);

        var promise =
          db.find({
            selector: selector,
            fields: fields,
            sort: sort
          })
          .then(function(result) {
            return result;
          })
          .catch(function(err) {
            $log.error(err);
          });

        return promise;
      };

      var store = function(item, itemType) {
        $log.log("EntityReference.store(%o, %o)", item, itemType);

        item['itemType'] = itemType;

        var promise =
          db.post(item)
          .then(function(result) {
            $log.debug("result: %o", result);
            return get(result.id);
          })
          .catch(function(err) {
            $log.error(err);
          });

        return promise;
      };

      var remove = function(item) {
        $log.log("EntityReference.remove(%o)", item);

        var promise = null;

        if (item._id) {
          promise =
            db.remove(item)
            .catch(function(err) {
              $log.error(err);
            });
        } else {
          var promises = [];

          for (var n in item) {
            var itemId = item[n];

            promises.push(
              get(itemId)
              .then(function(result) {
                return db.remove(result);
              })
              .catch(function(err) {
                $log.error(err);
              })
            );
          }

          promise = $q.all(promises);
        }

        return promise;
      };

      return {
        get: get,
        find: find,
        store: store,
        remove: remove
      };
    }];
  });
