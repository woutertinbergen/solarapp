angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('ServerData' , ['$http', '$q', function($http, $q){
  return{ 
    getDay: function (datum){   
      console.log(datum);
      var deferred = $q.defer();
      $http({
          method: "get",
          url: "http://www.inspidee.tmp.mysmt.net/solar/day/",
          //params: 'dag=2014-09-10'
       })
      .success(
          function(html) {
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
}])

.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
