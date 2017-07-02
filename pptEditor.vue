<template>
 <div class="pages" ref="pages"> 
  <div class="contorl">
    <span :class="(item=='pen'&&isDraw)?'active jk-'+item:'jk-'+item" v-for="item in controls" :key="item" @click="setControl(item)"></span>
  </div>
  <div draggable="true" :class="item.active?'draw-box active':'draw-box'" v-for="(item,index) in pages" :key="item" ref="drawbox"
   :width="width"
   :height="height" 
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
                <h1>选择图片</h1>
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
                <h1>选择图标</h1>
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
                <h1>选择视频</h1>
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
   required: true,
   default:788
  }, 'height': {
   type: String,
   required: true,
   default:443
  }
 },
 data() {
  return {
   jsonData:[],
   propText: ['undo','redo','bold', 'italic', 'underline', 'linethrough', 'text', 'font', 'lineheight', 'alignleft', 'alignright', 'aligncenter', 'alignjustify', 'fill', 'stroke','opacity','border'],
   showImgBox:false,
   showSvgBox:false,
   showVideoBox:false,
   imgKey:'', 
   isDraw:false,
   controls: ['info', 'plus', 'minus', 'rotate', 'pen', 'text', 'image', 'shape', 'line', 'table', 'media', 'book', 'view', 'fullscreen'],
   canvas: '',
   draws: [],
   imageList: [],
   imageCate:[],
   svgList: [],
   videoList: [],
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
   videoCate:[],
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
   objStyle:{},
   copyData:[],
   copyPos:10,
   excuCut:false,
   isFullScreen:false,
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
  document.oncontextmenu = function (e) {
   e.preventDefault();
  };
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
    console.log(fs,e.dataTransfer)
    for(var i =0 ;i<fs.length;i++){
        if(fs[i].type.indexOf('image')!=-1){
            var reader = new FileReader();
            reader.onload=(y)=>{
            console.log(y)

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
  updateJosn() {
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
        case 'table': break;
        case 'media':this.showVideoBox=true;this.getVideoCate(); break;
        case 'book': break;
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
  getVideoCate(){// 获取影片类型
      if (this.videoCate.length > 0&&this.videoList.length>0) return;
      this.$http.get('//id.91jianke.com:1081/operation_api/v0/video_category/video_category_list?manage_id=1').then(res=>{
        let data = res.body.data.map(x=>x[0])
        data.map((x)=>{
            if(x.children.length==0){
                this.videoCate.push({id:x.category_id,name:x.category_name})
            }else{
                x.children.map((y)=>{
                    this.videoCate.push({id:y.category_id,name:y.category_name})
                })
            }
        })
        this.getVideo(this.videoCate[0].id)
      })
  },
  getVideo(cid){ // 获取类别下的影片
      this.$http.get(`//id.91jianke.com:1081/operation_api/v0/video_template/get_video_list?category=${cid}&page=1&page_num=30&sort_by=&manage_id=1`).then(res=>{
        this.videoList =res.body.data.video_items
      })
  },
  initPPT(data){
     try {
          if (typeof data != 'object' || this.draws.length <= 0) return;
          data.map((j, i) => {
              if (i == 0) {
                  this.draws[i].loadFromJSON(j, () => {
                      this.draws[i].renderAll()
                  })
              } else {
                  this.addPage(i)
                  setTimeout((i, j) => {
                    //   console.log(i, 'index')
                      this.draws[i].loadFromJSON(j, () => {
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
    this.canvas = canvas
    this.draws.push(canvas)
    draw.init(canvas) 
 }, 
}
</script>

<style lang="less">


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
    // position: relative;
    .draw-box {
        background: #ffffff;
        border: 1px solid #bbb;
        box-shadow: 1px 1px 50px #b7b7b7;
        // display: flex;
        // flex: 1;
        float: left;
        margin-bottom:30px;
    }
    &>.active {
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
            font-size: 18px;
            font-family: "jianke" !important;
            font-size: 25px;
            &:hover {
                color: #059fe6;
            }
        }
        .active {
            color: red;
        }
    }
}

.dask {
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    .dialg {
        width: 80%;
        height: 70%;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 0 24px #a7a7a7;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .title {
            background: #ddd;
            border-bottom: 1px solid #ddd;
            height: 40px;
            position: relative;
            display: flex;
            h1{
                font-size: 15px;
                color: #999;
                line-height: 40px;
                padding-left: 20px;
            }
            .close{
                font-size: 30px;
                color: #4a4a4a;
                width: 50px;
                height: 40px;
                line-height: 40px;
                display: block;
                position: absolute;
                right: 0;
                cursor: pointer;
                text-align: center;
                &:hover{
                    color: #fff;
                    background: red;
                }
            }
        }
       
        .content {
            display: flex;
            flex: 1;
            .img-box {
                display: flex;
                flex: 1;
                .imgs{
                    display: flex;
                    flex-wrap: wrap;
                    flex-direction: wrap;
                    overflow: scroll;
                    align-items: flex-start;
                    align-content: flex-start;
                    justify-content: space-between;
                    span{
                        flex: 1;
                        padding: 5px;
                        border-radius: 5px;
                        margin: 10px;
                        border: 1px solid #f1f1f1;
                        font-size: 12px;
                        color: #000;
                        // min-width: 200px;
                        img{
                            height: 90px;
                            // position: relative;
                            // vertical-align: middle;
                            // top: 50%;
                            // left: 50%;
                            // transform: translate(-50%, -50%);
                        }
                        .svg{
                            display: block;
                            vertical-align: middle;
                            margin: 3px auto 0 auto;
                            text-align: center;
                            width: 49px;
                            height: 49px;   
                        }
                        .video{
                            display: block;
                            min-width: 200px;
                            width: 100%;
                            height: 120px;
                        }
                        // overflow: hidden;
                    }
                }
            }
            .category {
                display: flex;
                width:300px;
                flex-direction: column;
                background: #f1f1f1;
                overflow: auto;
            }
            .cate{
                color: #999;
                // display: flex;
                // flex-direction: column;
                // flex: 1;
                h1{
                    font-weight: 800;
                    font-size: 15px;
                    padding: 5px 0;
                    background: #ececec;
                }
                .cate-sub{
                    padding: 5px 0;
                    display: flex;
                    flex: 1;
                    flex-wrap: wrap;
                    // align-content: center;
                    // justify-content: center;
                    span{
                        display: flex;
                        flex: 1;
                        white-space: nowrap;
                        padding: 5px 8px;
                        font-size: 13px;
                        cursor: pointer;
                        text-align: center;
                        justify-content: center;
                        &:hover{
                            background: #ddd;
                            color: #000;
                        }
                    }
                }
            }
            .search-box{
                // display: flex;
                padding: 5px;
                input{
                    height: 25px;
                    line-height: 25px;
                    float: left;
                    box-sizing: border-box;
                }
                input[type=button]{width:20%;background: #ddd;}
                input[type=text]{width:80%;padding: 0 5px;border:1px solid #ddd;}
            }
        }

    }
}
.prop-box{
    // dis
    background: #059fe6;
    position: absolute;
    z-index: 100;
    border-radius: 3px;
    // display: flex;
    display: none;
    overflow: hidden;
    // padding: 5px;
    span{
        flex: 1;    
        color: #fff;
        font-size: 20px;
        padding: 7px 9px;
        &:hover{
            background: red;
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
        &:nth-child(4),&:nth-child(5) {
            border-bottom: 1px solid #e0e0e0;
        }
    }
}
</style>
