angular.module('starter.services', [])
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
            deferred.resolve(html);
          }
      ).error(
        function(html){
         // do nothing.
        }
      );
      return deferred.promise; 
    },
    update: function(datum){
      var deferred = $q.defer();
      $http({
          method: "get",
          url: "http://www.inspidee.tmp.mysmt.net/solar/",
       })
      .success(
          function(html) {
            deferred.resolve(html);
          }
      ).error(
        function(html){
          // do nothing.
        }
      );
      return deferred.promise; 
    }
  }  
}])

.factory('Settings' , [ '$http','$q', function($http, $q){
  var constants = null;
  return{
    getConstants : function(){
       var deferred = $q.defer();
       $http({
        method: 'get',
        url: 'content/constants.json'}).success(function(data){
              deferred.resolve(data);
            }
        ).error(
          function(data){
            // do nothing.
          }
        );
      return deferred.promise; 
    } 
  } 
}
]);
