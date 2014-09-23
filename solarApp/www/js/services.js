angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('ServerData' , ['$http', '$q', function($http, $q){
  return{ 
    getDay: function (datum){   
      var deferred = $q.defer();
      $http({
          method: "get",
          url: "http://www.inspidee.tmp.mysmt.net/solar/day/",
          params: {
            dag: datum,
          }
       })
      .success(
          function(html) {
            //console.log(html);
            deferred.resolve(html);
          }
      ).error(
        function(html){
          console.log('3 error');
        }
      );
      return deferred.promise; 
    },
    update: function(datum){
      console.log('update');
      var deferred = $q.defer();
      $http({
          method: "get",
          url: "http://www.inspidee.tmp.mysmt.net/solar/",
       })
      .success(
          function(html) {
            console.log('ok'+html);
            deferred.resolve(html);
          }
      ).error(
        function(html){
          //console.log(html);
          console.log('3 error');
        }
      );
      return deferred.promise; 
    }
  }  
}]);
