// Root App entry point
angular.module('Gravitational', [
  'ui.router',
  'Gravitational.Audit'
])

// Client routing basics
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('audit', {
    url:'/audit',
    controller: 'AuditController',
    templateUrl: 'modules/audit/templates/audit-index.html',
  });
});
