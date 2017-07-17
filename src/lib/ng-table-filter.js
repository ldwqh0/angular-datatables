import module from './module'
module.filter('ngTableFilter', ['$filter', '$sce', function ($filter, $sce) {

  function getValueByFilter (val, filter) {
    let filter_
    let params_
    if (typeof filter === 'string') {
      let fls = filter.split(':')
      filter_ = fls[0]
      params_ = fls[1]
    } else {
      filter_ = filter.name
      params_ = filter.params
    }
    return $filter(filter_)(val, params_)
  }

  return function (val, filters) {
    try {
      let result = val
      if (filters && typeof filters === 'string') {
        filters = filters.split('|')
      }
      if (filters && filters instanceof Array) {
        for (let i in filters) {
          let filter = filters[i]
          result = getValueByFilter(val, filter)
        }
      } else {
        return val
      }
      return $sce.trustAsHtml(result)
    } catch (e) {
      return ''
    }
  }
}])
export default 'ngTableFilter'
