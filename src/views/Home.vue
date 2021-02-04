<template>
  <div :class="isAdrWx?'home-wx':'home'" >
    <div class="layout">
    <!--头部 ------------------------------------------------------------------------------------------------------- -->
    <div class="header">
      <router-link to="/">
        <img v-if="info.logo" :src="info.logo" alt="AList" style="height:56px;width:auto;" id="logo">
        <a-spin v-else />
      </router-link>
      <a-space>
        <a-popover title="二维码" class="qrcode">
          <template slot="content">
            <img :src="'https://api.xhofe.top/qr?size=200&text='+info.url"/>
          </template>
          <a-button type="primary" shape="circle" icon="qrcode" size="large" />
        </a-popover>
        <a-space v-if="show.preview&&(!preview_show.other)">
        <a-button type="primary" shape="circle" icon="copy" size="large" @click="copyFileLink" />
        <a target="_blank" :href="file.download_url"><a-button type="primary" shape="circle" icon="download" size="large" /></a>
        </a-space>
      </a-space>
    </div>
    <a-divider class="header-content" />
    <!--主体内容 ------------------------------------------------------------------------------------------------------- -->
    <div class="content">
      <div class="tool">
        <!--路径 ------------------------------------------------------------------------------------------------------- -->
        <div class="routes" v-show="show.routes">
          <a-icon type="home" id="home-icon"/>
          <a-breadcrumb :routes="routes">
            <template slot="itemRender" slot-scope="{ route, params, routes, paths }">
              <span v-if="routes.indexOf(route) === routes.length - 1">
                {{ route.breadcrumbName }}
              </span>
              <router-link v-else :to="`/${route.path}`">
                {{ route.breadcrumbName }}
              </router-link>
            </template>
          </a-breadcrumb>
        </div>
      </div>
      <a-divider class="header-content" />
      <!--文件列表 ------------------------------------------------------------------------------------------------------- -->
      <div class="files" v-show="show.files">
        <a-table 
          :columns="columns" :data-source="files" :pagination="false"
          rowKey="file_id" :customRow="customRow"
          :loading="files_loading"
          :scroll="{x:'max-content'}"
          >
          <template slot="name" slot-scope="text,record">
            <a-icon :type="`${record.icon}`" theme="filled" class="file-icon" />{{text}}
          </template>
        </a-table>
      </div>
      <br/>
      <!--Readme ------------------------------------------------------------------------------------------------------- -->
      <div class="readme" v-show="show.readme">
        <a-spin :spinning="readme_spinning">
          <a-card title="Readme.md" style="width: 100%" size="small">
            <!-- <a slot="extra" href="#">more</a> -->
            <MarkdownPreview :initialValue="readme" />
          </a-card>
        </a-spin>
      </div>
      <!--预览 ------------------------------------------------------------------------------------------------------- -->
      <div class="preview" v-show="show.preview">
        <!-- 无法预览，显示下载与直链 -->
        <a-result :title="file.name" v-if="preview_show.other">
          <template #icon>
            <a-icon :type="file.icon" theme="filled" />
          </template>
          <template #extra>
            <a target="_blank" :href="file.download_url">
              <a-button type="primary">下载</a-button>
            </a>
            <a-button type="primary" @click="copyFileLink">复制直链</a-button>
          </template>
        </a-result>
        <!-- 显示加载的部分 -->
        <a-spin :spinning="preview_spinning" v-if="preview_show.spinning">
          <div class="doc-preview" id="doc-preview" v-if="preview_show.doc"></div>
          <iframe :src="url" id="iframe-preview" ref="iframe-preview" v-if="preview_show.iframe"
          allowfullscreen="allowfullscreen" webkitallowfullscreen="true" mozallowfullscreen="true"
          class="iframe-preview" frameborder="no" @load="preview_spinning=false"></iframe>
          <div class="img-preview" v-if="preview_show.image"><img @load="preview_spinning=false" :src="url"/></div>
        </a-spin>
        <!-- 视频预览 -->
        <div class="video-preview" v-show="preview_show.video" id="video-preview">
        </div>
        <!-- 音频预览 -->
        <div class="audio-preview" v-if="preview_show.audio">
          <aplayer autoplay :music="audio_options" />
        </div>
        <!-- 文本预览 -->
        <div class="text-preview" v-if="preview_show.text">
          <MarkdownPreview :initialValue="text_content" />
        </div>
      </div>
    </div>
    <a-divider id="footer-line"/>
    <div class="footer">
      Powered By <a target="_blank" href="https://github.com/Xhofe/alist">AList</a>
      <a-divider v-if="info.footer_text" type="vertical" />
      <a v-if="info.footer_text" target="_blank" :href="info.footer_url">{{info.footer_text}}</a>
    </div>
    <a-modal v-model="show.password" title="Input password" @ok="handleOkPassword" @cancel="cancelPassword">
      <a-input-password placeholder="input password" v-model="password" @pressEnter="handleOkPassword"/>
    </a-modal>
    </div>
  </div>
