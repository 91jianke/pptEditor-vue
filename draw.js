/**!
 * create by chuchur /chuchur@qq.com
 * 2017年6月10日 22:39:29
 * author：chuchur
 * version:1.0.5
 */

import qdraw from 'qdraw'

let draw = {}

const getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
const pad = function (str, length) {
  while (str.length < length) {
    str = '0' + str
  }
  return str
}
const getRandomColor = function () {
  return (
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2)
  )
}

const getRandomLeftTop = function () {
  var offset = 50
  return {
    left: qdraw.util.getRandomInt(0 + offset, 700 - offset),
    top: qdraw.util.getRandomInt(0 + offset, 500 - offset)
  }
}
const capitalize = function (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
const getRandomNum = (min, max) => {
  return Math.random() * (max - min) + min
}
let canvas = null

draw.init = (_canvas) => {
  canvas = _canvas
  const render = () => {
    canvas.renderAll()
  }
  // let viewportLeft = 0
  // let viewportTop = 0
  // let mouseLeft
  // let mouseTop
  // let _drawSelection = canvas._drawSelection
  // let isDown = false

  canvas
    .on('object:selected', render)
    .on('group:selected', render)
    .on('path:created', render)
    .on('selection:cleared', render)
  // .on('mouse:down', (options) => {
  //   isDown = true
  //   viewportLeft = canvas.viewportTransform[4]
  //   viewportTop = canvas.viewportTransform[5]

  //   mouseLeft = options.e.x
  //   mouseTop = options.e.y
  //   _drawSelection = canvas._drawSelection
  //   canvas._drawSelection = function () {}
  // })
  // .on('mouse:wheel', (opt) => { // 鼠标滚轮缩放
  //   var e = opt.e
  //   var newZoom = canvas.getZoom() + e.deltaY / 300
  //   canvas.zoomToPoint({
  //     x: e.offsetX,
  //     y: e.offsetY
  //   }, newZoom)

  //   // renderVieportBorders();
  //   e.preventDefault()
  // })
  // .on('mouse:move', (opt) => {
  //   var currentMouseLeft = opt.e.x
  //   var currentMouseTop = opt.e.y

  //   var deltaLeft = currentMouseLeft - mouseLeft
  //   var deltaTop = currentMouseTop - mouseTop

  //   canvas.viewportTransform[4] = viewportLeft + deltaLeft
  //   canvas.viewportTransform[5] = viewportTop + deltaTop

  //   canvas.renderAll()
  // })
  // canvas.cornerStyle = 'circle'
}

// 组件属性设置

const getActiveProp = function (name) {
  if (!canvas) return ''
  var object = canvas.getActiveObject()
  if (!object) return ''

  return object[name] || ''
}
const setActiveProp = function (name, value) {
  if (!canvas) return ''
  var object = canvas.getActiveObject()
  if (!object) return
  object.set(name, value).setCoords()
  canvas.renderAll()
}
const getActiveStyle = function (styleName, object) {
  if (!canvas) return ''
  object = object || canvas.getActiveObject()
  if (!object) return ''

  return (object.getSelectionStyles && object.isEditing) ? (object.getSelectionStyles()[styleName] || '') : (object[styleName] || '')
}
const setActiveStyle = function (styleName, value, object) {
  if (!canvas) return ''
  object = object || canvas.getActiveObject()
  if (!object) return

  if (object.setSelectionStyles && object.isEditing) {
    var style = {}
    style[styleName] = value
    object.setSelectionStyles(style)
    object.setCoords()
  } else {
    object.set(styleName, value)
  }

  object.setCoords()
  canvas.renderAll()
}

{
  draw.setActiveStyle = setActiveStyle
  draw.getActiveStyle = getActiveStyle
  draw.getActiveProp = getActiveProp
  draw.setActiveProp = setActiveProp

  // draw.savePdf = function (canvasList) {
  //   // var doc = new PDF('p', 'mm')
  //   // canvasList.map((canvas) => {
  //   //   canvas.renderAll()
  //   //   var imgData = canvas.toDataURL('image/png')
  //   //   doc.addImage(imgData, 'PNG', 0, 0)
  //   // })
  //   // doc.save('demo-file.pdf')
  // }
  draw.getOpacity = function () {
    return getActiveStyle('opacity') //*100
  }
  draw.setOpacity = function (value) {
    setActiveStyle('opacity', parseInt(value, 10)) /// 100)
  }
  draw.getFill = function () {
    return getActiveStyle('fill')
  }
  draw.setFill = function (value) {
    setActiveStyle('fill', value)
  }
  draw.isBold = function () {
    return getActiveStyle('fontWeight') === 'bold'
  }
  draw.toggleBold = function () {
    setActiveStyle('fontWeight',
      getActiveStyle('fontWeight') === 'bold' ? '' : 'bold')
  }
  draw.isItalic = function () {
    return getActiveStyle('fontStyle') === 'italic'
  }
  draw.toggleItalic = function () {
    setActiveStyle('fontStyle',
      getActiveStyle('fontStyle') === 'italic' ? '' : 'italic')
  }

  draw.isUnderline = function () {
    return getActiveStyle('textDecoration').indexOf('underline') > -1
  }
  draw.toggleUnderline = function () {
    var value = draw.isUnderline() ? getActiveStyle('textDecoration').replace('underline', '') : (getActiveStyle('textDecoration') + ' underline')

    setActiveStyle('textDecoration', value)
  }

  draw.isLinethrough = function () {
    return getActiveStyle('textDecoration').indexOf('line-through') > -1
  }
  draw.toggleLinethrough = function () {
    var value = draw.isLinethrough() ? getActiveStyle('textDecoration').replace('line-through', '') : (getActiveStyle('textDecoration') + ' line-through')

    setActiveStyle('textDecoration', value)
  }
  draw.isOverline = function () {
    return getActiveStyle('textDecoration').indexOf('overline') > -1
  }
  draw.toggleOverline = function () {
    var value = draw.isOverline() ? getActiveStyle('textDecoration').replace('overline', '') : (getActiveStyle('textDecoration') + ' overline')

    setActiveStyle('textDecoration', value)
  }
  draw.setLeft = function (value) {
    return setActiveProp('left', value - 0)
  }
  draw.setTop = function (value) {
    return setActiveProp('top', value - 0)
  }
  draw.getLeft = function () {
    return getActiveProp('left')
  }
  draw.getTop = function () {
    return getActiveProp('top')
  }
  draw.getText = function () {
    return getActiveProp('text')
  }
  draw.setText = function (value) {
    setActiveProp('text', value)
  }

  draw.getTextAlign = function () {
    return capitalize(getActiveProp('textAlign'))
  }
  draw.setTextAlign = function (value) {
    setActiveProp('textAlign', value.toLowerCase())
  }

  draw.getFontFamily = function () {
    return getActiveProp('fontFamily').toLowerCase()
  }
  draw.setFontFamily = function (value) {
    setActiveProp('fontFamily', value.toLowerCase())
  }

  draw.getBgColor = function () {
    return getActiveProp('backgroundColor')
  }
  draw.setBgColor = function (value) {
    setActiveProp('backgroundColor', value)
  }

  draw.getTextBgColor = function () {
    return getActiveProp('textBackgroundColor')
  }
  draw.setTextBgColor = function (value) {
    setActiveProp('textBackgroundColor', value)
  }

  draw.getStroke = function () {
    return getActiveStyle('stroke')
  }
  draw.setStroke = function (value) {
    setActiveStyle('stroke', value)
  }

  draw.getStrokeWidth = function () {
    return parseInt(getActiveStyle('strokeWidth'))
  }
  draw.setStrokeWidth = function (value) {
    setActiveStyle('strokeWidth', parseInt(value, 10))
  }

  draw.getFontSize = function () {
    return getActiveStyle('fontSize')
  }
  draw.setFontSize = function (value) {
    setActiveStyle('fontSize', parseInt(value, 10))
  }

  draw.getLineHeight = function () {
    return getActiveStyle('lineHeight')
  }
  draw.setLineHeight = function (value) {
    setActiveStyle('lineHeight', parseFloat(value, 10))
  }
  draw.getCharSpacing = function () {
    return getActiveStyle('charSpacing')
  }
  draw.setCharSpacing = function (value) {
    setActiveStyle('charSpacing', value)
  }

  draw.getBold = function () {
    return getActiveStyle('fontWeight')
  }
  draw.setBold = function (value) {
    setActiveStyle('fontWeight', value ? 'bold' : '')
  }

  draw.getCanvasBgColor = function () {
    return canvas.backgroundColor
  }
  draw.setCanvasBgColor = function (value) {
    canvas.backgroundColor = value
    canvas.renderAll()
  }
  draw.createVideo = (url) => {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" ><svg>
                    <foreignobject x="0" y="0" width="200" height="120">
                      <video src="${url}" class="video" controls="controls"></video></svg>
                    </foreignobject>
                  </svg>`
    return svg
  }
  draw.createSVG = (o) => {
    // console.log(o)

    let d = o.d || o.path
    let stroke = o.stroke || '#000000F'
    let strokeWidth = o.strokeWidth || 1
    let width = o.width || 100
    let height = o.height || 100
    let angle = o.angle || 0
    if (d) {
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" >
                    <svg>
                      <path fill="${!o.d?'none':o.fill}" transform="scale(${o.zoomX} ${o.zoomY}) translate(${o.skewX} ${o.skewY}) rotate(${angle})" stroke="${stroke}" stroke-width="${strokeWidth}" d="${d}"></path>
                    </svg>
                  </svg>`
      // console.log(svg)
      draw.loadSVGWithoutGrouping(svg)
    }
    return ''
  }
  draw.getObjStyle = () => {
    let obj = draw.getSelected()
    let group = canvas.getActiveGroup()

    let getobj = (obj) => {
      // console.log(obj)
      let s = {}
      s.left = obj.left
      s.top = obj.top
      s.width = obj.width
      s.height = obj.height
      s.angle = obj.angle
      s.fill = obj.fill
      s.path = obj.path
      s.opacity = obj.opacity
      s.zoomX = obj.zoomX
      s.zoomY = obj.zoomY
      s.skewX = obj.skewX
      s.skewY = obj.skewY
      s.scaleX = obj.scaleX
      s.scaleY = obj.scaleY
      s.flipX = obj.flipX
      s.flipY = obj.flipY
      s.backgroundColor = obj.backgroundColor
      s.type = obj.type || ''
      // console.log(obj,obj.text)
      // text prop
      if (obj.text) {
        s.text = obj.text
        s.fontSize = obj.fontSize
        s.fontWeight = obj.fontWeight
        s.fontFamily = obj.fontFamily
        s.textAlign = obj.textAlign
      }
      // svg prop
      if (obj.d) {
        s.d = obj.d
        s.stroke = obj.stroke
        s.strokeWidth = obj.strokeWidth
      }
      // 图片
      if (obj._element) {
        s.src = obj._element.src
      }
      // 画笔
      if (!obj.d && !obj.text && !obj._element && !obj.type) {
        let path = ''
        obj.path.map(x => path += ' ' + x.join(' '))
        s.path = path
      }
      // if(obj.type&&['rect'].indexOf(obj.type))
      // console.log(s)
      return s
    }
    if (obj) {
      return getobj(obj)
    } else if (group) {
      var objectsInGroup = group.getObjects()
      canvas.discardActiveGroup()
      let arr = []
      objectsInGroup.forEach(function (object) {
        let a = getobj(object)
        arr.push(a)
      })
      return arr
    } else {
      return ''
    }
  }
}

