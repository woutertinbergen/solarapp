
angular.module('starter.directives', ['LocalStorageModule'])
.directive('editInPlace', ['localStorageService','$timeout', function (localStorageService, $timeout) {
    return {
        restrict: 'E',
        scope: {
            value: '='
        },
        template: '<span ng-click="edit()" ng-bind="value"></span><input ng-model="value" type="number"></input>&nbsp;<i ng-click="edit()" class="ion-edit"></i>',
        link: function ($scope, element, attrs) {
            var inputElement = angular.element(element.children()[1]);
            element.addClass('edit-in-place');
            $scope.editing = false;
            
            $scope.edit = function () {
                $scope.editing = true;
                element.addClass('active');
                $timeout(function() { // else there is a inmediate ONBLUR
                    inputElement[0].focus();
                });
           
            };
            // When we leave the input, we're done editing. TO DO : update for submit file
            inputElement.prop('onblur', function () {
                localStorageService.set('energieprijs',$scope.value);
                $scope.editing = false;
                element.removeClass('active');
            });
        }
    };
}]);