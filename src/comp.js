/**
 * create by chuchur / chuchur@qq.com
 * date :2017-07-06 10:04:57
 * author: chuchur
 */

let component = {}

let SVGNS = 'http://www.w3.org/2000/svg'

String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/gm, '')
}

Element.prototype.el = function (name, opt) {
  let el = document.createElementNS(SVGNS, name)
  this.appendChild(el)
  return el
}

Element.prototype.attr = function () {
  // if (typeof opt !== 'object') return
  let args = arguments
  if (typeof args[0] == 'string') {
    this.setAttribute(args[0], args[1])
  } else if (typeof args[0] == 'object') {
    let arg = args[0]
    for (var s in arg) {
      this.setAttribute(s, arg[s])
    }
  }
  return this
}

component.table = (width, height, opt) => {

  if (!opt.colCount || !opt.rowCount) {
    throw '缺少参数'
  }

  let root = document.createElementNS(SVGNS, 'svg')
  let h = opt.rowCount * 30
  root.attr({
    'width': width,
    'height': h,
    'viewBox': `0 0 ${width} ${h}`
  })

  let colWidth = width / opt.colCount
  let rowHeight = 30 //height / opt.rowCount
  //  col
  for (var i = 0; i < opt.colCount; i++) {
    let g = root.el('g')
    // row
    for (var j = 0; j < opt.rowCount; j++) {
      let rect = g.el('rect')
      rect.attr({
        x: i * colWidth,
        y: j * rowHeight,
        width: colWidth,
        height: rowHeight,
        fill: '#ffffff',
        stroke: '#dddddd'
      })
      let text = g.el('text')
      text.attr({
        x: i * colWidth + 5,
        y: j * rowHeight + 20,
        'font-family': 'Helvetica Neue',
        'font-size': 16,
        // stroke: '#ddddd'
        // stroke: '#dddddd',
      })
      text.innerHTML = opt.texts[i] && opt.texts[i][j] || ''
    }
  }
  return root
}

component.radio = (opt) => {
  if (typeof opt != 'object') return ''
  if (!opt.title || !opt.title.trim()) {
    alert('请输入题目！')
    return ''
  }
  let n = opt.keys.filter(x => !x.text || !x.text.trim())[0]
  if (n) {
    alert('请输入完整的答案！')
    return ''
  }
  let root = document.createElementNS(SVGNS, 'svg')
  let title = root.el('text')
  title.innerHTML = opt.title
  title.attr('y', 20)
  let opts = opt.keys || []
  if (opts.length > 0) {
    opts.map((x, i) => {
      let o = root.el('text')
      o.attr({
        x: 50,
        y: 25 * (i + 2),
        'font-size': 15
      })
      o.innerHTML = x.text || `答案${i}`

      // 边框
      let cricle = root.el('circle')
      cricle.attr({
        cx: 30,
        cy: 23 * (i + 2) + i * 1.5,
        r: 8,
        fill: '#fff',
        stroke: '#999999',
        'stroke-width': 1
      })

      if (x.checked == true) {
        let cricle1 = root.el('circle')
        cricle1.attr({
          cx: 30,
          cy: 23 * (i + 2) + i * 1.5,
          r: 4,
          fill: '#07aefc',
          // stroke: '#dddddd',
          // 'stroke-width': 1
        })
      }
    })
  }
  return root
}

component.checkbox = (opt) => {
  if (typeof opt != 'object') return ''
  if (!opt.title || !opt.title.trim()) {
    alert('请输入题目！')
    return ''
  }
  let n = opt.keys.filter(x => !x.text || !x.text.trim())[0]
  if (n) {
    alert('请输入完整的答案！')
    return ''
  }
  let root = document.createElementNS(SVGNS, 'svg')
  let title = root.el('text')
  title.innerHTML = opt.title
  title.attr('y', 20)
  let opts = opt.keys || []
  if (opts.length > 0) {
    opts.map((x, i) => {

      let o = root.el('text')
      o.attr({
        x: 50,
        y: 25 * (i + 2),
        'font-size': 15
      })
      o.innerHTML = x.text || `答案${i}`

      // 边框
      let cricle = root.el('rect')
      cricle.attr({
        x: 22,
        y: 19 * (i + 2) + i * 5.5,
        width: 16,
        height: 16,
        fill: '#fff',
        stroke: '#999999',
        'stroke-width': 1
      })

      if (x.checked == true) {
        let cricle1 = root.el('rect')
        cricle1.attr({
          x: 22 + 4,
          y: 19 * (i + 2) + i * 5.5 + 4,
          width: 8,
          height: 8,
          fill: '#07aefc',
          // stroke: '#dddddd',
          // 'stroke-width': 1
        })
      }


    })
  }
  return root
}

component.sqa = (opt) => {
  opt = opt || {}
  let a = opt.A || ''
  let q = opt.Q || ''
  if (!a.trim()) {
    alert('请输入题目！')
    return ''
  }
  if (!q.trim()) {
    alert('请输入答案！')
    return ''
  }

  let root = document.createElementNS(SVGNS, 'svg')
  let _a = root.el('text')
  _a.attr({
    y: 20
  })
  _a.innerHTML = a

  let t = root.el('text')
  t.attr({
    // x: 28,
    y: 50,
    'font-size': 14,
    fill: 'orange'
  })
  t.innerHTML = '标准答案：'

  let _q = root.el('text')
  _q.attr({
    // x: 28,
    y: 70,
    'font-size': 14
  })
  _q.innerHTML = q
  return root
}

component.line = (opt) => {
  if (!opt || typeof opt != 'object') return
  let keys = opt.keys || []
  if (keys.length > 0) {
    let root = document.createElementNS(SVGNS, 'svg')
    // title
    if (!opt.title || !opt.title.trim()) {
      alert('请输入题目！')
      return ''
    }
    let title = root.el('text')
    title.attr({
      y: 25
    })
    title.innerHTML = opt.title || '请将下面的对应的项用直线链接起来'
    // options
    let l = keys.filter(x => x.type == 1)
    let r = keys.filter(x => x.type == 2)
    let n = keys.filter(x => !x.text || !x.text.trim())[0]
    if (n) {
      alert('请输入完整的答案！')
      return ''
    }
    l.map((x, i) => {

      // left
      let t = root.el('text')
      t.attr({
        x: 15,
        y: 25 * (i + 2),
        'font-size': 14
      })
      t.innerHTML = x.text

      // 连线
      let line = root.el('line')
      let d = r.filter(y => y.value == x.value)[0]
      let index = r.indexOf(d)
      line.attr({
        x1: x.text.length * 15 + 15,
        y1: 25 * (i + 2) - 5,
        x2: 318,
        y2: 25 * (index + 2) - 5,
        stroke: '#999',
        'strike-width': 1
      })

      // right
      let t1 = root.el('text')
      t1.attr({
        x: 320,
        y: 25 * (i + 2),
        'font-size': 14
      })
      t1.innerHTML = r[index].text

    })

    return root
  }
  return ''
}

export default component