// 画图相关
{
  draw.addRect = function (options) {
    if (typeof options != 'object') return;
    canvas.add(new qdraw.Rect(options))
    /*var coord = getRandomLeftTop()

    canvas.add(new qdraw.Rect({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      width: 50,
      height: 50,
      opacity: 0.8
    }))*/
  }

  draw.addCircle = function (options) {
    if (typeof options != 'object') return;
    canvas.add(new qdraw.Circle(options))
    /*var coord = getRandomLeftTop()
    canvas.add(new qdraw.Circle({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      radius: 50,
      opacity: 0.8
    }))*/
  }

  draw.addTriangle = function (options) {
    if (typeof options != 'object') return;
    canvas.add(new qdraw.Triangle(options))
    /*var coord = getRandomLeftTop()
    canvas.add(new qdraw.Triangle({
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor(),
      width: 50,
      height: 50,
      opacity: 0.8
    }))*/
  }

  draw.addLine = function () {
    var coord = getRandomLeftTop()
    canvas.add(new qdraw.Line([50, 100, 200, 200], {
      left: coord.left,
      top: coord.top,
      stroke: '#' + getRandomColor()
    }))
  }

  draw.addPolygon = function () {
    var coord = getRandomLeftTop()

    this.canvas.add(new qdraw.Polygon([{
        x: 185,
        y: 0
      },
      {
        x: 250,
        y: 100
      },
      {
        x: 385,
        y: 170
      },
      {
        x: 0,
        y: 245
      }
    ], {
      left: coord.left,
      top: coord.top,
      fill: '#' + getRandomColor()
    }))
  }

  draw.addText = function (text = '双击修改文字') {
    var textSample = new qdraw.Text(text.slice(0, getRandomInt(0, text.length)), {
      left: getRandomInt(350, 400),
      top: getRandomInt(350, 400),
      fontFamily: 'helvetica',
      angle: getRandomInt(-10, 10),
      fill: '#' + getRandomColor(),
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      originX: 'left',
      hasRotatingPoint: true,
      centerTransform: true
    })

    canvas.add(textSample)
  }

  draw.addTextbox = function (options) {
    // var text = '那么，简课是用来干嘛的呢，我就来说说吧,\n他就是一个非常牛逼的...'
    options.originX = 'left'
    options.hasRotatingPoint = true
    options.centerTransform = true
    options.width = options.width || 200
    let text = new qdraw.Textbox(options.text, options)
    // var text = new qdraw.Textbox(text.slice(0, getRandomInt(0, text.length)), {
    // demo
    // var text = new qdraw.Textbox(text, {
    //   fontSize: 20,
    //   left: x, // getRandomInt(350, 400),
    //   top: y, // getRandomInt(350, 400),
    //   fontFamily: 'helvetica',
    //   angle: 0, // getRandomInt(-10, 10),
    //   fill: '#000000', // + getRandomColor(),
    //   fontWeight: '',
    //   originX: 'left',
    //   width: 300,
    //   hasRotatingPoint: true,
    //   centerTransform: true
    // })

    canvas.add(text)
  }

  draw.addIText = function (text = '双击修改文字') {
    // var text = '那么，简课是用来干嘛的呢，我就来说说吧,\n他就是一个非常牛逼的...'

    var textSample = new qdraw.IText(text.slice(0, getRandomInt(0, text.length)), {
      left: 100, // getRandomInt(350, 400),
      top: 100, // getRandomInt(350, 400),
      fontFamily: 'helvetica',
      angle: 0, // getRandomInt(-10, 10),
      fill: '#' + getRandomColor(),
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      originX: 'left',
      hasRotatingPoint: true,
      centerTransform: true
    })

    canvas.add(textSample)
  }

  draw.addShapeByUrl = function (svgUrl) {
    // console.log('adding shape', shapeName)
    var coord = getRandomLeftTop()
    qdraw.loadSVGFromURL(svgUrl, function (objects, options) {
      var loadedObject = qdraw.util.groupSVGElements(objects, options)
      loadedObject.set({
          left: 100, // coord.left,
          top: 100, // coord.top,
          angle: 0, //getRandomInt(-10, 10)
        })
        .setCoords()
      canvas.add(loadedObject)
    })
  }

  draw.maybeLoadShape = function (e) {
    // var $el = $(e.target).closest('button.shape')
    // if (!$el[0]) return

    // var id = $el.prop('id')
    // var match
    // if (match = /\d+$/.exec(id)) {
    //  // addShape(match[0])
    // }
  }

  draw.addImage = (o) => {
    // var coord = getRandomLeftTop()
    qdraw.Image.fromURL(o.src, function (image) {
      // image.set({
      //     left: 50, // coord.left,
      //     top: 50, //coord.top,
      //     angle: 0,
      //     // width:300
      //   })
      image.set(o)
        // .scale(getRandomNum(minScale, maxScale))
        .scale(o.zoomX || .15, o.zoomY || .15)
        .setCoords()
      canvas.add(image)
    })
  }

}

