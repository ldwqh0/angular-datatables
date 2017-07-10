# ngDataTables使用说明
## 快速入门
```html
<ng-datatables option="option" data="data" onChange="dataChanged(data)"></ng-datatables>
```

```javascript
$scope.option={
    columns:[{
      data:'string',
      title:'string',
      filters:[{
        name:'string',
        params:['string','string']
      }],
      template:'string'
    }],
    methods:{},
    serverSide:true,
    ajax: 'url',
    data:[],
    paging: true,
    version: 1
  }
```
 ## 配置项说明
* option.version:[number]
  表格的版本，默认为0，为0时不显示表格，当我们队表格属性做出修改之后，应该主动刷新版本号，表格数据会自动更新。
* option.serverSide:[boolean]
  是否启用服务器数据，为true时启动服务器分页。
* option.ajax:[string/object]
  ajax请求的路径或者Angular.ajax对象。
* option.paging:[boolean]
  是否启用分页
* option.columns:[Array]
  表格列配置
  * option.columns[i].data:[string]
  该列要显示的数据的(key)
  * option.columns[i].title:[string]
  列标题
  * option.columns[i].filters:[Array/string]
  数据的过滤器。支持对象和字符串模式。如果是一个数组，将对数据依次应用所有过滤器，
  支持 'filter1:params1|filter2:params2|filter3:params3'的级联字符串模式。
  注意：字符串的参数是按':'分隔的，如果你的参数中包含':',请不要使用字符串模式
    * option.columns[i].filters[i].name:[string]
    使用的过滤器名称
    * option.columns[i].filters[i].params:[Array:string]
    过滤器的参数。
    * option.columns[i].filters[i].template:[string]
    这一列使用的动态模板
* option.data:[Array[object]]
数据数组。当serverSide===false时该配置生效
* option.methods:[object]
一个对象,当我们使用template属性时，我们可以在template中使用在这里定义的方法和对象。


## 静态数据使用示例

## 服务器端数据使用示例

## 服务器通信

## 事件回调

## 使用列模板