</template>

<script>

import {list,get,search,info,getWebLatest,getBackLatest,getText,office_preview} from '../utils/api'
import {copyToClip} from '../utils/copy_clip'
import {formatDate} from '../utils/date'
import {getFileSize} from '../utils/file_size'
import { MarkdownPreview } from 'vue-meditor'
import DPlayer from 'dplayer'
import Aplayer from 'vue-aplayer'
import {Base64} from '../utils/base64'
import {getUrl} from '../utils/get_url'
import {versionStringCompare} from '../utils/version_compare'

export default {
  name: 'Home',
  components:{
    MarkdownPreview,Aplayer,
  },
  watch:{
    '$route'(to,from){
      this.init()
    }
  },
  data(){
    return{
      version:'v0.1.8',
      //表格列
      columns:[{align:'left',dataIndex:'name',title:'文件',scopedSlots:{customRender:'name'},
                sorter:(a,b)=>{
                  return a.name<b.name?1:-1
                }},
               {align:'right',dataIndex:'sizeStr',title:'大小',width:100,
                sorter:(a,b)=>{
                  return a.size-b.size
                }
               },
               {align:'right',dataIndex:'time',title:'时间',width:170,
                sorter:(a,b)=>{
                  return a.time<b.time?1:-1
                }}],
      files:[],//当前文件夹下文件
      files_loading:true,
      //是否展示的组件
      show:{
        search:false,
        routes:true,
        files:true,
        preview:false,
        readme:false,
        password:false,
      },
      //预览组件展示
      preview_show:{
        image:false,
        video:false,
        audio:false,
        doc:false,
        other:false,
        text:false,
        iframe:false,
        spinning:false,
      },
      //当前文件
      file:{},
      //当前文件预览url
      url:'',
      //预览视频选项
      video_options:{},
      //预览音频选项
      audio_options:{},
      //当前请求file_id
      file_id:undefined,
      //请求的密码
      password:localStorage.getItem('password'),
      //当前路径
      routes:[],
      //readme内容
      readme: '',
      // 文件与图标对应关系
      file_extensions:{
        exe:'windows',
        xls:'file-excel',
        xlsx:'file-excel',
        md:'file-markdown',
        pdf:'file-pdf',
        ppt:'file-ppt',
        pptx:'file-ppt',
        doc:'file-word',
        docx:'file-word',
        // jpg:'file-jpg',
        zip:'file-zip',
        gz:'file-zip',
        rar:'file-zip',
        "7z":'file-zip',
        tar:'file-zip',
        jar:'file-zip',
        xz:'file-zip',
        apk:'android',
        dmg:'apple',
        ipa:'apple',
      },
      doc:['pdf','doc','docx','ppt','pptx','xls','xlsx'],
      categorys:{
        image:'file-image',
        doc:'file-text',
        video:'youtube',
        audio:'customer-service',
      },
      //自定义内容
      info:{
        
      },
      text_content:'',//文本内容
      preview_spinning:true,
      readme_spinning:true,
      dp:undefined,
      isAdrWx:false,
    }
  },
  methods:{
    // 检查后端更新
    async checkBackUpdate(){
      getBackLatest().then(res=>{
        let lasted=res.data.tag_name.substring(1)
        let now=this.info.version.substring(1)
        if(versionStringCompare(lasted,now)==1){
          this.$notify.open({
            message: '发现新版本',
            description:
              '后端新版本:'+res.data.tag_name+', 请至'+res.data.html_url+'获取新版本',
            icon: <a-icon type="smile" style="color: #1890ff" />,
          });
        }else{
          //已经是最新版本
          console.log(this.version)
        }
      }).catch(err=>{
        console.log("failed check update",err);
      })
    },
    // 检查前端更新
    async checkWebUpdate(){
      getWebLatest().then(res=>{
        let lasted=res.data.tag_name.substring(1)
        let now=this.version.substring(1)
        if(versionStringCompare(lasted,now)==1){
          this.$notify.open({
            message: '发现新版本',
            description:
              '前端新版本:'+res.data.tag_name+', 请至'+res.data.html_url+'获取新版本',
            icon: <a-icon type="smile" style="color: #1890ff" />,
          });
        }else{
          //已经是最新版本
          console.log(this.version)
        }
      }).catch(err=>{
        console.log("failed check update",err);
      })
    },
    // 初始化一些信息
    initInfo(){
      info().then(res=>{
        if (res.meta.code==200) {
          this.info=res.data
          if(res.data.check_update){
            // this.checkBackUpdate()
            this.checkWebUpdate()
          }
          if (res.data.title && res.data.title!="") {
            document.title=res.data.title
          }
          if(!this.info.logo){
            this.info.logo=require('../assets/alist.png')
          }
          if(this.info.script){
            this.loadJS(this.info.script)
          }
          this.info.url=window.location.href
          this.info.backend_url=process.env.VUE_APP_API_URL!='./'?process.env.VUE_APP_API_URL:getUrl()
        }else{
          this.$msg.error(res.meta.msg)
        }
      })
    },
    // 页面初始化
    init(){
      if (this.dp) {
        this.dp.destroy()
      }
      this.info.url=window.location.href
      this.show.routes=true
      this.show.files=true
      this.show.search=false
      this.show.preview=false
      this.show.readme=false
      this.preview_show={
        image:false,
        video:false,
        audio:false,
        doc:false,
        other:false,
        text:false,
      }
      this.file_id=this.$route.params.id
      if(this.file_id==undefined){
        this.file_id="root"
      }
      this.refreshFileId()
    },
    // 更换了文件/目录，重新请求
    refreshFileId(){
      //首先获取列表看是不是
      this.files_loading=true
      list(this.file_id,this.password).then(res=>{
        if (res.meta.code==200) {
          //获取成功 是文件夹
          localStorage.setItem('password',this.password)
          this.showRoutes(res.data.paths)
          this.showFiles(res.data.items)
          //展示Readme?
          this.showReadme(res.data.items)
        }else if(res.meta.code==401){
          //需要密码
          this.$msg.error(res.meta.msg)
          this.show.password=true
        }else{
          // 不是文件夹，尝试获取文件
          this.show.files=false
          get(this.file_id).then(res=>{
            if (res.meta.code==200) {
              //获取成功 是文件
              this.showRoutes(res.data.paths)
              this.showFile(res.data)
            }else{
              // 也不是文件
              this.$msg.warning(res.meta.msg)
              this.show.routes=false
            }
          })
        }
      })
    },
    // 显示面包屑导航
    showRoutes(paths){
      this.routes=paths.reverse().map(item=>{
        item.path=item.file_id
        item.breadcrumbName=item.name
        return item
      })
    },
    // 显示文件列表
    showFiles(files){
      this.files_loading=false
      this.files=files.map(item=>{
        item.time=formatDate(item.updated_at)
        if(item.type=='folder'){
          item.sizeStr='-'
        }else{
          item.sizeStr=getFileSize(item.size)
        }
        item.icon=this.getIcon(item)
        return item
      })
    },
    // 获取文件对应ICON
    getIcon(record){
      if (record.type=='folder'){
        return 'folder'
      }
      if (this.file_extensions.hasOwnProperty(record.file_extension)){
        return this.file_extensions[record.file_extension]
      }
      if (this.categorys.hasOwnProperty(record.category)){
        return this.categorys[record.category]
      }
      return 'file'
    },
    // 展示Readme信息
    showReadme(files){
      for(let file of files){
        if(file.type=='file'&&file.name.toLowerCase()=='readme.md'){
          this.show.readme=true
          this.readme_spinning=true
          getText(this.info.backend_url+"d/"+file.file_id).then(res=>{
            this.readme=res.data
            this.readme_spinning=false
          })
          return
        }
      }
      this.show.readme=false
    },
    // 展示/预览文件
    showFile(file){
      this.file=file
      this.file.icon=this.getIcon(file)
      this.url=file.download_url
      this.show.preview=true
      if (this.doc.includes(file.file_extension.toLowerCase())) {
        this.showDoc(file)
        return
      }
      if (file.category=='image') {
        // 预览图片
        this.preview_show.spinning=true
        this.preview_spinning=true
        this.preview_show.image=true
        return
      }
      if (file.category=='video') {
        // 预览视频
        this.preview_show.video=true
        this.video_options={
          container: document.getElementById('video-preview'),
          video:{
            url:this.url
          },
          autoplay:this.info.autoplay?true:false,
          screenshot:true,
        }
        this.dp=new DPlayer(this.video_options)
        return
      }
      if (file.category=='audio'){
        this.audio_options={
          title: file.name,
          artist: '',
          src: this.url,
          pic: this.info.music_img?this.info.music_img:'https://img.xhofe.top/2020/12/07/f6e43dc79d74a.png'
        }
        this.preview_show.audio=true
        return
      }
      if (this.info.preview.text.includes(file.file_extension.toLowerCase())){
        this.showText(file)
        return
      }
      this.showIframe(file)
      // this.preview_show.other=true
    },
    // 展示文本
    showText(file){
      this.text_content=''
      this.preview_show.text=true
      getText(file.url).then(res=>{
        if (file.file_extension.toLowerCase()=='md') {
          this.text_content=res.data
        }else{
          this.text_content='```'+file.file_extension+'\n'+res.data+'\n```'
        }
      })
    },
    // 展示文档
    showDoc(file){
      this.preview_show.spinning=true
      this.preview_spinning=true
      this.preview_show.doc=true
      office_preview(this.file_id).then(res=>{
        if (res.meta.code==200) {
          let doc_options=aliyun.config({
            mount: document.querySelector('#doc-preview'),
            url: res.data.preview_url //设置文档预览URL地址。
          })
          doc_options.setToken({token: res.data.access_token})
          setTimeout(()=>{this.preview_spinning=false},200)
        }else{
          this.$msg.error(res.meta.msg)
        }
      })
    },
    // 展示Iframe
    showIframe(file){
      if (this.info.preview.extensions.includes(file.file_extension)) {
        if (file.size<=this.info.preview.max_size) {
          let direct_url=this.info.backend_url+"d/"+this.file_id+'/'+file.name
          for(const v of this.info.preview.pre_process){
            switch (v){
              case 'base64':
                direct_url=Base64.encode(direct_url)
                break
              case 'encodeURIComponent':
                direct_url=encodeURIComponent(direct_url)
                break
              case 'encodeURI':
                direct_url=encodeURI(direct_url)
                break
              default:
                this.$msg.warning('配置文件中不支持的encode.')
                this.preview_show.other=true
                return
            }
          }
          this.preview_show.spinning=true
          this.preview_spinning=true
          this.url=this.info.preview.url+direct_url
          this.preview_show.iframe=true
          return
        }else{
          this.$msg.warning("文件过大,请下载查看.")
        }
      }
      this.preview_show.other=true
    },
    // 监听表格点击
    customRow(record, index){
      return{
        on:{
          click:event=>{
            this.$router.push(record.file_id)
          }
        }
      }
    },
    // 处理确认输入密码
    handleOkPassword(){
      this.show.password=false
      this.refreshFileId()
    },
    // 取消输入密码
    cancelPassword(){
      this.$router.go(-1)
    },
    // 复制文件直链
    copyFileLink(){
      let content=this.info.backend_url+"d/"+this.file_id
      copyToClip(content)
      this.$msg.success('链接已复制到剪贴板.');
    },
    // 加载自定义的脚本内容
    loadJS(content){
      return new Promise((resolve,reject)=>{
        let script = document.createElement('script')
        script.type = "text/javascript"
        script.onload = ()=>{
          resolve()
        }
        script.onerror = ()=>{
          reject()
        }
        if(/^(http|https):\/\/([\w.]+\/?)\S*/.test(content)){
          script.src=content
        }else{
          script.text= content
        }
        document.querySelector('body').appendChild(script)
      })
    }
  },
  mounted(){
    console.log("\n %c Alist %c https://github.com/Xhofe/alist \n\n","color: #fadfa3; background: #030307; padding:5px 0;","background: #fadfa3; padding:5px 0;")
    // 判断是否安卓微信
    if(navigator.userAgent.match(/MicroMessenger/i)&&navigator.userAgent.match(/android/i)){
      this.isAdrWx=true
    }
    this.initInfo()
    this.init()
  }
}
</script>