// 画布执行型操作
{
  draw.confirmClear = function () {
    if (confirm('清空不能复原，您确定吗?')) {
      canvas.clear()
    }
  }
  draw.toImage = function () {
    if (!qdraw.Canvas.supports('toDataURL')) {
      alert('您的浏览器不支持此项操作！')
    } else {
      window.open(canvas.toDataURL('png'))
    }
  }

  draw.toSVG = function () {
    window.open(
      'data:image/svg+xmlutf8,' +
      encodeURIComponent(canvas.toSVG()))
  }

  draw.toJSON = function () {
    draw.setConsoleJSON(JSON.stringify(canvas))
  }

  draw.getSelected = function () {
    if (!canvas) return ''
    return canvas.getActiveObject()
  }

  draw.removeSelected = function () {
    var activeObject = canvas.getActiveObject()
    var activeGroup = canvas.getActiveGroup()

    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects()
      canvas.discardActiveGroup()
      objectsInGroup.forEach(function (object) {
        canvas.remove(object)
      })
    } else if (activeObject) {
      canvas.remove(activeObject)
    }
  }
}
// 锁定
{
  draw.isLock = () => {
    return getActiveProp('lockScalingY')
  }
  draw.toggleLock = () => {
    let value = !getActiveProp('lockScalingY')
    setActiveProp('lockMovementX', value)
    setActiveProp('lockMovementY', value)
    setActiveProp('lockScalingX', value)
    setActiveProp('lockScalingY', value)
    setActiveProp('lockRotation', value)
    // return lock
  }
  draw.getHorizontalLock = function () {
    return getActiveProp('lockMovementX')
  }
  draw.setHorizontalLock = function (value) {
    setActiveProp('lockMovementX', value)
  }

  draw.getVerticalLock = function () {
    return getActiveProp('lockMovementY')
  }
  draw.setVerticalLock = function (value) {
    setActiveProp('lockMovementY', value)
  }

  draw.getScaleLockX = function () {
    return getActiveProp('lockScalingX')
  }
  draw.setScaleLockX = function (value) {
    setActiveProp('lockScalingX', value)
  }

  draw.getScaleLockY = function () {
    return getActiveProp('lockScalingY')
  }
  draw.setScaleLockY = function (value) {
    setActiveProp('lockScalingY', value)
  }

  draw.getRotationLock = function () {
    return getActiveProp('lockRotation')
  }
  draw.setRotationLock = function (value) {
    setActiveProp('lockRotation', value)
  }
}

