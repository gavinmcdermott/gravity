'use strict';

angular.module('Gravitational', [
  'ui.router',
  'Gravitational.Audit'
])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('audit', {
    url:'/audit',
    controller: 'AuditController',
    templateUrl: 'modules/audit/templates/audit-index.html',
  });
})

.run(function ($rootScope, $state) {


});
