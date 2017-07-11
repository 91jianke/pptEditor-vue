<template>
 <div class="pages" ref="pages"> 
  <div class="contorl">
    <span :class="(item=='pen'&&isDraw)?'active jk-'+item:'jk-'+item" v-for="item in controls" :key="item" @click="setControl(item)"></span>
  </div>
  <div draggable="true" :class="item.active?'draw-box active':'draw-box'" v-for="(item,index) in pages" :key="item" ref="drawbox"
   :width="width"
   :height="height" 
   :isPreview="isPreview"
   @mouseup="showMenu($event)"
   @mouseover="activeCanvas(index)">
   <canvas :id="'canvas-'+index" :width="width" :height="height" ></canvas>
  </div>
    <!--属性-->
    <!--<div class="prop-box">
        <span :class="`jk-${item}`" v-for="item in propText" :key="item"></span>
    </div>-->
    <!--菜单-->
    <ul class="contextMenu" ref="contextMenu" v-show="contextMenuShow">
        <li v-for="menu in contextMenu" @click="excue(menu.shortcut)" :key="menu">
        {{menu.text}}
        <span class="shortcut">{{menu.value}}</span>
        </li>
    </ul>
    <!--图片-->
    <div class="dask" v-show="showImgBox">
        <div class="dialg">
            <div class="title">
                <h1>插入图片</h1>
                <span class="close" @click="showImgBox=false">&times;</span>
            </div>
            <div class="content">
                <div class="img-box">
                    <div class="imgs">
                        <span v-for="img in imageList" :key="img" @click="addComponent('image',{src:img.path||img.thumb})"><img :src="img.thumbnail||img.thumb" alt=""></span>
                    </div>
                    <div class="page"></div>
                </div>
                <div class="category"> 
                    <div class="search-box">
                        <input type="text" v-model="imgKey" placeholder="请输入关键字"><input type="button" @click="searchImage(imgKey)" value="搜索" >
                    </div>
                    <div class="cate" v-for="item in imageCate" :key="item">
                        <h1>{{item.category_name}}</h1>
                        <div class="cate-sub">
                            <span v-for="cate in item.children" :key="cate" @click="getImageList(cate.category_id)">{{cate.category_name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--svg-->
    <div class="dask" v-show="showSvgBox">
        <div class="dialg">
            <div class="title">
                <h1>插入图标</h1>
                <span class="close" @click="showSvgBox=false">&times;</span>
            </div>
            <div class="content">
                <div class="img-box">
                    <div class="imgs">
                        <span v-for="svg in svgList" :key="svg" @click="addComponent('svg',{src:svg.path})"><img :src="svg.thumbnail" alt="" class="svg"></span>
                    </div>
                    <div class="page"></div>
                </div>
                <div class="category"> 
                    <div class="cate">
                        <div class="cate-sub">
                            <span  v-for="svg in svgCate" :key="svg" @click="getIcon(svg.id)">{{svg.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--视频-->
    <div class="dask" v-show="showVideoBox">
        <div class="dialg">
            <div class="title">
                <h1>插入视频</h1>
                <span class="close" @click="showVideoBox=false;videoList=[]">&times;</span>
            </div>
            <div class="content">
                <div class="img-box">
                    <div class="imgs">
                        <span v-for="v in videoList" :key="v" @click="addComponent('video',{src:v.video_url})">
                            <video :src="v.video_url" class="video" controls="controls"></video>
                            <p>{{v.video_name}}</p>
                        </span>
                    </div>
                    <div class="page"></div>
                </div>
                <div class="category"> 
                    <div class="cate">
                        <div class="cate-sub">
                            <span  v-for="v in videoCate" :key="v" @click="getVideo(v.id)">{{v.name}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--表格-->
    <div class="dask" v-show="showTableBox">
        <div class="dialg">
            <div class="title">
                <h1>插入表格</h1>
                <span class="close" @click="showTableBox=false;">&times;</span>
            </div>
            <div class="content flex-column">
                <div class="title-sub">
                    表格宽度：<input type="text" maxlength="3" v-model="tableWidth" @change="tableWidth=tableWidth>750?750:(tableWidth<=100?100:tableWidth)">
                    行：<input type="text" maxlength="1" v-model="rowCount" @keyup="rowCount=rowCount>9?9:(rowCount<=0?1:rowCount)">
                    列：<input type="text"  maxlength="1" v-model="colCount"  @keyup="colCount=colCount>9?9:(colCount<=0?1:colCount)">
                    <input type="button" value="确定" @click="insertTable()">
                </div>
                <div class="table-con" ref="table">
                    <div class="col" v-for="x in parseInt(colCount)" :key="x">
                        <input type="text" v-for="y in parseInt(rowCount)" :key="y"> 
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--试题-->
    <div class="dask" v-show="showShiTiBox">
        <div class="dialg st">
            <div class="title">
                <h1>插入测试题</h1>
                <span class="close" @click="showShiTiBox=false;">&times;</span>
            </div>
            <div class="content flex-column">
                <div class="type-sub">
                     <span :class="x.active&&'active'" v-for="x in st" :key="x" @click="st.map(x=>x.active=false);x.active=true;">{{x.text}}</span>
                </div>
                <div class="table-con">
                    <div class="tab" v-show="st[0].active">
                        <h1>题目：
                            <input type="text" placeholder="请输入题目内容" v-model="r_dx.title">
                            <input type="button" value="增" @click="r_dx.keys.length<=6&&r_dx.keys.push({text:'',checked:false})">
                            <input type="button" value="确定" @click="insertShiTi(1)">
                        </h1>
                        <label for="" v-for="(x,i) in r_dx.keys" :key="x">
                            <input type="radio" name="r_dx" :checked="x.checked" @change="r_dx.keys.map(x=>x.checked=false);r_dx.keys[i].checked=true;">
                            <input type="text" :placeholder="`答案${i}`" maxlength="15" v-model="x.text">
                            <input type="button" value="删" @click="r_dx.keys.length>1&&r_dx.keys.splice(i,1)">
                        </label>
                    </div>
                    <div class="tab" v-show="st[1].active">
                        <h1>题目：
                            <input type="text" placeholder="请输入题目内容" v-model="c_dx.title">
                            <input type="button" value="增" @click="c_dx.keys.length<=6&&c_dx.keys.push({text:'',checked:false})">
                            <input type="button" value="确定" @click="insertShiTi(2)">
                        </h1>
                        <label for="" v-for="(x,i) in c_dx.keys" :key="x">
                            <input type="checkbox" name="c_dx" v-model="x.checked">
                            <input type="text" v-model="x.text" maxlength="15" :placeholder="`答案${i}`">
                            <input type="button" value="删" @click="c_dx.keys.length>1&&c_dx.keys.splice(i,1)">
                        </label>
                    </div>
                    <div class="tab" v-show="st[2].active">
                        <h1>题目：
                            <input type="text" placeholder="请输入题目内容" v-model="pd.title">
                            <input type="button" value="确定" @click="insertShiTi(3)">
                        </h1>
                        <label for="" v-for="(x,i) in pd.keys" :key="x">
                            <input type="radio" name="pd" :checked="x.checked"  @change="pd.keys.map(x=>x.checked=false);pd.keys[i].checked=true;">
                            <input type="text" v-model="x.text" maxlength="10" :placeholder="`答案${i}`">
                        </label>
                    </div>
                    <div class="tab" v-show="st[3].active">
                        <h1>题目：
                            <input type="text" placeholder="请输入题目内容" v-model="wd.A">
                            <input type="button" value="确定" @click="insertShiTi(4)">
                        </h1>
                        <textarea name="" id="" cols="30" rows="10" v-model="wd.Q" placeholder="请在此输入答案..."></textarea>
                    </div>
                    <div class="tab" v-show="st[4].active">
                        <h1>题目：
                            <input type="text" placeholder="请输入题目内容" v-model="lx.title" maxlength="50">
                            <input type="button" value="增" @click="actionlx('add')">
                            <input type="button" value="确定" @click="insertShiTi(5)">
                        </h1>
                        <div class="left">
                            <label for="" v-for="x in lx.keys.filter(x=>x.type==1)" :key="x">
                                <input type="text" v-model="x.text" maxlength="15">
                                <input type="text" class="b-l" v-model="x.value" maxlength="1">
                            </label>
                        </div>
                        <div class="right">
                            <label for="" v-for="x in lx.keys.filter(x=>x.type==2)" :key="x">
                                <input type="text" class="b-r" v-model="x.value" maxlength="1">
                                <input type="text" v-model="x.text" maxlength="15">
                                <input type="button" value="删" @click="actionlx('del',x.value)">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
 </div>
</template>
<script>
import qdraw from 'qdraw' 
import draw from './draw'
import component from './component'
 
export default {
 name: 'pptEditor',
 props: {
  'width': {
   type: String,
   required: true,
   default:788
  }, 'height': {
   type: String,
   required: true,
   default:443
  },'isPreview':{
      type:Boolean,
      default:false,
    //   required:true
  }
 },
 data() {
  return {
   r_dx: { title: '', keys: [{ text: '', checked: false }] },
   c_dx: { title: '', keys: [{ text: '', checked: false }] },
   pd: { title: '', keys: [{ text: '', checked: false }, { text: '', checked: false }] },
   wd: { A: '', Q: '' },
   lx: { title: '', keys: [{ text: '', type: '1', value: 1, index: 0 }, { text: '', type: '2', value: 1, index: 0 }] },
   st: [{ text: '单选题', active: true }, { text: '多选题', active: false }, { text: '判断题', active: false }, { text: '问答题', active: false }, { text: '连线题', active: false }],
   tableWidth:800,   rowCount:5,   colCount:5,
   jsonData:[],
   propText: ['undo','redo','bold', 'italic', 'underline', 'linethrough', 'text', 'font', 'lineheight', 'alignleft', 'alignright', 'aligncenter', 'alignjustify', 'fill', 'stroke','opacity','border'],
   showShiTiBox: false, showImgBox: false, showSvgBox: false, showVideoBox: false, showTableBox: false,
   imgKey:'', 
   isDraw:false,
   controls: ['info', 'plus', 'minus', 'rotate', 'pen', 'text', 'image', 'shape', 'line', 'table', 'media', 'book', 'view', 'fullscreen'],
   canvas: '',
   draws: [], imageList: [], imageCate: [], svgList: [], videoList: [], videoCate: [],
   svgCate:[
       {id:'58748f83c765ac6654ff83f5',name:'箭头'},
       {id:'5861c63257dccb0f98db4c59',name:'人物'},
       {id:'5861c63857dccb0f9aabad1a',name:'表情包'},
       {id:'5861c64357dccb0f936cfa91',name:'生活'},
       {id:'5861c64a57dccb0f936cfa92',name:'学习'},
       {id:'5861c65557dccb0f98db4c5a',name:'通讯'},
       {id:'586dec3057dccb2f1bde4b14',name:'数学符号'},
       {id:'586dec3057dccb2f1bde4b15',name:'其他符号'},
       {id:'58748f28c765ac665a7aaa68',name:'交通'},
       ],
   pages: [{ active: true }],
   contextMenuShow: false,
   contextMenu: [
    { text: '剪切', value: '⌘X', shortcut: 'cut' },
    { text: '复制', value: '⌘C', shortcut: 'copy' },
    { text: '粘贴', value: '⌘V', shortcut: 'paste' },
    { text: '删除', value: '⌫', shortcut: 'delete' },
    { text: '锁定/解锁', value: '⌘L', shortcut: 'lock' },
    { text: '上移', value: '⌘↑', shortcut: 'moveup' },
    { text: '下移', value: '⌘↓', shortcut: 'movedown' },
    { text: '顶层', value: '⌘⇧↑', shortcut: 'movefront' },
    { text: '底层', value: '⌘⇧↓', shortcut: 'moveback' },
   ],
   objStyle: {}, copyData: [], copyPos: 10, excuCut: false, isFullScreen: false,
  }
 },
 beforeMount(){
    //
    var container = document.getElementsByTagName("head")[0];
    var addStyle = document.createElement("link");
    addStyle.rel = "stylesheet";
    addStyle.type = "text/css";
    addStyle.media = "screen";
    addStyle.href = '//at.alicdn.com/t/font_psk9i2npvwy7gb9.css';
    container.appendChild(addStyle);
 },
 created() {
  document.oncontextmenu = (e)=> {
   e.preventDefault();
  };
  document.onmousedown =(e)=>{
    // if(this.preview==true){
        e.preventDefault();
    // }
  }
  document.onpaste = (e) => {
    e.preventDefault();
      // console.log('执行paste', e)
    let board = e.clipboardData
    // 取粘贴板图片
    var i = 0,items, item, types;
    items = board.items
    if( !items ){
        return;
    }
    item = items[0];
    types = board.types || [];
    for( ; i < types.length; i++ ){
        if( types[i] === 'Files' ){
            item = items[i];
            break;
        }
    }
    
    // 判断是否为图片数据
    if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
        // 读取该图片            
        var file = item.getAsFile()
        var reader = new FileReader()
        reader.onload=(e)=>{
            let o = {src:e.target.result,zoomX:1,zoomY:1}
            draw.addImage(o)
        }
        reader.readAsDataURL(file)
        return
    }
    let data = board.getData('text')

    // console.log( data)
    let obj = {}
    try {
        obj = JSON.parse(data)
    } catch (e) { }
    this.paste(obj,this.copyPos)
  }
  document.oncopy = (e) => { 
   e.preventDefault(); 
   this.copyPos =10
   let board = e.clipboardData || window.clipboardData
   let prop = draw.getObjStyle()

   if (prop) {
    this.copyData = prop
    board.setData('text', JSON.stringify(prop));
    if(this.excuCut){
        this.excuCut=false; 
        draw.removeSelected();
    }
   }
  }
  document.oncut = (e) => {
   e.preventDefault();
   setTimeout(()=> {// 递归用延时执行
        this.excuCut=true
        document.execCommand('copy');
   }, 10);
  }
  document.onclick = () => {
   this.contextMenuShow = false
  }
  document.onkeydown=(e)=>{
    let key =e.keyCode
    // console.log(e)
    let obj = draw.getSelected()
    if (obj) {
        if(key==46||key==8){ 
            draw.removeSelected()
        }
        if(e.ctrlKey)  //shift +ctrl
        {
             if(e.shiftKey){
                if(key==38){draw.bringToFront();}
                if(key==40){draw.sendToBack();}
                return;
            }
            if(key==38){draw.bringForward();}
            if(key==40){draw.sendBackwards();}
            if(key==76){draw.toggleLock();}
            return;
        }
        if (key == 37) { let x = obj.left - 10; draw.setLeft(x) }
        if (key == 38) { let y = obj.top - 10; draw.setTop(y) }
        if (key == 39) { let x = obj.left + 10; draw.setLeft(x) }
        if (key == 40) { let y = obj.top + 10; draw.setTop(y) }
    }
    
  }
  document.ondragover =(e)=>{
      e.preventDefault();
  }
  document.ondrop=(e)=>{
    e.preventDefault();
    var fs = e.dataTransfer.files;
    // console.log(fs,e.dataTransfer)
    for(var i =0 ;i<fs.length;i++){
        if(fs[i].type.indexOf('image')!=-1){
            var reader = new FileReader();
            reader.onload=(y)=>{
            // console.log(y)
                 let o = {src:y.target.result,zoomX:1,zoomY:1}
                 draw.addImage(o)
            }
            reader.readAsDataURL(fs[i]);
        }
    }
    // console.log(e.dataTransfer)
  }
  if(this.imageList.length==0){
      this.getImageCategory()
  } 
 },
 methods: {
  actionlx(t,value){
      if (t == 'add') {
          let value = (this.lx.keys.length / 2) + 1
          this.lx.keys.length < 14 && this.lx.keys.push({ text: '', type: '1', value: value, index: value }, { text: '', type: '2', value: value, index: value })
      } else {
          if (this.lx.keys.length <= 2) {
            //   this.lx.keys.map(x => x.value = 1)
              return
          }
          this.lx.keys = this.lx.keys.filter(x => x.value != value)
      }
  },
  insertShiTi(type){
      console.log(this.lx)
    let root = ''
    switch(type){
        case 1:root = new component.radio(this.r_dx);break;
        case 2:root = new component.checkbox(this.c_dx);break;
        case 3:root = new component.radio(this.pd);break;
        case 4:root = new component.sqa(this.wd);break;
        case 5:root = new component.line(this.lx);break;
    }
    this.addComponent('svg',{data:root.outerHTML})
    this.showShiTiBox =false
  },   
  insertTable(){
     let tableData = [];
      let col = this.$refs.table.querySelectorAll('.col')
      console.log(col)
      for (var x = 0; x < col.length; x++) {
          let row = col[x].querySelectorAll('input')
          !tableData[x] && (tableData[x] = [])
          for (var y = 0; y < row.length; y++) {
              tableData[x][y] = row[y].value
          }
      }
      let table = new component.table(this.tableWidth, 300, {
          colCount: this.colCount,
          rowCount: this.rowCount,
          texts: tableData,
      })
      this.addComponent('svg', { data: table.outerHTML })
      this.showTableBox =false
  },
  getImage(index) {
      if (index >= 0 && index < this.draws.length) {
          return this.draws[index].toImage()
      }
      if (this.draws.length > 0) {
          data = []
          this.draws.map((x) => {
              let d = x.toImage()
              data.push(d)
          })
          return data
      }
  },
  getJsonData(){
    let jsonData=[]
    if (this.draws.length > 0) {
        this.draws.map((x) => {
            let d = JSON.stringify(x)
            d = JSON.parse(d)
            jsonData.push(d)
        })
        return jsonData
    }
    return jsonData
  },
  updateJosn() {
    // this.$emit('getDataJson', '此被废弃 ，因为非常耗内存 请使用 getJsonData')
    return;
    //此被废弃 ，因为非常耗内存 请使用 getJsonData 
    if (this.draws.length > 0) {
        this.jsonData = []
        this.draws.map((x) => {
            let d = JSON.stringify(x)
            d = JSON.parse(d)
            this.jsonData.push(d)
        })
        this.$emit('getDataJson', this.jsonData)
    }
  },  
  paste(data,x) {
      let ps = (obj) => {
          if (obj) {
              obj.left += x
              obj.top += x
          }
          if (obj.text) { //text
              draw.addTextbox(obj)
          }
          if (obj.d || obj.path) { //svg
              // console.log(obj)
              draw.createSVG(obj)
          }
          if (obj.src) { // image
              draw.addImage(obj)
          }
          if (obj.type) { // shape
              this.addShape(obj)
          }
      }
      if (data.left) {
          ps(data)
      } else if (data.length > 0) {
          data.map((x) => {
              ps(x)
          })
      }
      this.copyPos+=10;
  },
  toggleFullScreent(ele){
    !this.isFullScreen? draw.fullScreen(ele):draw.exitFullscreen();
    this.isFullScreen =!this.isFullScreen
  },
  setControl(item, obj) {
      switch (item) {
        case 'info': break;
        case 'plus': this.addPage(); break;
        case 'minus': this.removePage(); break;
        case 'rotate': draw.setActiveProp('angle',draw.getActiveProp('angle')+90);break;
        case 'pen': this.isDraw = !this.isDraw; this.setPenModel(this.isDraw); break;
        case 'text': this.addComponent('Textbox'); break;
        case 'image':this.showImgBox=true; break;
        case 'shape':this.showSvgBox=true;this.getIcon(this.svgCate[0].id); break;
        case 'line': break;
        case 'table':let t =this.$refs.table.querySelectorAll('input');for(var x of t){x.value=''};this.showTableBox =true; break;
        case 'media':this.showVideoBox=true;this.getVideoCate(); break;
        case 'book':this.showShiTiBox=true; break;
        case 'view':this.toggleFullScreent(this.$refs.drawbox[1]); break;
        case 'fullscreen':this.toggleFullScreent(this.$refs.pages);break;
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
   updateJosn()
  },
  setProp(name, value) {
   draw.setActiveProp(name, value)
   this.updateJosn()
  },
  addPage(i) {
      i=i||1  //for 里面使用闭包传入默认为1
      //在聚焦的下面插入
    //   let index = this.pages.indexOf(this.pages.filter(x => x.active)[0]) + 1
    //   this.pages.splice(index, 0, { active: false })

      //强暴插入
      this.pages.push({ active: false })
      let index = this.pages.length-1

      setTimeout((index) => {
        //   console.log(index)
          let id = `canvas-${index}`
          let canvas = new qdraw.Canvas(id)
          this.draws.splice(index, 0, canvas)
      }, 500*i, index);
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
      this.updateJosn()
  },
  setStyle(name, value) {
   draw.setActiveStyle(name, value > 0 ? parseFloat(value) : value)
   this.updateJosn()
  },
  excue(type) {
   switch (type) {
    case 'cut': document.execCommand('cut'); break;
    case 'copy': document.execCommand('copy'); break;
    case 'paste': this.paste(this.copyData,this.copyPos);/*document.execCommand('paste');*/ break;
    case 'delete': draw.removeSelected(); break;
    case 'lock': draw.toggleLock(); break;
    case 'moveup': draw.bringForward(); break;
    case 'movedown': draw.sendBackwards(); break;
    case 'movefront': draw.bringToFront(); break;
    case 'moveback': draw.sendToBack(); break;
   }
   this.updateJosn()
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
   this.updateJosn()
  },
  addShape(options){
    if(!options||!options.type) return;
    switch(options.type){
        case 'rect':draw.addRect(options);break;
        case 'circle':draw.addCircle(options);break;
        case 'triangle':draw.addTriangle(options);break;
        case 'line':draw.addLine(options);break;
        case 'polygon':draw.addPolygon(options);break;
    }
    this.updateJosn()
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
     if (item.src)
      draw.addShapeByUrl(item.src)
     else if (item.data)
      // console.log(svg)
      draw.loadSVG(item.data)
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
    case 'video': 
        let svg = draw.createVideo(item.src)
        // console.log(svg)
        draw.loadSVGWithoutGrouping(svg)
     break
    case 'image': draw.addImage({ src: item.src, }); break;
   }
   this.showImgBox=false
   this.showSvgBox=false
    setTimeout(()=> {
        this.updateJosn()
    }, 1000); 
  },
  getObjStyle(){
   draw.getObjStyle()
  },  
  showMenu(event){
    if (event.button == 2) {
        event.preventDefault();
        let menu = this.$refs.contextMenu
        // (212,293)
        let y = document.body.clientHeight - event.clientY > 293 ? event.clientY : event.clientY - 283
        let x = document.body.clientWidth - event.clientX > 212 ? event.clientX : event.clientX - 202
        menu.style.left = x + 'px'
        menu.style.top = y + 'px'
        this.contextMenuShow = true;
        //    event.cancelbutton = true
        //    event.returnvalue = false
        //    event.stopPropagation();
    }
    this.updateJosn()
  },
  setPenModel(isDraw){
   draw.setFreeDrawingMode(isDraw)
  },
  save(type){
   type=='pdf'?'':''
  },
  getImageCategory(){ // 获取图片类型 
      if (this.imageCate.length > 0) return;
      this.$http.get('//id.91jianke.com:1081/operation_api/v0/image_category/image_category_list?manage_id=1').then(res=>{
        this.imageCate= res.body.data.map(x=>x[0])
        this.getImageList(this.imageCate[0].category_id)
      })
  },
  getImageList(cid){ // 获取图片列表
     this.$http.get(`//id.91jianke.com:1081/operation_api/v0/image_template/get_image_list?category=${cid}&page=1&page_num=40&sort_by=&manage_id=1`).then(res=>{
         this.imageList =res.body.data.image_items
     })
  },
  searchImage(key){ // 搜索图片
      this.$http.get(`//id.91jianke.com:1081/api/v2.0/image/search?q=${key}&page_no=1&page_size=40`).then(res=>{
        if(res.body.msg!='success')
        { 
           alert(res.body.msg);
           return;
        }
        this.imageList =res.body.data
      })
  },
  getIcon(cid){ // 获取图标
    this.$http.get(`//id.91jianke.com:1081/operation_api/v0/shape_template/get_shape_list?category=${cid}&page=1&page_num=150&sort_by=&manage_id=1`).then(res=>{
        this.svgList =res.body.data.shape_items
    })
  },
  getVideoCate() {// 获取影片类型
      if (this.videoList.length == 0 && this.videoCate.length > 0) this.getVideo(this.videoCate[0].id)
      if (this.videoCate.length > 0 ) return;
      this.$http.get('//id.91jianke.com:1081/operation_api/v0/video_category/video_category_list?manage_id=1').then(res => {
          let data = res.body.data.map(x => x[0])
          data.map((x) => {
              if (x.children.length == 0) {
                  this.videoCate.push({ id: x.category_id, name: x.category_name })
              } else {
                  x.children.map((y) => {
                      this.videoCate.push({ id: y.category_id, name: y.category_name })
                  })
              }
          })
          this.getVideo(this.videoCate[0].id)
      })
  },
  getVideo(cid) { // 获取类别下的影片
      this.$http.get(`//id.91jianke.com:1081/operation_api/v0/video_template/get_video_list?category=${cid}&page=1&page_num=30&sort_by=&manage_id=1`).then(res => {
          this.videoList = res.body.data.video_items
      })
  },
  initPPT(data){
     try {
          if (typeof data != 'object' || this.draws.length <= 0) return;
          data.map((j, i) => {
              if (i == 0) {
                  this.draws[i].loadFromJSON(j, () => {
                      this.draws[i].isPreview =this.isPreview
                      this.draws[i].renderAll()
                  })
              } else {
                  this.addPage(i)
                  setTimeout((i, j) => {
                    //   console.log(i, 'index')
                      this.draws[i].loadFromJSON(j, () => {
                          this.draws[i].isPreview =this.isPreview
                          this.draws[i].renderAll()
                      })
                  }, 500 * i, i, j);
              }
          }) 
      } catch (e) {
          console.log(e.message)
      }
  }
 },
 mounted() {    

    let canvas = new qdraw.Canvas('canvas-0');
    canvas.isPreview =this.isPreview
    this.canvas = canvas
    this.draws.push(canvas)
    draw.init(canvas) 

    return ;

    // this.addComponent('svg',{data:ds.outerHTML})
    let radio = {title:'1、黄花岗起义时，开第一枪的人是谁？',keys:[
        {text:'黄兴',checked:true},
        {text:'宋教仁',checked:false},
        {text:'孙文',checked:false},
        {text:'罗福星',checked:false},
        ]}

    let checkbox = {title:'2、黄花岗起义时，开第二枪的人是谁？',keys:[
        {text:'黄兴',checked:true},
        {text:'宋教仁',checked:true},
        {text:'孙文',checked:true},
        {text:'罗福星',checked:false},
        ]}
    let radio2 = {title:'3、黄花岗起义时，开第三枪的人是黄兴吗？',keys:[
        {text:'不是',checked:false},
        {text:'是',checked:true},
        ]}
    let _checkbox = new component.checkbox(checkbox)
    let _radio = new component.radio(radio)
    let _radio2 = new component.radio(radio2)
    let sqa = new component.sqa({A:'5、黄花岗起义时，开第一枪的人是谁？',Q:'教育出版社的教材里有一句话："黄兴朝向空中鸣了三枪揭开了黄花岗起义的序幕！"'})
    
    let xx= new component.line({title:'5、请将下面对应的连线',keys:[
        {text:'水果',type:1,value:1},
        {text:'西瓜',type:2,value:4},
        {text:'粮食',type:1,value:2},
        {text:'大米',type:2,value:3},
        {text:'植物',type:1,value:3},
        {text:'松树',type:2,value:2},
        {text:'旅游景点发动机阿斯科利',type:1,value:4},
        {text:'布达拉宫ddddddddddd',type:2,value:1},
    ]})
    let table = new component.table(800,300,{colCount:6,
            rowCount: 5,
            texts: [
                ['免费', '体验3天', '体验基本功', 'x'],
                ['$3000', '1帐号/年','体验全部功能', 'x'],
                ['8折', '>20帐号/年', '体验全部功能', '售后'],
                ['5折', '>50帐号/年', '体验全部功能', '售后']
            ],})
    // this.addComponent('svg',{data:table.outerHTML})
    /*this.addComponent('svg',{data:_checkbox.outerHTML})
    this.addComponent('svg',{data:radio2.outerHTML})
    this.addComponent('svg',{data:radio.outerHTML})
    this.addComponent('svg',{data:sqa.outerHTML})
    this.addComponent('svg',{data:sqa.outerHTML})*/
    // this.addComponent('svg',{data:xx.outerHTML})

// document.body.appendChild(ds)
// this.addComponent('svg',{data:ds.outerHTML})
    // this.addComponent('svg',{data:`<svg width="800" height="400" viewBox="0 0 800 400" class="svg_table"><desc>Created with Snap</desc><defs></defs><g><g><g transform="matrix(1,0,0,1,0,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Monday</text></g><g transform="matrix(1,0,0,1,114.2857,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Tuesday</text></g><g transform="matrix(1,0,0,1,228.5714,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Wednesday</text></g><g transform="matrix(1,0,0,1,342.8571,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Thursday</text></g><g transform="matrix(1,0,0,1,457.1429,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Friday</text></g><g transform="matrix(1,0,0,1,571.4286,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Saturday</text></g><g transform="matrix(1,0,0,1,685.7143,0)" class="svg_calendar column_name svg_cell"><rect x="0" y="0" width="114.28571428571429" height="30"></rect><text x="0" y="0" transform="matrix(1,0,0,1,0,30)" style="user-select: none;">Sunday</text></g></g></g><g><g transform="matrix(1,0,0,1,0,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">6/3</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">10</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">17</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">24</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">31</text></g></g><g transform="matrix(1,0,0,1,114.2857,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">4</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">11</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">18</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">25</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell odd_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">7/1</text></g></g><g transform="matrix(1,0,0,1,228.5714,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">5</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">12</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">19</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">26</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell odd_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">2</text></g></g><g transform="matrix(1,0,0,1,342.8571,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">6</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">13</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">20</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">27</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell odd_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">3</text></g></g><g transform="matrix(1,0,0,1,457.1429,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">7</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">14</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">21</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">28</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell odd_month"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">4</text></g></g><g transform="matrix(1,0,0,1,571.4286,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">8</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">15</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">22</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">29</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell odd_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">5</text></g></g><g transform="matrix(1,0,0,1,685.7143,0)"><g transform="matrix(1,0,0,1,0,30)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">9</text></g><g transform="matrix(1,0,0,1,0,104)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">16</text></g><g transform="matrix(1,0,0,1,0,178)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">23</text></g><g transform="matrix(1,0,0,1,0,252)" class="svg_calendar svg_cell even_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">30</text></g><g transform="matrix(1,0,0,1,0,326)" class="svg_calendar svg_cell odd_month holiday"><rect x="0" y="0" width="114.28571428571429" height="74"></rect><text x="0" y="0" transform="matrix(1,0,0,1,10,23)" style="user-select: none;">6</text></g></g></g></svg>`})
    //  this.addComponent('svg',{src:'http://fabricjs.com/assets/107.svg'})
 }, 

}
</script>

<style lang="less">
@import 'edit.less';
</style>