// 其他相关属性 ，对齐
{
  draw.getOriginX = function () {
    return getActiveProp('originX')
  }

  draw.setOriginX = function (value) {
    setActiveProp('originX', value)
  }

  draw.getOriginY = function () {
    return getActiveProp('originY')
  }
  draw.setOriginY = function (value) {
    setActiveProp('originY', value)
  }

  draw.getObjectCaching = function () {
    return getActiveProp('objectCaching')
  }

  draw.setObjectCaching = function (value) {
    return setActiveProp('objectCaching', value)
  }

  draw.getNoScaleCache = function () {
    return getActiveProp('noScaleCache')
  }

  draw.setNoScaleCache = function (value) {
    return setActiveProp('noScaleCache', value)
  }

  draw.getTransparentCorners = function () {
    return getActiveProp('transparentCorners')
  }

  draw.setTransparentCorners = function (value) {
    return setActiveProp('transparentCorners', value)
  }

  draw.getHasBorders = function () {
    return getActiveProp('hasBorders')
  }

  draw.setHasBorders = function (value) {
    return setActiveProp('hasBorders', value)
  }

  draw.getHasControls = function () {
    return getActiveProp('hasControls')
  }

  draw.setHasControls = function (value) {
    return setActiveProp('hasControls', value)
  }
}

