var appModule = angular.module('VideoListingApp', []);

appModule.constant('backArrow', 'images/Back.png');
appModule.constant('searchIcon', 'images/search.png');

appModule.controller('VideoListingController', function($scope, backArrow, searchIcon, $http, $timeout, $filter) {

    $scope.fileNum = 1;
    $scope.searchFileNum = 1;
    $scope.currentItems = 0;
    $scope.currentSearchItems = 0;
    $scope.totalItems = 1;
    $scope.searchIcon = searchIcon;
    $scope.backArrow = backArrow;
    $scope.videos = [];
    $scope.isLoading = false;
    $scope.showSearch = false;
    $scope.searchResults = [];
    $scope.searchMessage = "Search videos here...";

    $scope.doSearch = function(){
      if($scope.currentSearchItems < $scope.totalItems){
        $http.get("json/CONTENTLISTINGPAGE-PAGE"+$scope.searchFileNum+".json")
            .then(function(response) {
                angular.forEach(response.data.page['content-items'].content, function(item){
                    $scope.searchResults.push(item);
                });
                $scope.currentSearchItems += response.data.page['content-items'].content.length;
                $scope.searchFileNum++;
                $scope.doSearch();
        });
      } else {
        $scope.searchList = $filter('filter')($scope.searchResults, {name: $scope.searchInput});
        if($scope.searchList == 0){
            $scope.searchMessage = "No results found";
        }
      }
      if($scope.searchInput == ''){
          $scope.searchList = [];
          $scope.searchMessage = "Search videos here...";
      }
    };

    $scope.getVideoList = function(){
        if($scope.currentItems < $scope.totalItems && !$scope.isLoading){
            $scope.isLoading = true;
            $http.get("json/CONTENTLISTINGPAGE-PAGE"+$scope.fileNum+".json")
            .then(function(response) {
                $scope.totalItems = response.data.page['total-content-items'];
                $scope.items = response.data.page['content-items'].content;
                if($scope.fileNum == 1){
                    $scope.videos = $scope.items;
                } else {
                    angular.forEach($scope.items, function(item){
                        $scope.videos.push(item);
                    });
                }
                $scope.currentItems += $scope.items.length;
                $scope.fileNum++;
                $scope.isLoading = false;
            });
        }
    };
    $scope.getVideoList();
});

appModule.directive('whenScrollEnds', function($window,$timeout) {
    return {
        restrict: "A",
        link: function(scope, element, attr) {

          angular.element($window).bind('scroll', function() {
            var top = angular.element($window)[0].innerHeight;//angular.element($window)[0].screenTop;
            var origHeight = document.getElementById('videos').clientHeight;//angular.element($window)[0].innerHeight;
            var height = (origHeight * 0.9);
            console.log(origHeight+'-----'+height+'---'+(angular.element($window)[0].scrollY + top));
            if((angular.element($window)[0].scrollY + top) >= (height)) {
                scope.$apply(attr.whenScrollEnds);
            }
          });
        }
    }
});