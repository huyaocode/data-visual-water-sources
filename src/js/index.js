let siteData //全局变量， 存放分类后的水源数据

/**
 * 当数据加载完后会自动调用此函数
 *
 * @param {*} mapData 中国地图
 * @param {*} siteInfo 站点信息
 * @param {*} waterData 站点收集的水源数据
 */
function handleData(mapData, siteInfo, waterData) {
  window.mapData = mapData
  drawMap()
  pointSite(siteInfo)
  siteData = classifyData(waterData, 'sta_id')
}

const width = 700
const height = 500

/**
 * 创建SVG
 */
const svg = d3
  .select('body')
  .select('#svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .call(zoom)

let projection = d3.geo
  .mercator()
  .center([107, 31])
  .scale(3900)
  .translate([width / 2.0, height / 1.5])

/**
 * 绘制地图
 */
function drawMap() {
  var path = d3.geo.path().projection(projection)
  svg
    .selectAll('path')
    .data(mapData.features)
    .enter()
    .append('path')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1)
    .attr('fill', 'rgb(190,219,249)')
    .attr('d', path)
}

/**
 * 绘制站点
 */
function pointSite(root) {
  var tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return '<span>' + d.name + '</span>'
    })
  svg.call(tip)

  svg
    .append('g') //在China画布上新建g组合标签
    .selectAll('circle') //选中所有circle标签
    .data(root)
    .enter() //进入循环内部
    .append('circle') //每一个循环新增一个点circle
    .attr('r', 2) //设置circle的半径
    .attr('cx', function(d, i) {
      let pos = projection([d.lon, d.lat])
      d3.select(this).attr('cy', pos[1])
      return pos[0]
    })
    .attr('fill', '#f66')
    .attr('cursor', 'pointer')
    //出tips
    .on('mouseenter', tip.show)
    .on('mouseleave', tip.hide)
    //改颜色
    .on('mouseover', function(d, i) {
      d3.select(this).attr('fill', 'yellow')
    })
    .on('mouseout', function(d, i) {
      d3.select(this).attr('fill', '#f66')
    })
    //调用展示细节函数
    .on('mousedown', function(d) {
      showWaterData(d)
      const detailDOM = document.getElementsByClassName('dateWrapper')[0];
      detailDOM.style.display = 'block'
      //将总有机碳选项选上
      const ppradio = document.getElementById('sta_pp_l')
      ppradio.setAttribute('checked', 'checked')
      //展示站点细节
      const siteDOM = document.getElementById('site-detail-str');
      siteDOM.innerText = '水源位置：' + d.section;
    })
}

/**
 * -----------------交互部分---------------------
 */

/**
 * 点击地图上的点
 *
 * 展示站点数据
 * @param {*} site
 */
function showWaterData(site) {
  const data = siteData[site.code]
  let t = ''
  const dateUl = document.getElementById('date')
  dateUl.innerHTML = ''
  let dli //存放每天的节点
  const tMap = {
    '00:00:00': {},
    '04:00:00': {},
    '08:00:00': {},
    '12:00:00': {},
    '16:00:00': {},
    '20:00:00': {}
  }
  for (let i in data) {
    const date = data[i].sta_time.slice(0, 11)

    if (date != t) {
      //存在新一天
      t = date
      dli = document.createElement('li')
      dli.setAttribute('class', 'd')
      dli.setAttribute('date', date)
      dateUl.appendChild(dli)
      //为这一天添加6个时间点
      for (let t in tMap) {
        tMap[t] = {}
        let hli = document.createElement('li') //每个小时节点
        hli.setAttribute('class', 'h')
        hli.onmouseover = showDetail
        dli.appendChild(hli)
        tMap[t].ele = hli
      }
    }
    const time = data[i].sta_time.slice(11)
    for (let attr in data[i]) {
      tMap[time] && tMap[time].ele.setAttribute(attr, data[i][attr])
    }
  }
}

/**
 * 点击单选框，展示不同数据
 */
document.getElementById('choose').onclick = function(e) {
  if (e.target.id) {
    let date = document.getElementById('date')
    date.setAttribute('class', 'day-list show_' + e.target.id)
  }
}
function showDetail(e) {
  let attrs = e.target.attributes
  let detailStr = ''
  if (attrs.sta_id) {
    detailStr = `${attrs.sta_time.value} PH值: ${
      attrs.sta_ph_v.value
    } 溶解氧: ${attrs.sta_do_v.value} 氨氮: ${attrs.sta_an_v.value} 高锰酸钾: ${
      attrs.sta_toc_v.value
    } 总有机碳: ${attrs.sta_pp_v.value}`
  } else {
    detailStr = ''
  }
  document.getElementById('detail-str').innerText = detailStr
}
