/**!
 * create by chuchur /chuchur@qq.com
 * 2017年6月10日 22:39:29
 * author：chuchur
 * version:1.0.6
 */

import qdraw from 'qdraw'
let clone = qdraw.util.object.clone

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
const getRandomColor = () => {
  return (
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2) +
    pad(getRandomInt(0, 255).toString(16), 2)
  )
}

const getRandomLeftTop = () => {
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
  //   canvas._drawSelection = () => {}
  // })
  /* .on('mouse:wheel', (opt) => { // 鼠标滚轮缩放
    var e = opt.e
    var newZoom = canvas.getZoom() + e.deltaY / 300
    if (newZoom <= 0.2 || newZoom >= 5) {
      return
    }

    canvas.zoomToPoint({
      x: e.offsetX,
      y: e.offsetY
    }, newZoom)

    // renderVieportBorders();
    e.preventDefault()
    }) */
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
draw.render =()=>{
  canvas.renderAll()
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
  draw.fullScreen=(element)=>{
    if (element.requestFullscreen) {  
        element.requestFullscreen();  
    } else if (element.mozRequestFullScreen) {  
        element.mozRequestFullScreen();  
    } else if (element.webkitRequestFullscreen) {  
        element.webkitRequestFullscreen();  
    } else if (element.msRequestFullscreen) {  
        element.msRequestFullscreen();  
    }  
  }
  draw.exitFullscreen=()=>{
    if (document.exitFullscreen) {  
        document.exitFullscreen();  
    } else if (document.mozCancelFullScreen) {  
        document.mozCancelFullScreen();  
    } else if (document.webkitExitFullscreen) {  
        document.webkitExitFullscreen();  
    }  
  }
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
  
  draw.getOpacity = () => {
    return getActiveStyle('opacity') //*100
  }
  draw.setOpacity = (value) => {
    setActiveStyle('opacity', parseFloat(value, 10)) /// 100)
  }
  draw.getFill = () => {
    return getActiveStyle('fill')
  }
  draw.setFill = (value) => {
    setActiveStyle('fill', value)
  }
  draw.isBold = () => {
    return getActiveStyle('fontWeight') === 'bold'
  }
  draw.toggleBold = () => {
    setActiveStyle('fontWeight',
      getActiveStyle('fontWeight') === 'bold' ? '' : 'bold')
  }
  draw.isItalic = () => {
    return getActiveStyle('fontStyle') === 'italic'
  }
  draw.toggleItalic = () => {
    setActiveStyle('fontStyle',
      getActiveStyle('fontStyle') === 'italic' ? '' : 'italic')
  }
  draw.toggleFlipX = () => {
    setActiveProp('flipX',!canvas.getActiveObject().flipX )
  }
  draw.toggleFlipY = () => {
    setActiveProp('flipY',!canvas.getActiveObject().flipY )
  }
  draw.isUnderline = () => {
    return getActiveStyle('textDecoration').indexOf('underline') > -1
  }
  draw.toggleUnderline = () => {
    var value = draw.isUnderline() ? getActiveStyle('textDecoration').replace('underline', '') : (getActiveStyle('textDecoration') + ' underline')

    setActiveStyle('textDecoration', value)
  }

  draw.isLinethrough = () => {
    return getActiveStyle('textDecoration').indexOf('line-through') > -1
  }
  draw.toggleLinethrough = () => {
    var value = draw.isLinethrough() ? getActiveStyle('textDecoration').replace('line-through', '') : (getActiveStyle('textDecoration') + ' line-through')

    setActiveStyle('textDecoration', value)
  }
  draw.isOverline = () => {
    return getActiveStyle('textDecoration').indexOf('overline') > -1
  }
  draw.toggleOverline = () => {
    var value = draw.isOverline() ? getActiveStyle('textDecoration').replace('overline', '') : (getActiveStyle('textDecoration') + ' overline')

    setActiveStyle('textDecoration', value)
  }
  draw.setLeft = (value) => {
    return setActiveProp('left', value - 0)
  }
  draw.setTop = (value) => {
    return setActiveProp('top', value - 0)
  }
  draw.getLeft = () => {
    return getActiveProp('left')
  }
  draw.getTop = () => {
    return getActiveProp('top')
  }
  draw.getText = () => {
    return getActiveProp('text')
  }
  draw.setText = (value) => {
    setActiveProp('text', value)
  }

  draw.getTextAlign = () => {
    return capitalize(getActiveProp('textAlign'))
  }
  draw.setTextAlign = (value) => {
    setActiveProp('textAlign', value.toLowerCase())
  }

  draw.getFontFamily = () => {
    return getActiveProp('fontFamily').toLowerCase()
  }
  draw.setFontFamily = (value) => {
    setActiveProp('fontFamily', value.toLowerCase())
  }

  draw.getBgColor = () => {
    return getActiveProp('backgroundColor')
  }
  draw.setBgColor = (value) => {
    setActiveProp('backgroundColor', value)
  }

  draw.getTextBgColor = () => {
    return getActiveProp('textBackgroundColor')
  }
  draw.setTextBgColor = (value) => {
    setActiveProp('textBackgroundColor', value)
  }

  draw.getStroke = () => {
    return getActiveStyle('stroke')
  }
  draw.setStroke = (value) => {
    setActiveStyle('stroke', value)
  }

  draw.getStrokeWidth = () => {
    return parseInt(getActiveStyle('strokeWidth'))
  }
  draw.setStrokeWidth = (value) => {
    setActiveStyle('strokeWidth', parseInt(value, 10))
  }

  draw.getFontSize = () => {
    return getActiveStyle('fontSize')
  }
  draw.setFontSize = (value) => {
    setActiveStyle('fontSize', parseInt(value, 10))
  }

  draw.getLineHeight = () => {
    return getActiveStyle('lineHeight')
  }
  draw.setLineHeight = (value) => {
    setActiveStyle('lineHeight', parseFloat(value, 10))
  }
  draw.getCharSpacing = () => {
    return getActiveStyle('charSpacing')
  }
  draw.setCharSpacing = (value) => {
    setActiveStyle('charSpacing', value)
  }

  draw.getBold = () => {
    return getActiveStyle('fontWeight')
  }
  draw.setBold = (value) => {
    setActiveStyle('fontWeight', value ? 'bold' : '')
  }

  draw.getCanvasBgColor = () => {
    return canvas.backgroundColor
  }
  draw.setCanvasBgColor = (value) => {
    canvas.backgroundColor = value
    canvas.renderAll()
  }
  draw.togglePlay = ()=> {
    let o = canvas.getActiveObject()
    if (!o || !o.getElement) return
    let v = o.getElement()
    v.paused ? v.play() : v.pause()
  }
  draw.createVideo = (url) => {
    let v = document.createElement('video')
    v.src = url;v.width = 640;v.height = 360;
    var video = new qdraw.Image(v, { left: 150, top: 150, originX: 'center', originY: 'center' })
    canvas.add(video)
    video.getElement().play()
    qdraw.util.requestAnimFrame(function render() {
      canvas.renderAll()
      qdraw.util.requestAnimFrame(render)
    })
  }
  draw.createSVG = (o) => {
    // console.log(o)

    let d = o.d || o.path
    let stroke = o.stroke || '#000000 '
    let strokeWidth = o.strokeWidth || 1
    let width = o.width || 100
    let height = o.height || 100
    let angle = o.angle || 0
    let svg = ''
    if (d) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" >
                    <svg>
                      <path fill="${!o.d?'none':o.fill}" transform="scale(${o.zoomX} ${o.zoomY}) translate(${o.skewX} ${o.skewY}) rotate(${angle})" stroke="${stroke}" stroke-width="${strokeWidth}" d="${d}"></path>
                    </svg>
                  </svg>`
      // console.log(svg)
      draw.loadSVGWithoutGrouping(svg)
    }
    return svg
  }
 /*  draw.getObjStyle = () => {
    let obj = draw.getSelected()
    let group = canvas.getActiveGroup()

    let getobj = (obj) => {
      // console.log(obj,obj.styles)
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
        s.fontStyle = obj.fontStyle
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
    if (group) {
      var objectsInGroup = group.getObjects()
      // canvas.discardActiveGroup()
      let arr = []
      objectsInGroup.forEach(function (object) {
        let a = getobj(object)
        a.left = Math.abs(a.left)
        a.top = Math.abs(a.top)
        arr.push(a)
      })
      return arr
    } else if (obj) {
      return getobj(obj)
    } else {
      return ''
    }
  } */
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

  draw.addLine = () => {
    var coord = getRandomLeftTop()
    canvas.add(new qdraw.Line([50, 100, 200, 200], {
      left: coord.left,
      top: coord.top,
      stroke: '#' + getRandomColor()
    }))
  }

  draw.addPolygon = () => {
    var coord = getRandomLeftTop()

    this.canvas.add(new qdraw.Polygon([
      { x: 185, y: 0 },
      { x: 250, y: 100 },
      { x: 385, y: 170 },
      { x: 0, y: 245 } ], {
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
    // options.width = options.width || 300
    options.hasRotatingPoint=true
    options.centerTransform = true
    options.fontFamily ='微软雅黑'
    options.fontWeight = options.fontWeight || ''
    options.width = options.text.length*16>600?600:options.text.length*16
    // options.angle = 0
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
      // console.log(objects, options)
      var loadedObject = qdraw.util.groupSVGElements(objects, options)
      // console.log(loadedObject)
      
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
  draw.confirmClear = () => {
    if (confirm('清空不能复原，您确定吗?')) {
      canvas.clear()
    }
  }
  draw.toImage = () => {
    if (!qdraw.Canvas.supports('toDataURL')) {
      alert('您的浏览器不支持此项操作！')
    } else {
      // window.open(canvas.toDataURL('png'))
      return canvas.toDataURL('jpeg')
    }
  }

  draw.toSVG = () => {
    window.open(
      'data:image/svg+xmlutf8,' +
      encodeURIComponent(canvas.toSVG()))
  }

  draw.toJSON = () => {
    draw.setConsoleJSON(JSON.stringify(canvas))
  }

  draw.getSelected = () => {
    if (!canvas) return ''
    return canvas.getActiveObject()
  }
  draw.getSelectedGroup = () => {
    if (!canvas) return ''
    return canvas.getActiveGroup()
  }

  draw.removeSelected = () => {
    var activeObject = canvas.getActiveObject()
    var activeGroup = canvas.getActiveGroup()
    // console.log(activeObject,activeGroup)
    if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects()
      canvas.discardActiveGroup()
      objectsInGroup.forEach(function (object) {
        if (activeObject.getElement) {
          activeObject.getElement().pause()
        }
        canvas.remove(object)
      })
    } else if (activeObject) {
      if (activeObject.getElement) {
        activeObject.getElement().pause()
      }
      canvas.remove(activeObject)
    }
  }
}
// 锁定
{
  draw.toggleLock = () => {
    let value = !getActiveProp('lockRotation')
    setActiveProp('lockMovementX', value)
    setActiveProp('lockMovementY', value)
    setActiveProp('lockScalingX', value)
    setActiveProp('lockScalingY', value)
    setActiveProp('lockRotation', value)
    // return lock
  }
  draw.getHorizontalLock = () => {
    return getActiveProp('lockMovementX')
  }
  draw.setHorizontalLock = (value) => {
    setActiveProp('lockMovementX', value)
  }

  draw.getVerticalLock = () => {
    return getActiveProp('lockMovementY')
  }
  draw.setVerticalLock = (value) => {
    setActiveProp('lockMovementY', value)
  }

  draw.getScaleLockX = () => {
    return getActiveProp('lockScalingX')
  }
  draw.setScaleLockX = (value) => {
    setActiveProp('lockScalingX', value)
  }

  draw.getScaleLockY = () => {
    return getActiveProp('lockScalingY')
  }
  draw.setScaleLockY = (value) => {
    setActiveProp('lockScalingY', value)
  }

  draw.getRotationLock = () => {
    return getActiveProp('lockRotation')
  }
  draw.setRotationLock = (value) => {
    setActiveProp('lockRotation', value)
  }
}

// 其他相关属性 ，对齐
{
  draw.getOriginX = () => {
    return getActiveProp('originX')
  }

  draw.setOriginX = (value) => {
    setActiveProp('originX', value)
  }

  draw.getOriginY = () => {
    return getActiveProp('originY')
  }
  draw.setOriginY = (value) => {
    setActiveProp('originY', value)
  }

  draw.getObjectCaching = () => {
    return getActiveProp('objectCaching')
  }

  draw.setObjectCaching = (value) => {
    return setActiveProp('objectCaching', value)
  }

  draw.getNoScaleCache = () => {
    return getActiveProp('noScaleCache')
  }

  draw.setNoScaleCache = (value) => {
    return setActiveProp('noScaleCache', value)
  }

  draw.getTransparentCorners = () => {
    return getActiveProp('transparentCorners')
  }

  draw.setTransparentCorners = (value) => {
    return setActiveProp('transparentCorners', value)
  }

  draw.getHasBorders = () => {
    return getActiveProp('hasBorders')
  }

  draw.setHasBorders = (value) => {
    return setActiveProp('hasBorders', value)
  }

  draw.getHasControls = () => {
    return getActiveProp('hasControls')
  }

  draw.setHasControls = (value) => {
    return setActiveProp('hasControls', value)
  }
}

// 层级切换
{
  draw.sendBackwards = () => {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendBackwards(activeObject)
    }
  }

  draw.sendToBack = () => {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.sendToBack(activeObject)
    }
  }

  draw.bringForward = () => {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringForward(activeObject)
    }
  }

  draw.bringToFront = () => {
    var activeObject = canvas.getActiveObject()
    if (activeObject) {
      canvas.bringToFront(activeObject)
    }
  }
}
// 裁剪，阴影
{
  draw.clip = () => {
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

  draw.shadowify = () => {
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

  draw.gradientify = () => {
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
  draw.ondrop = (e) => {
    e.preventDefault()
    var fs = e.dataTransfer.files
    // console.log(fs,e.dataTransfer)
    for (var i = 0; i < fs.length; i++) {
      if (fs[i].type.indexOf('image') != -1) {
        var reader = new FileReader()
        reader.onload = (y) => {
          // console.log(y)
          let o = { src: y.target.result, zoomX: 1, zoomY: 1 }
          draw.addImage(o)
        }
        reader.readAsDataURL(fs[i])
      }
    }
  }
  draw.keydown = (e) => {
    let key = e.keyCode
    if (key == 46 || key == 8) {
      draw.removeSelected()
      return
    }
    let obj = draw.getSelected()
    // if (obj) {
    if (e.ctrlKey)  //shift +ctrl
    {
      if (e.shiftKey) {
        if (key == 38) { draw.bringToFront() }
        if (key == 40) { draw.sendToBack() }
        return
      }
      if (key == 38) { draw.bringForward() }
      if (key == 40) { draw.sendBackwards() }
      if (key == 76) { draw.toggleLock() }
      return
    }
    if (key == 37) { let x = obj.left - 10; draw.setLeft(x) }
    if (key == 38) { let y = obj.top - 10; draw.setTop(y) }
    if (key == 39) { let x = obj.left + 10; draw.setLeft(x) }
    if (key == 40) { let y = obj.top + 10; draw.setTop(y) }
  }
  draw.copy = (e, cut) => {
    e.preventDefault()
    let board = e.clipboardData || window.clipboardData
    let gs = canvas.getActiveGroup()
    let o = canvas.getActiveObject()
    if (!gs && !o) return
    let obj = gs ? [gs] : [o]
    let str = JSON.stringify(obj)
    board.setData('text', str)
    cut && draw.removeSelected()
    return str
  }
  draw.paste = (e) => {
    e.preventDefault()
    let board = e.clipboardData
    // 取粘贴板图片
    var i = 0, items, item, types
    items = board.items
    if (!items) {
      return
    }
    item = items[0]
    types = board.types || []
    for (; i < types.length; i++) {
      if (types[i] === 'Files') {
        item = items[i]
        break
      }
    }
    // 判断是否为图片数据
    if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
      // 读取该图片            
      var file = item.getAsFile()
      var reader = new FileReader()
      reader.onload = (e) => {
        let o = { src: e.target.result, zoomX: 1, zoomY: 1 }
        draw.addImage(o)
      }
      reader.readAsDataURL(file)
      return
    }
    let data = board.getData('text')
    try {
      let obj = JSON.parse(data)
      canvas.loadObjFormJson(obj)
    } catch (e) { }
  }
  draw.group = () => {
    let x = canvas.getActiveGroup()
    if(!x.getObjects) return
    let y = x.getObjects()
    let groups = []
    y.map((x) => {
      groups.push(clone(x))
    })
    let opt = { left: x.left, top: x.top, angle: x.angle, scaleX: x.scaleX, scaleY: x.scaleY }
    let group = new qdraw.Group(groups, opt)
    group.isGroup = true
    canvas.add(group)
    draw.removeSelected()
    draw.render()
  }

  draw.ungroup = () => {
    let o = canvas.getActiveObject()
    if (!o.getObjects) return
    let data = JSON.parse(JSON.stringify(o.getObjects()))
    data.map((x) => {
      x.skewX = o.skewX
      x.skewY = o.skewY
      x.flipX = o.flipX
      x.flipY = o.flipY
      o.angle > 0 && (x.angle = o.angle)
      o.zoomX > 1 && (x.zoomX = o.zoomX)
      o.zoomY > 1 && (x.zoomY = o.zoomY)
      o.scaleX > 1 && (x.scaleX = o.scaleX)
      o.scaleY > 1 && (x.scaleY = o.scaleY)
      x.left = x.left * (x.zoomX || 1) + o.left - 10
      x.top = x.top * (x.zoomY || 1) + o.top - 10
      x.left < 0 && (x.left = 100)
      x.top < 0 && (x.top = 100)
    })
    canvas.loadObjFormJson(data)
    draw.removeSelected()
    return
  }
  draw.getConsoleJSON = () => {
    return consoleJSONValue
  }
  draw.setConsoleJSON = (value) => {
    consoleJSONValue = value
  }
  draw.getConsoleSVG = () => {
    return consoleSVGValue
  }
  draw.setConsoleSVG = (value) => {
    consoleSVGValue = value
  }
  draw.getConsole = () => {
    return consoleValue
  }
  draw.setConsole = (value) => {
    consoleValue = value
  }

  draw.loadSVGWithoutGrouping = function (svg) {
    qdraw.loadSVGFromString(svg, function (objects) {
      console.log(objects)
     
      canvas.add.apply(canvas, objects)
      canvas.renderAll()
    })
  }
  draw.loadSVG = function (svgStr) {
    _loadSVG(svgStr)
    // _loadSVG(consoleSVGValue)
  }

  var _loadSVG = function (svg) {
    qdraw.loadSVGFromString(svg, function (objects, options) {
      var obj = qdraw.util.groupSVGElements(objects, options)
      
      canvas.add(obj).centerObject(obj).renderAll()
      obj.setCoords()
    })
  }

  draw.saveJSON = () => {
    _saveJSON(JSON.stringify(canvas))
  }

  var _saveJSON = function (json) {
    draw.setConsoleJSON(json)
  }

  draw.loadJSON = () => {
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
  let _ss =`<svg version="1.1"   xmlns="http://www.w3.org/2000/svg"  >
 <g>
	<polygon style="fill-rule:evenodd;clip-rule:evenodd;" points="11.5,16.5 11.5,6.75 15,9.5 15,8.5 11,5.5 7,8.5 7,9.5 10.502,6.75 
		10.502,16.5 	"/>
	<path style="fill-rule:evenodd;clip-rule:evenodd;" d="M22,11c0-6.075-4.925-11-11-11C4.925,0,0,4.925,0,11c0,6.075,4.925,11,11,11
		C17.075,22,22,17.075,22,11z M1,11C1,5.477,5.477,1,11,1c5.523,0,10,4.477,10,10s-4.477,10-10,10C5.477,21,1,16.523,1,11z"/>
</g>

</svg>`
  // draw.loadSVGWithoutGrouping(_ss)

}

// 绘图模式

draw.isDrawingMode = () => {
  return canvas.isDrawingMode
}
draw.getPreserveObjectStacking = () => {
  return canvas.preserveObjectStacking
}

draw.setPreserveObjectStacking = (value) => {
  return canvas.preserveObjectStacking = value
}

draw.getFreeDrawingMode = () => {
  return canvas.isDrawingMode
}
draw.setFreeDrawingMode = (value) => {
  canvas.isDrawingMode = !!value
  // draw.$$phase || draw.$digest()
}

draw.freeDrawingMode = 'Pencil'

draw.getDrawingMode = () => {
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

draw.getDrawingLineWidth = () => {
  if (canvas.freeDrawingBrush) {
    return canvas.freeDrawingBrush.width
  }
}
draw.setDrawingLineWidth = (value) => {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = parseInt(value, 10) || 1
  }
}

draw.getDrawingLineColor = () => {
  if (canvas.freeDrawingBrush) {
    return canvas.freeDrawingBrush.color
  }
}
draw.setDrawingLineColor = (value) => {
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = value
  }
}

draw.getDrawingLineShadowWidth = () => {
  if (canvas.freeDrawingBrush && canvas.freeDrawingBrush.shadow) {
    return canvas.freeDrawingBrush.shadow.blur || 1
  } else {
    return 0
  }
}
draw.setDrawingLineShadowWidth = (value) => {
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
    // var img = new Image()
    // img.src = '../static/img/subtle.png'

    // draw.texturePatternBrush = new qdraw.PatternBrush(canvas)
    // draw.texturePatternBrush.source = img
  }

  function initDiamondPatternBrush() {
    draw.diamondPatternBrush = new qdraw.PatternBrush(canvas)
    draw.diamondPatternBrush.getPatternSrc = () => {
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
    draw.squarePatternBrush.getPatternSrc = () => {
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
    draw.vLinePatternBrush.getPatternSrc = () => {
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
    draw.hLinePatternBrush.getPatternSrc = () => {
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

draw.getDPI = () => {
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
// let _draw = () => draw
export default draw
