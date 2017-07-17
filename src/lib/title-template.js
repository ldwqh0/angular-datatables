import module from './module'
module.directive('titleTemplate', ['$compile', $compile => {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      column: '<',
      option: '<'
    },
    link ($scope, element, attrs) {
      for (let key in $scope.option.methods) {
        $scope[key] = $scope.option.methods[key]
      }
      let html = attrs.template
      element.html(html)
      $compile(element.contents())($scope)
    }
  }
}])
export default 'titleTemplate'
