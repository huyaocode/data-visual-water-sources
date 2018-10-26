// 简单实现，参数只能从右到左传递
function createCurry(func, args) {
  var arity = func.length
  var args = args || []

  return function() {
    var _args = [].slice.call(arguments)
    ;[].push.apply(_args, args)
    // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
    if (_args.length < arity) {
      return createCurry.call(this, func, _args)
    }
    // 参数收集完毕，则执行func
    return func.apply(this, _args)
  }
}

var curryHandleData = createCurry(handleData)

function readFile(uris) {

  (function getData(i){
    d3.json(uris[i], function(err, dataset) {
      curryHandleData = curryHandleData(dataset)
      if(++i == uris.length) {
        return;
      }
      getData(i)
    })
  })(0)
}

readFile([
  '../static/waterData.json',
  '../static/siteInfo.json',  
  '../static/china.geojson',
])

//删除已下两条数据，因为lat值太大以至于在计算时越界
//{"code":"76","name":"江西九江河西水厂","basin":"长江","section":"长江干流（鄂-赣省界）","lon":"25.13333333","lat":"93.7","description":"江西九江河西水厂水质自动监测站位于九江市湖口洋港国家储备粮库码头附近。点位坐标北纬93°42′，东经25°08′。长江流域，长江干流（鄂-赣省界）。由九江市环境监测站托管，距离60余公里。建于2001年1月。","custodian":"九江市环境监测站","setupdate":"2001年1月","status":""},
//{"code":"113","name":"宁夏中卫新墩","basin":"黄河","section":"黄河干流（甘-宁省界）","lon":"37.45","lat":"105.0333333","description":"宁夏中卫新墩水质自动监测站位于宁夏回族自治区中卫市下河沿断面左侧河岸。点位坐标东经37度27分，北纬105度02分。黄河流域，黄河干流（甘-宁省界）。该站由中卫市环境监测站托管。距离10公里。建于2002年10月。","custodian":"中卫市环境监测站","setupdate":"2002年10月","status":""},
