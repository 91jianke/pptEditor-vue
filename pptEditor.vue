<template>
    <div class="pages" ref="pages">
        <!-- 工具栏 -->
        <div class="contorl" v-show="!isPreview">
            <span :class="(item=='pen'&&isDraw)?'active jk-'+item:'jk-'+item" v-for="item in controls" :key="item" @click="setControl(item)"></span>
        </div>
        <div draggable="true" :class="item.active?'draw-box active':'draw-box'" v-for="(item,index) in pages" :key="item" ref="drawbox" :width="width" :height="height" :isPreview="isPreview" @mouseup="showMenu($event)" @mouseover="activeCanvas(index)">
            <canvas :id="'canvas-'+index" :width="width" :height="height"></canvas>
        </div>
        <!--属性-->
        <div class="prop-box"  v-show="!isPreview">
            <span :class="`jk-${item}`" v-for="item in propText" :key="item"></span>
        </div>
        <!--菜单-->
        <ul class="contextMenu" ref="contextMenu" v-show="contextMenuShow">
            <li v-for="menu in contextMenu" @click="excue(menu.shortcut)" :key="menu">
                {{menu.text}}
                <span class="shortcut">{{menu.value}}</span>
            </li>
        </ul>
        <compUI :showShiTiBox="showShiTiBox" :showImgBox="showImgBox" :showSvgBox="showSvgBox" :showVideoBox="showVideoBox" :showTableBox="showTableBox" ref="comp" @close="closeBox" @addComponent="addComponent"></compUI>
    </div>
</template>
<script>
import qdraw from 'qdraw'
import draw from './draw'
import compUI from './compUI'

