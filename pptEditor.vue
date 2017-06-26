<template>
 <div class="pages"> 
  <div :class="item.active?'draw-box active':'draw-box'" v-for="(item,index) in pages" :key="item"
   :width="width"
   :height="height"
   @toggleProp="toggleProp"
   @setProp="setProp"
   @setStyle="setStyle"
   @getObjStyle="getObjStyle(objStyle)"
   @addPage="addPage()"
   @setColor="setColor(v)"
   @removePage="removePage(index)"
   @addComponent="addComponent(item)"
   @setPenModel="setPenModel(v)"
   @save="save(type)"
   @mouseup="showMenu($event)"
   @mouseover="activeCanvas(index)">
   <canvas :id="'canvas-'+index" :width="width" :height="height"></canvas>
  </div>
 <div class="contorl">
      <span :class="`jk-${item}`" v-for="item in controls" :key="item" @click="setControl(item)"></span>
  </div>
 <ul class="contextMenu" ref="contextMenu" v-show="contextMenuShow">
  <li v-for="menu in contextMenu" @click="excue(menu.shortcut)" :key="menu">
   {{menu.text}}
   <span class="shortcut">{{menu.value}}</span>
  </li>
 </ul>
 </div>
</template>
<script>
import qdraw from 'qdraw'
import draw from './draw'

export default {
 name: 'pptEditor',
 props: {
  'width': {
   type: String,
   required: true
  }, 'height': {
   type: String,
   required: true
  }
 },
 data() {
  return {
   isDraw:false,
   canvas: '',
   controls:['info','plus','minus','rotate','pen','text','image','shape','line','table','media','book','view','fullscreen'],
   draws: [],
   pages: [
    { width: 788, height: 443, active: true }
   ],
   contextMenuShow: false,
   contextMenu: [
    { text: '剪切', value: '⌘X', shortcut: 'cut' },
    { text: '复制', value: '⌘C', shortcut: 'copy' },
    { text: '粘贴', value: '⌘V', shortcut: 'paste' },
    { text: '删除', value: '⌫', shortcut: 'delete' },
    { text: '上移', value: '⌘↑', shortcut: 'moveup' },
    { text: '下移', value: '⌘↓', shortcut: 'movedown' },
    { text: '顶层', value: '⌘⇧↑', shortcut: 'movefront' },
    { text: '底层', value: '⌘⇧↓', shortcut: 'moveback' },
   ],
   objStyle:{}
  }
 },
 beforeMount(){
    //
    var container = document.getElementsByTagName("head")[0];
    var addStyle = document.createElement("link");
    addStyle.rel = "stylesheet";
    addStyle.type = "text/css";
    addStyle.media = "screen";
    addStyle.href = '//at.alicdn.com/t/font_svmxfhvgk5w89f6r.css';
    container.appendChild(addStyle);
 },
 created() {
  document.oncontextmenu = function (e) {
   e.preventDefault();
  };
  let x = 10
  document.onpaste = (e) => {
   // console.log('执行paste', e)
   let board = e.clipboardData
   let data = board.getData('text')
   // console.log( data)
   let obj = JSON.parse(data)
   if (obj) {
    obj.left += x
    obj.top += x
    x += 10
   }
   if (obj.text) {
    draw.addTextbox(obj)
   }
   if (obj.d || obj.path) {
    // console.log(obj)
    draw.createSVG(obj)
   }
   if (obj.src) {
    draw.addImage(obj)
   }
   e.preventDefault();
  }
  document.oncopy = (e) => {
   x = 10
   let board = e.clipboardData || window.clipboardData
   let prop = draw.getObjStyle()

   if (prop) {

    // let str = JSON.stringify({ type: 'text', value: text, x: x, y: y })
    this.copyData = prop
    board.setData('text', JSON.stringify(prop));
   }
   e.preventDefault();
  }
  document.oncut = (e) => {
   document.execCommand('copy');
   draw.removeSelected();
   e.preventDefault();
  }
  document.onclick = () => {
   this.contextMenuShow = false
  }
 },
 methods: {
    setControl(item,obj){
        switch(item){
            case 'info':break;
            case 'plus':this.addPage();break;
            case 'minus':this.removePage();break;
            case 'rotate':break;
            case 'pen':this.isDraw=!this.isDraw;this.setPenModel(this.isDraw);break;
            case 'text':this.addComponent('Textbox');break;
            case 'image':break;
            case 'shape':break;
            case 'line':break;
            case 'table':break;
            case 'media':break;
            case 'book':break;
            case 'view':break;
            case 'fullscreen':break;
        } 
    },
  activeCanvas(index){
    this.pages.map(x=>x.active=false)
    this.pages[index].active=true
    draw.init(this.draws[index])
    this.setPenModel(this.isDraw)
  },
  toggleProp(type) {
   switch (type) {
    case 'bold': draw.toggleBold(); break;
    case 'italic': draw.toggleItalic(); break;
    case 'underline': draw.toggleUnderline(); break;
    case 'linethrough': draw.toggleLinethrough(); break;
    case 'overline': draw.toggleOverline(); break;
    case 'lock': draw.toggleLock(); break;
   }
  },
  setProp(name, value) {
   draw.setActiveProp(name, value)
  },
  addPage() {
      var _this = this
      let index = this.pages.indexOf(this.pages.filter(x => x.active)[0]) + 1
      this.pages.splice(index, 0, { active: false })
      //    console.log(index,this.pages)
      setTimeout((index) => {
          let id = `canvas-${index}`
          let canvas = new qdraw.Canvas(id)
          _this.draws.splice(index, 0, canvas)
      }, 1500, index);
  },
  removePage(index) {
      let deleteIndex = 0
      if (index == undefined) {
          deleteIndex = this.pages.indexOf(this.pages.filter(x => x.active)[0])
      } else {
          deleteIndex = index
      }
      if (this.pages.length > 1) {
          this.pages.splice(deleteIndex, 1)
          this.draws.splice(deleteIndex, 1)
      }
  },
  setStyle(name, value) {
   draw.setActiveStyle(name, value > 0 ? parseFloat(value) : value)
  },
  excue(type) {
   switch (type) {
    case 'cut': document.execCommand('cut'); break;
    case 'copy': document.execCommand('copy'); break;
    case 'paste': document.execCommand('paste'); break;
    case 'delete': draw.removeSelected(); break;
    case 'moveup': draw.bringForward(); break;
    case 'movedown': draw.sendBackwards(); break;
    case 'movefront': draw.bringToFront(); break;
    case 'moveback': draw.sendToBack(); break;
   }
   // console.log(this.activeObj)
  },
  setColor(name, value) {
   switch (name) {
    case 'pagebg':
     draw.setCanvasBgColor(value); break;
    case 'fill':
     draw.setFill(value); break;
    case 'stroke':
     draw.setStroke(value); break;
    case 'objbg':
     draw.setBgColor(value); break;
    case 'textbg':
     draw.setTextBgColor(value); break;
   }
  },
  addComponent(shap, item) {
   switch (shap) {
    case 'svg':
     // var getsvg = (element) => {
     //   var svg = ''
     //   if (element.nodeName == 'LI') {
     //     svg = element.innerHTML
     //   } else {
     //     svg = getsvg(element.parentElement)
     //   }
     //   return svg
     // }
     // let svg = getsvg(item.srcElement)
     if (item.url)
      draw.addShapeByUrl(item.url)
     else if (item.data)
      // console.log(svg)
      draw.loadSVGWithoutGrouping(item.data)
     break;
    case 'Line': draw.addLine()
     break
    case 'Circle': draw.addCircle()
     break
    case 'Triangle': draw.addTriangle()
     break
    case 'Polygon': draw.addPolygon()
     break
    case 'Rect': draw.addRect()
     break
    case 'Textbox': draw.addTextbox({ text: '双击修改文字', fontSize: 25, left: 20, top: 20, fontWeight: '' })
     break
    case 'svg':
     break
    case 'image': draw.addImage({ src: item.src, }); break;
   }
  },
  getObjStyle(){
   draw.getObjStyle()
  },
  showMenu(event){
   if (event.button == 2) {
       let menu = this.$refs.contextMenu
       menu.style.left = event.clientX + 'px'
       menu.style.top = event.clientY + 'px'
       this.contextMenuShow = true;
       event.cancelbutton = true
       event.returnvalue = false
       event.stopPropagation();
    }
  },
  setPenModel(isDraw){
   draw.setFreeDrawingMode(isDraw)
  },
  save(type){
   type=='pdf'?'':''
  }
 },
 mounted() {
  let canvas = new qdraw.Canvas('canvas-0')
  this.canvas = canvas
  this.draws.push(canvas) 
  draw.init(canvas)
 }
}
</script>