<style scoped>
.home{
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: center;
  padding: 0;
  margin: 0;
}
.home-wx{
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  /* justify-content: center; */
  padding: 0;
  margin: 0;
}

.layout{
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: min(1200px,98vw);
}
.header{
  padding-top: 3px;
  height: 56px;
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: space-between;
  align-items: center;
}
.header-content{
  margin: 10px 0 5px 0;
}
.content{
  min-height: 80vh;
  width: 100%;
  display: flex;
  display: -webkit-flex; 
  flex-direction: column;
  justify-content: flex-start;
}
.routes{
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); */
  margin: 2px 2px;
  padding: 2px;
  display: flex;
  display: -webkit-flex; 
  font-size: 20px;
}
#home-icon{
  margin-right: 10px;
}

.file-icon{
  margin-right: 10px;
  font-size: 20px;
  color: #1890ff;
}

.video-preview{
  width: 100%;
}

@media screen and (min-width: 600px) {
  #video-preview{
    height: 80vh;
  }
}

.iframe-preview{
  width: 100%;
  height: 80vh;
  box-sizing: inherit;
}

.doc-preview{
  width: 100%;
  height: 80vh;
}

.img-preview{
  width: 100%;
  height: 80vh;
}

.img-preview img  {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}

.footer{
  width: 100%;
  text-align: center;
  height: 40px;
}
#footer-line{
  margin: 10px 0;
}

@media screen and (max-width: 600px) {
    .qrcode {
        display: none;
    }
}

</style>
