import angular from 'angular';

const MODULE_NAME = 'app';

// es6 class version of controller
/*class AppController {
  constructor($scope) {
    this.title = "Hello Angular.js!";
  }
}*/

angular.module(MODULE_NAME, ['rx', 'ngMaterial'])
  .component('app', {
    controller: "AppController",
    controllerAs: "vm",
    template: require("./app.html")
  })
  .controller('AppController', function($scope, $http, rx) {
    var vm = this;
    vm.title = "Welcome to Angular!";

    function searchWikipedia (term) {
      return rx.Observable
        .fromPromise($http({
          url: "http://en.wikipedia.org/w/api.php?&callback=JSON_CALLBACK",
          method: "jsonp",
          params: {
            action: "opensearch",
            search: term,
            format: "json"
          }
        }))
        .map(function(response){ return response.data[1]; });             
    }

    vm.search_term = '';
    vm.results = [];

    /*
      Creates a "click" function which is an observable sequence instead of just a function.
    */
    $scope.$createObservableFunction('click')
      .map(function () { return vm.search_term; })
      .flatMapLatest(searchWikipedia)
      .subscribe(function(results) {
        $scope.$apply(function() {
          vm.results = results;
        })
      });
  });

export default MODULE_NAME;