export default {
    components: { compUI },
    name: 'pptEditor',
    props: {
        'width': {
            type: String,
            required: true,
            default: 788
        }, 'height': {
            type: String,
            required: true,
            default: 443
        }, 'isPreview': {
            type: Boolean,
            default: false,
            //   required:true
        }
    },
    data() {
        return {
            showShiTiBox: false, showImgBox: false, showSvgBox: false, showVideoBox: false, showTableBox: false,
            jsonData: [],
            propText: ['undo', 'redo', 'bold', 'italic', 'underline', 'linethrough', 'text', 'font', 'lineheight', 'alignleft', 'alignright', 'aligncenter', 'alignjustify', 'fill', 'stroke', 'opacity', 'border'],
            isDraw: false,
            controls: ['info', 'plus', 'minus', 'rotate', 'pen', 'text', 'image', 'shape', 'line', 'table', 'media', 'book', 'view'],
            canvas: '',
            draws: [],
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
            objStyle: {}, copyData: [], copyPos: 10, isFullScreen: false,
        }
    },
    beforeMount() {
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
        document.oncontextmenu = (e) => {
            e.preventDefault();
        };
        document.onpaste = (e) => {
            e.preventDefault();
            // console.log('执行paste', e)
            let board = e.clipboardData
            // 取粘贴板图片
            var i = 0, items, item, types;
            items = board.items
            if (!items) {
                return;
            }
            item = items[0];
            types = board.types || [];
            for (; i < types.length; i++) {
                if (types[i] === 'Files') {
                    item = items[i];
                    break;
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

            // console.log( data)
            let obj = {}
            try {
                obj = JSON.parse(data)
            } catch (e) { }
            this.paste(obj, this.copyPos)
        };
        const copy = (e, iscut) => {
            this.copyPos = 10
            let board = e.clipboardData || window.clipboardData
            let prop = draw.getObjStyle()
            if (prop) {
                this.copyData = prop
                board.setData('text', JSON.stringify(prop));
                iscut && draw.removeSelected();
            }
        }
        document.oncopy = (e) => {
            console.log('ss1')
            e.preventDefault();
            copy(e)
        };
        document.oncut = (e) => {
            e.preventDefault();
            copy(e, true)
            /*setTimeout(() => {// 递归用延时执行
                document.execCommand('copy');
                console.log('ss')
            }, 1000);*/
        }
        document.onclick = () => {
            this.contextMenuShow = false
        }
        document.onkeydown = (e) => {
            let key = e.keyCode
            // console.log(e)
            let obj = draw.getSelected()
            if (obj) {
                if (key == 46 || key == 8) {
                    draw.removeSelected()
                }
                if (e.ctrlKey)  //shift +ctrl
                {
                    if (e.shiftKey) {
                        if (key == 38) { draw.bringToFront(); }
                        if (key == 40) { draw.sendToBack(); }
                        return;
                    }
                    if (key == 38) { draw.bringForward(); }
                    if (key == 40) { draw.sendBackwards(); }
                    if (key == 76) { draw.toggleLock(); }
                    return;
                }
                if (key == 37) { let x = obj.left - 10; draw.setLeft(x) }
                if (key == 38) { let y = obj.top - 10; draw.setTop(y) }
                if (key == 39) { let x = obj.left + 10; draw.setLeft(x) }
                if (key == 40) { let y = obj.top + 10; draw.setTop(y) }
            }

        }
        document.ondragover = (e) => {
            e.preventDefault();
        }
        document.ondrop = (e) => {
            e.preventDefault();
            var fs = e.dataTransfer.files;
            // console.log(fs,e.dataTransfer)
            for (var i = 0; i < fs.length; i++) {
                if (fs[i].type.indexOf('image') != -1) {
                    var reader = new FileReader();
                    reader.onload = (y) => {
                        // console.log(y)
                        let o = { src: y.target.result, zoomX: 1, zoomY: 1 }
                        draw.addImage(o)
                    }
                    reader.readAsDataURL(fs[i]);
                }
            }
            // console.log(e.dataTransfer)
        }
        // if (this.imageList.length == 0) {
        //     this.getImageCategory()
        // }
    },
    methods: {
        closeBox() {
            this.showShiTiBox = false
            this.showImgBox = false
            this.showSvgBox = false
            this.showVideoBox = false
            this.showTableBox = false
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
        getJsonData() {
            let jsonData = []
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
        paste(data, x) {
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
            this.copyPos += 10;
        },
        toggleFullScreent(ele) {
            !this.isFullScreen ? draw.fullScreen(ele) : draw.exitFullscreen();
            this.isFullScreen = !this.isFullScreen
        },
        setControl(item, obj) {
            switch (item) {
                case 'info': break;
                case 'plus': this.addPage(); break;
                case 'minus': this.removePage(); break;
                case 'rotate': draw.setActiveProp('angle', draw.getActiveProp('angle') + 90); break;
                case 'pen': this.isDraw = !this.isDraw; this.setPenModel(this.isDraw); break;
                case 'text': this.addComponent('Textbox'); break;
                case 'image': this.showImgBox = true; break;
                case 'shape': this.showSvgBox = true; break;
                case 'line': break;
                case 'table': this.showTableBox = true; break;
                case 'media': this.showVideoBox = true; break;
                case 'book': this.showShiTiBox = true; break;
                case 'view': this.toggleFullScreent(this.$refs.drawbox[1]); break;
                case 'fullscreen': this.toggleFullScreent(this.$refs.pages); break;
            }
        },
        activeCanvas(index) {
            this.pages.map(x => x.active = false)
            this.pages[index].active = true
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
            i = i || 1  //for 里面使用闭包传入默认为1
            //在聚焦的下面插入
            //   let index = this.pages.indexOf(this.pages.filter(x => x.active)[0]) + 1
            //   this.pages.splice(index, 0, { active: false })

            //强暴插入
            this.pages.push({ active: false })
            let index = this.pages.length - 1

            setTimeout((index) => {
                //   console.log(index)
                let id = `canvas-${index}`
                let canvas = new qdraw.Canvas(id)
                this.draws.splice(index, 0, canvas)
            }, 500 * i, index);
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
                case 'paste': this.paste(this.copyData, this.copyPos);/*document.execCommand('paste');*/ break;
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
        addShape(options) {
            if (!options || !options.type) return;
            switch (options.type) {
                case 'rect': draw.addRect(options); break;
                case 'circle': draw.addCircle(options); break;
                case 'triangle': draw.addTriangle(options); break;
                case 'line': draw.addLine(options); break;
                case 'polygon': draw.addPolygon(options); break;
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
            this.showImgBox = false
            this.showSvgBox = false
            setTimeout(() => {
                this.updateJosn()
            }, 1000);
        },
        getObjStyle() {
            draw.getObjStyle()
        },
        showMenu(event) {
            if (this.isPreview) return
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
        setPenModel(isDraw) {
            draw.setFreeDrawingMode(isDraw)
        },
        save(type) {
            type == 'pdf' ? '' : ''
        },
        initPPT(data) {
            try {
                if (typeof data != 'object' || this.draws.length <= 0) return;
                data.map((j, i) => {
                    if (i == 0) {
                        this.draws[i].loadFromJSON(j, () => {
                            this.draws[i].isPreview = this.isPreview
                            this.draws[i].renderAll()
                        })
                    } else {
                        this.addPage(i)
                        setTimeout((i, j) => {
                            //   console.log(i, 'index')
                            this.draws[i].loadFromJSON(j, () => {
                                this.draws[i].isPreview = this.isPreview
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
        console.log('isPreview', this.isPreview)
        canvas.isPreview = this.isPreview
        this.canvas = canvas
        this.draws.push(canvas)
        draw.init(canvas)
    },

}
</script>

<style lang="less">
@import 'edit.less';
</style>
