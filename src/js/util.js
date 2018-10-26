/**
 * 缩放
 */
const zoom = d3.behavior
  .zoom()
  .scaleExtent([1, 5])
  .on('zoom', zoomed)

function zoomed() {
  svg.attr(
    'transform',
    'translate(' + zoom.translate() + ')' + 'scale(' + zoom.scale() + ')'
  )
}
/**
 * 依据sta_id分类数据
 * @param {*} list 
 */
function classifyData(list, name) {
  var contain = {};
  for(let i in list) {
    if(!contain[list[i][name]]) {
      contain[list[i][name]] = []
    }
    contain[list[i][name]].push(list[i])
  }
  return contain;
}

/**
 * 获取被选中的radio值
 * @param {*} radioName 
 */
function getRadioValue(radioName){
  var radioValue;    
  radioValue=document.getElementsByName(radioName);
  if(radioValue!=null){
      var i;
      for(i=0;i<radioValue.length;i++){
          if(radioValue[i].checked){
              return radioValue[i].value;            
          }
      }
  }
  return null;
}