import '../style/style.less'
import template from './template.html'
import angular from 'angular'
import module from './module'

let component = {
  template,
  controller: TableController,
  bindings: {
    option: '<', // 表格配置选项
    data: '<', // 本地数据
    onChange: '&' // 数据改变事件，可以监听该事件，以便获取到表格的数据内容
  }
}

TableController.inject = ['$scope', '$log', '$http']

function TableController ($scope, $log, $http) {
  let ctrl = this
  // 声明一个对象，保存当前的表格状态
  ctrl.state = {
    data: [], // 表格当前显示的数据
    totalItems: 0, // 表格数据总量
    page: 1,
    size: 10, // 当前表格数据条数
    start: 0, // 显示记录的起始条数
    end: 0, // 显示记录的末尾条数
    draw: 0, // 服务器重绘标记
    isLoading: false// 服务器加载标记
  }
  /**
   * 支持的配置项
   * 当启用serverSide=true时，data属性无效
   * 当serverSide=false时，ajax属性无效
   * 当version<=0时，表格不会显示数据
   * @type {{serverSide: boolean, serverParams: {}, ajax: string, columns: Array, paging: boolean, version: number}}
   */
  let option = {
    serverSide: false, // 是否启用服务器数据
    serverParams: {}, // 服务器参数
    methods: {}, // 表格方法，这些方法可以在表格模板中使用
    ajax: '', // 请求配置
    columns: [], // 表格列配置
    paging: true, // 是否启用分页
    /**
     * 用来记录表格配置的变化历史，当表格的整体配置项改变时，应该更新该版本号。
     * */
    version: 0
  }

  // 调转到指定页码
  ctrl.goPage = function () {
    $log.debug('go page ' + ctrl.state.page)
    loadData()
    // ctrl.option.version++
  }

  ctrl.getData = function (data, prop) {
    try {
      if (/^[0-9]/.test(prop)) {
        return data[prop]
      } else {
        return eval('(' + JSON.stringify(data) + '.' + prop + ')')
      }
    } catch (e) {
      return ''
    }
  }

  ctrl.$onInit = function () {
    // 配置表格默认值
    ctrl.option = copyOption(ctrl.option, option)
    // 监视表格版本值的变化，刷新数据
    $scope.$watch('$ctrl.option.version', function (v) {
      if (v && v > 0) {
        $log.debug('the table version is changed')
        /**
         * 当检测到表格配置改变之后，应该将显示页码置为1
         * @type {number}
         */
        ctrl.state.page = 1
        loadData()
      }
    })
  }

  function copyOption (dist, src) {
    for (let key in src) {
      if (typeof dist[key] === 'undefined') {
        dist[key] = src[key]
      }
    }
    return dist
  }

  // 加载数据
  function loadData () {
    $log.debug('load data ...')
    if (ctrl.option.serverSide) {
      loadServerData()
    } else {
      loadLocalData()
    }
  }

  // 加载服务器数据
  function loadServerData () {
    $log.debug('load data from server')
    ctrl.state.isLoading = true
    let ajax = {
      method: 'GET',
      url: '',
      params: angular.extend({}, ctrl.option.serverParams, {
        draw: ++ctrl.state.draw,
        page: ctrl.state.page - 1,
        size: ctrl.state.size
      })
    }
    if (typeof ctrl.option.ajax === 'string') {
      ajax.url = ctrl.option.ajax
    } else {
      ajax = angular.extend(ajax, ctrl.ajax)
    }
    $http(ajax).then(response => {
      ctrl.state.isLoading = false
      let result = response.data
      if (ctrl.state.draw === result.draw) {
        ctrl.state.data = []
        let start = 0
        let end = 0
        let page = ctrl.state.page
        let size = ctrl.state.size
        start = (page - 1) * size
        end = start + size
        if (end > result.recordsTotal) {
          end = result.recordsTotal
        }
        if (result.recordsTotal > 0) {
          start = start + 1
        }
        ctrl.state.start = start
        ctrl.state.end = end
        ctrl.state.error = result.error
        ctrl.state.data = setIndex(result.data) // 显示数据
        ctrl.state.totalItems = result.recordsTotal
        $log.debug('get data from server', ctrl.state.data)
        ctrl.onChange({data: ctrl.state.data})
      } else {
        $log.debug('返回的戳标记和本地标记不一致，不刷新表格，本地标记===' + ctrl.state.draw + ',返回标记===' + result.draw)
      }
    }, err => {
      ctrl.state.isLoading = false
      console.log(err)
    })
  }

  // 加载本地数据
  function loadLocalData () {
    $log.debug('load data from local data')
    let data = ctrl.data

    if (!data || data.length <= 0) {
      data = []
    }

    let total = ctrl.state.totalItems = data.length
    let start = 0
    let end = 0
    if (ctrl.option.paging) {
      let page = ctrl.state.page
      let size = ctrl.state.size
      start = (page - 1) * size
      end = start + size
      if (end > total) {
        end = total
      }
    } else {
      end = total
    }
    if (data.length > 0) {
      ctrl.state.start = start + 1
    } else {
      ctrl.state.start = 0
    }
    ctrl.state.end = end
    ctrl.state.data = data.slice(start, end)
    setIndex(ctrl.state.data)
    ctrl.onChange({'data': ctrl.state.data})
  }

  function setIndex (data) {
    if (data && data instanceof Array && data.length > 0) {
      let start = (ctrl.state.page - 1) * ctrl.state.size
      for (let value of data) {
        value['$$index'] = start++
      }
      return data
    }
  }
}

module.component('ngDatatables', component)
