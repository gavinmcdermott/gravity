// Audit module
angular.module('Gravitational.Audit', [])

.controller('AuditController', function($scope, $state, AuditAPI) {
  // Local cache to track changes
  var cachedLog;

  // $scope vars exposed to UI
  $scope.editAll = false;
  $scope.filtered = false;
  $scope.updates = {};

  /**
   * Toggle ability to edit all fields
   *
   * @param {req} object Express request object
   * @param {res} object Express response object
   * @return {json} json blob
   */
  $scope.toggleEditAll = function() {
    $scope.editAll = !$scope.editAll;
    $scope.log.forEach(function(item, idx) {
      item.editing = $scope.editAll 
      $('#input-' + idx).prop('checked', $scope.editAll );
    });
  }

  /**
   * Toggle ability to edit a field
   *
   * @param {index} string index of item to toggle
   */
  $scope.toggleEdit = function(index, evt) {
    var value = $scope.log[index].editing ? false : true;
    $scope.log[index].editing = value;
    if (!value) {
      $scope.log = _.cloneDeep(cachedLog);
    }
  };

  /**
   * Naive filter
   *
   * @param {propery} string 'property' to filter by
   */
  $scope.filterAuditBy = function(property) {
    $scope.filtered = true;
    $scope.log = _.filter($scope.log, function(log) {
      return log.audit[property] === true;
    });
  }

  /**
   * Update all logs that have been modified
   *
   */
  $scope.updateAll = function() {
    var updates = [];
    _.forEach($scope.log, function(possibleUpdate, idx) {
      if ( (cachedLog[idx].audit.comment    !== possibleUpdate.audit.comment) ||
           (cachedLog[idx].audit.suspicious !== possibleUpdate.audit.suspicious) ) {
        var update = _.clone(possibleUpdate.audit);
        update.id =  possibleUpdate.id;        
        updates.push(update);
      }
    });
    AuditAPI.updateLog(updates)
    .then(function(response) {
      init();      
    })
    .finally(function() {
      $scope.editAll = false;
    });
  };

  /**
   * Update single log event
   *
   * @param {index} string index to check for updates
   */
  $scope.updateEvent = function(index) {
    var update = _.clone($scope.log[index].audit);
    update.id =  $scope.log[index].id;
    AuditAPI.updateLog([update])
    .then(function(response) {
      init();      
    })
    .finally(function() {
      $scope.log[index].editing = false;
    });
  };

  /**
   * Refresh log to get latest data
   *
   */
  $scope.refreshLog = function() {
    AuditAPI.getLog()
    .then(function(response) {
      $scope.filtered = false;
      $scope.log = response.data;
      // inefficent...I know
      cachedLog = _.cloneDeep(response.data);
      $scope.latestDate = new moment(response.data[0].time)
                            .format("dddd, MMMM Do YYYY, h:mm:ss a")
                            .toString();
    });
  }

  /**
   * Controller initialization
   *
   */
  function init() {
    $scope.refreshLog();
  }
  init();

})

.factory('AuditAPI', function($http) {
  // TODO: Error handling stinks here - tidy up

  /**
   * Get all log events
   *
   * @return {promise}
   */
  function getLog() {
    return $http.get('http://localhost:3000/api/v1/events')
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.error('Error', response.status, response.data);
    });
  };

  /**
   * Update audit log items
   *
   * @return {promise}
   */
  function updateLog(updates) {
    return $http.put('http://localhost:3000/api/v1/events/audit', { updates: updates })
    .then(function(response) {
      return response.data;
    })
    .catch(function(response) {
      console.error('Error', response.status, response.data);
    });
  };

  return {
    getLog: getLog,
    updateLog: updateLog
  }
});