<style lang="less">
[class^=jk-]{
  font-family:"jianke" !important;
  font-size:25px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #999;
}

.pages {
    box-sizing: border-box; // display: none;
    flex: 1; // width: 788px;
    height: 443px; // position: absolute;
    // top: 80px;
    padding: 50px; // left: 100px;
    z-index: 0;
    height: 100%;
    overflow: scroll;
    flex-direction: row;
    position: relative;
    .draw-box {
        background: #ffffff;
        border: 1px solid #bbb;
        box-shadow: 1px 1px 50px #b7b7b7;
        // display: flex;
        // flex: 1;
        float: left;
        margin-bottom:30px;
    }
    .active {
        border: 1px solid #059fe6;
    }
    .contorl {
        float: left;
        display: flex;
        flex: 1;
        flex-direction: column;
        margin-left: 20px;
        align-items: center;
        font-size: 0;
        position: fixed;
        left: 879px;
        top: 98px;
        span {
            display: flex;
            flex: 1;
            margin-bottom: 10px;
            &:hover{
                color:#059fe6;
            }
        }
    }
}


.contextMenu {
    background: #efefef;
    border: 1px solid #d4d4d4;
    border-radius: 1px;
    box-shadow: 6px 6px 14px #cccccc;
    position: absolute;
    width: 200px;
    left: 100px;
    top: 100px;
    color: #000;
    li {
        padding: 7px 20px;
        display: flex;
        justify-content: space-between;
        cursor: default;
        &:hover {
            background: #ddd;
        }
        &:nth-child(4) {
            border-bottom: 1px solid #e0e0e0;
        }
    }
}
</style>
