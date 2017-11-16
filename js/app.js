var appModule = angular.module('VideoListingApp', []);

appModule.constant('backArrow', 'images/Back.png');
appModule.constant('searchIcon', 'images/search.png');

appModule.controller('VideoListingController', function($scope, backArrow, searchIcon, $http, $timeout, $filter) {

    $scope.fileNum = 1;
    $scope.totalPages = 3;
    $scope.searchIcon = searchIcon;
    $scope.backArrow = backArrow;
    $scope.videos = [];
    $scope.isLoading = false;
    $scope.showSearch = false;

    $scope.doSearch = function(){
      $http.get("json/CONTENTLISTINGPAGE-PAGE1.json")
            .then(function(response) {
              $scope.searchResults = response.data.page['content-items'].content;
              $scope.searchList = $filter('filter')($scope.searchResults, {name: $scope.searchInput});
        // console.log($scope.searchList);
        });
    };

    $scope.getVideoList = function(){
        if($scope.fileNum <= $scope.totalPages && !$scope.isLoading){
            $scope.isLoading = true;
            $http.get("json/CONTENTLISTINGPAGE-PAGE"+$scope.fileNum+".json")
            .then(function(response) {
                $scope.items = response.data.page['content-items'].content;
                if($scope.fileNum == 1){
                    $scope.videos = $scope.items;
                } else {
                    angular.forEach($scope.items, function(item){
                        $scope.videos.push(item);
                    });
                    
                }
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
          var top = angular.element($window)[0].screenTop;
          var origHeight = angular.element($window)[0].screen.height;
          var height = (origHeight * 0.9);

          // bind the digest cycle to be triggered by the scroll event
          // when it exceeds a threshold
          angular.element($window).bind('scroll', function() {
            if (angular.element($window)[0].scrollY >= (height)) {

              // show the spinner when triggered
              // scope.spinner.hide = !scope.spinner.hide;

              angular.element($window)[0].requestAnimationFrame(function(){
                // invoke the function passed into the 'whenScrolled' attribute
                scope.$apply(attr.whenScrollEnds);

                // increment the threshold
                // height += (origHeight * 1.5);
              })
            }
          });
        }
    }
});