// 层级切换
{
  draw.sendBackwards = function () {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendBackwards(activeObject)
    }
  }

  draw.sendToBack = function () {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendToBack(activeObject)
    }
  }

  draw.bringForward = function () {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringForward(activeObject)
    }
  }

  draw.bringToFront = function () {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringToFront(activeObject)
    }
  }
}
// 裁剪，阴影
{
  draw.clip = function () {
    var obj = canvas.getActiveObject()
    if (!obj) return

    if (obj.clipTo) {
      obj.clipTo = null
    } else {
      var radius = obj.width < obj.height ? (obj.width / 2) : (obj.height / 2)
      obj.clipTo = function (ctx) {
        ctx.arc(0, 0, radius, 0, Math.PI * 2, true)
      }
    }
    canvas.renderAll()
  }

  draw.shadowify = function () {
    var obj = canvas.getActiveObject()
    if (!obj) return

    if (obj.shadow) {
      obj.shadow = null
    } else {
      obj.setShadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 10,
        offsetX: 10,
        offsetY: 10
      })
    }
    canvas.renderAll()
  }

  draw.gradientify = function () {
    var obj = canvas.getActiveObject()
    if (!obj) return

    obj.setGradient('fill', {
      x1: 0,
      y1: 0,
      x2: (getRandomInt(0, 1) ? 0 : obj.width),
      y2: (getRandomInt(0, 1) ? 0 : obj.height),
      colorStops: {
        0: '#' + getRandomColor(),
        1: '#' + getRandomColor()
      }
    })
    canvas.renderAll()
  }
}

