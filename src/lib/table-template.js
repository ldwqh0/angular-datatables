import module from './module'
module.directive('tableTemplate', ['$compile', function ($compile) {
  return {
    replace: true,
    restrict: 'E',
    scope: {
      data: '<',
      full: '<'
    },
    link: function (scope, element, attrs) {
      for (let key in scope.$parent.$ctrl.option.methods) {
        scope[key] = scope.$parent.$ctrl.option.methods[key]
      }
      let html = attrs.template
      element.html(html)
      $compile(element.contents())(scope)
    }
  }
}])
export default 'tableTemplate'