// 外部执行
let consoleJSONValue = ''
let consoleSVGValue = ''
let consoleValue = ''
draw.consoleJSONValue = consoleJSONValue
draw.consoleSVGValue = consoleSVGValue
draw.consoleValue = consoleValue

{
  draw.getConsoleJSON = function () {
    return consoleJSONValue
  }
  draw.setConsoleJSON = function (value) {
    consoleJSONValue = value
  }
  draw.getConsoleSVG = function () {
    return consoleSVGValue
  }
  draw.setConsoleSVG = function (value) {
    consoleSVGValue = value
  }
  draw.getConsole = function () {
    return consoleValue
  }
  draw.setConsole = function (value) {
    consoleValue = value
  }

  draw.loadSVGWithoutGrouping = function (svg) {
    qdraw.loadSVGFromString(svg, function (objects) {
      canvas.add.apply(canvas, objects)
      canvas.renderAll()
    })
  }
  draw.loadSVG = function () {
    _loadSVG(consoleSVGValue)
  }

  var _loadSVG = function (svg) {
    qdraw.loadSVGFromString(svg, function (objects, options) {
      var obj = qdraw.util.groupSVGElements(objects, options)
      canvas.add(obj).centerObject(obj).renderAll()
      obj.setCoords()
    })
  }

  draw.saveJSON = function () {
    _saveJSON(JSON.stringify(canvas))
  }

  var _saveJSON = function (json) {
    draw.setConsoleJSON(json)
  }

  draw.loadJSON = function () {
    _loadJSON(consoleJSONValue)
  }

  var _loadJSON = function (json) {
    canvas.loadFromJSON(json, function () {
      canvas.renderAll()
    })
  }
}
//数据输出部分

{

}

// 绘图模式

draw.isDrawingMode = () => {
  return canvas.isDrawingMode
}
draw.getPreserveObjectStacking = function () {
  return canvas.preserveObjectStacking
}

draw.setPreserveObjectStacking = function (value) {
  return canvas.preserveObjectStacking = value
}

draw.getFreeDrawingMode = function () {
  return canvas.isDrawingMode
}
draw.setFreeDrawingMode = function (value) {
  canvas.isDrawingMode = !!value
  // draw.$$phase || draw.$digest()
}

draw.freeDrawingMode = 'Pencil'

draw.getDrawingMode = function () {
  return draw.freeDrawingMode
}
draw.setDrawingMode = function (type) {
  draw.freeDrawingMode = type

  if (type === 'hline') {
    canvas.freeDrawingBrush = draw.vLinePatternBrush
  } else if (type === 'vline') {
    canvas.freeDrawingBrush = draw.hLinePatternBrush
  } else if (type === 'square') {
    canvas.freeDrawingBrush = draw.squarePatternBrush
  } else if (type === 'diamond') {
    canvas.freeDrawingBrush = draw.diamondPatternBrush
  } else if (type === 'texture') {
    canvas.freeDrawingBrush = draw.texturePatternBrush
  } else {
    canvas.freeDrawingBrush = new qdraw[type + 'Brush'](canvas)
  }

  // draw.$$phase || draw.$digest()
}

draw.getDrawingLineWidth = function () {
  if (canvas.freeDrawingBrush) {
    return canvas.freeDrawingBrush.width
  }
}
draw.setDrawingLineWidth = function (value) {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = parseInt(value, 10) || 1
  }
}

draw.getDrawingLineColor = function () {
  if (canvas.freeDrawingBrush) {
    return canvas.freeDrawingBrush.color
  }
}
draw.setDrawingLineColor = function (value) {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = value
  }
}

draw.getDrawingLineShadowWidth = function () {
  if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
    return canvas.freeDrawingBrush.shadow.blur || 1
  } else {
    return 0
  }
}
draw.setDrawingLineShadowWidth = function (value) {
  if (canvas.freeDrawingBrush) {
    var blur = parseInt(value, 10) || 1
    if (blur > 0) {
      canvas.freeDrawingBrush.shadow = new qdraw.Shadow({
        blur: blur,
        offsetX: 10,
        offsetY: 10
      })
    } else {
      canvas.freeDrawingBrush.shadow = null
    }
  }
}

// 初始化

{
  function initBrushes() {
    if (!qdraw.PatternBrush) return

    initVLinePatternBrush()
    initHLinePatternBrush()
    initSquarePatternBrush()
    initDiamondPatternBrush()
    initImagePatternBrush()
  }
  initBrushes()

  function initImagePatternBrush() {
    var img = new Image()
    img.src = '../static/img/subtle.png'

    draw.texturePatternBrush = new qdraw.PatternBrush(canvas)
    draw.texturePatternBrush.source = img
  }

  function initDiamondPatternBrush() {
    draw.diamondPatternBrush = new qdraw.PatternBrush(canvas)
    draw.diamondPatternBrush.getPatternSrc = function () {
      var squareWidth = 10
      var squareDistance = 5
      var patternCanvas = qdraw.document.createElement('canvas')
      var rect = new qdraw.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color
      })

      var canvasWidth = rect.getBoundingRectWidth()

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance
      rect.set({
        left: canvasWidth / 2,
        top: canvasWidth / 2
      })

      var ctx = patternCanvas.getContext('2d')
      rect.render(ctx)

      return patternCanvas
    }
  }

  function initSquarePatternBrush() {
    draw.squarePatternBrush = new qdraw.PatternBrush(canvas)
    draw.squarePatternBrush.getPatternSrc = function () {
      var squareWidth = 10
      var squareDistance = 2

      var patternCanvas = qdraw.document.createElement('canvas')
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance
      var ctx = patternCanvas.getContext('2d')

      ctx.fillStyle = this.color
      ctx.fillRect(0, 0, squareWidth, squareWidth)

      return patternCanvas
    }
  }

  function initVLinePatternBrush() {
    draw.vLinePatternBrush = new qdraw.PatternBrush(canvas)
    draw.vLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = qdraw.document.createElement('canvas')
      patternCanvas.width = patternCanvas.height = 10
      var ctx = patternCanvas.getContext('2d')

      ctx.strokeStyle = this.color
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(0, 5)
      ctx.lineTo(10, 5)
      ctx.closePath()
      ctx.stroke()

      return patternCanvas
    }
  }

  function initHLinePatternBrush() {
    draw.hLinePatternBrush = new qdraw.PatternBrush(canvas)
    draw.hLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = qdraw.document.createElement('canvas')
      patternCanvas.width = patternCanvas.height = 10
      var ctx = patternCanvas.getContext('2d')

      ctx.strokeStyle = this.color
      ctx.lineWidth = 5
      ctx.beginPath()
      ctx.moveTo(5, 0)
      ctx.lineTo(5, 10)
      ctx.closePath()
      ctx.stroke()

      return patternCanvas
    }
  }


  function initCustomization() {
    // if (typeof Cufon !== 'undefined' && Cufon.fonts.delicious) {
    //   Cufon.fonts.delicious.offsetLeft = 75
    //   Cufon.fonts.delicious.offsetTop = 25
    // }

    if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
      qdraw.Object.prototype.cornerSize = 30
    }

    // qdraw.Object.prototype.transparentCorners = false

    // if (document.location.search.indexOf('guidelines') > -1) {
    //   initCenteringGuidelines(canvas)
    //   initAligningGuidelines(canvas)
    // }
  }

  initCustomization()
}

draw.getDPI = function () {
  var arrDPI = []
  if (window.screen.deviceXDPI !== undefined) {
    arrDPI[0] = window.screen.deviceXDPI
    arrDPI[1] = window.screen.deviceYDPI
  } else {
    var tmpNode = document.createElement('DIV')
    tmpNode.style.cssText = 'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
    document.body.appendChild(tmpNode)
    arrDPI[0] = parseInt(tmpNode.offsetWidth)
    arrDPI[1] = parseInt(tmpNode.offsetHeight)
    tmpNode.parentNode.removeChild(tmpNode)
  }
  return arrDPI
}

export default draw
