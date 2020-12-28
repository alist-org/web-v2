<template>
  <div class="home">
    <div class="layout">
    <div class="header">
      <router-link to="/">
        <img v-if="info.logo" :src="info.logo" alt="AList" style="height:56px;width:auto;" id="logo">
        <a-spin v-else />
      </router-link>
      <div v-if="show.preview&&(!preview_show.other)">
        <a-button type="primary" shape="circle" icon="copy" size="large" @click="copyFileLink" />
        <a class="down-btn"  target="_blank" :href="file.download_url"><a-button type="primary" shape="circle" icon="download" size="large" /></a>
      </div>
    </div>
    <a-divider class="header-content" />
    <div class="content">
      <div class="tool">
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
      <div class="files" v-show="show.files">
        <a-table 
          :columns="columns" :data-source="files" :pagination="false"
          rowKey="file_id" :customRow="customRow"
          :loading="files_loading"
          >
          <template slot="name" slot-scope="text,record">
            <a-icon :type="`${record.icon}`" theme="filled" class="file-icon" />{{text}}
          </template>
        </a-table>
      </div>
      <br/>
      <div class="readme" v-show="show.readme">
        <a-card title="Readme.md" style="width: 100%" size="small">
          <!-- <a slot="extra" href="#">more</a> -->
          <MarkdownPreview :initialValue="readme" />
        </a-card>
      </div>
      <div class="preview" v-show="show.preview">
        <a-result :title="file.name" v-if="preview_show.other">
          <template #icon>
            <a-icon :type="file.icon" theme="filled" />
          </template>
          <template #extra>
            <a target="_blank" :href="file.download_url">
              <a-button type="primary">
                下载
              </a-button>
            </a>
            <a-button type="primary" @click="copyFileLink">
              复制直链
            </a-button>
          </template>
        </a-result>
        <iframe :src="url" class="doc-preview" v-if="preview_show.doc"></iframe>
        <div class="img-preview" v-if="preview_show.image"><img :src="url"/></div>
        <div class="video-preview" v-if="preview_show.video">
          <d-player id="d-player" screenshot=true autoplay=true :options="video_options"></d-player>
        </div>
        <div class="audio-preview" v-if="preview_show.audio">
          <aplayer autoplay
            :music="audio_options"
          />
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

import {list,get,search,info} from '../utils/api'
import {copyToClip} from '../utils/copy_clip'
import {formatDate} from '../utils/date'
import {getFileSize} from '../utils/file_size'
import { MarkdownPreview } from 'vue-meditor'
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'
import Aplayer from 'vue-aplayer'

export default {
  name: 'Home',
  components:{
    MarkdownPreview,Aplayer,
    'd-player': VueDPlayer,
  },
  watch:{
    '$route'(to,from){
      this.init()
    }
  },
  data(){
    return{
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
      password:undefined,
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
      },
      categorys:{
        image:'file-image',
        doc:'file-text',
        video:'youtube',
        audio:'customer-service',
      },
      //自定义内容
      info:{
        
      }
    }
  },
  methods:{
    initInfo(){
      info().then(res=>{
        if (res.meta.code==200) {
          this.info=res.data
          if (res.data.title && res.data.title!="") {
            document.title=res.data.title
          }
          if(!this.info.logo){
            this.info.logo=require('../assets/alist.png')
          }
        }else{
          this.$msg.error(res.meta.msg)
        }
      })
    },
    init(){
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
      }
      this.file_id=this.$route.params.id
      if(this.file_id==undefined){
        this.file_id="root"
      }
      this.refreshFileId()
    },
    refreshFileId(){
      //首先获取列表看是不是
      this.files_loading=true
      list(this.file_id,this.password).then(res=>{
        if (res.meta.code==200) {
          //获取成功 是文件夹
          this.showRoutes(res.data.paths)
          this.showFiles(res.data.items)
          //展示Readme?
          this.showReadme(res.data.readme)
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
    showRoutes(paths){
      this.routes=paths.reverse().map(item=>{
        item.path=item.file_id
        item.breadcrumbName=item.name
        return item
      })
    },
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
    showReadme(readme){
      this.readme=readme
      if (readme!=""){
        this.show.readme=true
      }else{
        this.show.readme=false
      }
    },
    showFile(file){
      this.file=file
      this.file.icon=this.getIcon(file)
      this.url=file.download_url
      this.show.preview=true
      if (file.category=='doc') {
        // TODO 无法预览,为啥啊
        // this.preview_show.doc=true
        // this.url='https://view.officeapps.live.com/op/view.aspx?src='+encodeURIComponent(file.download_url)
      }
      if (file.category=='image') {
        // 预览图片
        this.preview_show.image=true
        return
      }
      if (file.category=='video') {
        // 预览视频
        this.video_options={
          video:{
            url:this.url
          }
        }
        this.preview_show.video=true
        return
      }
      if (file.category=='audio'){
        this.audio_options={
          title: file.name,
          artist: '',
          src: this.url,
          pic: this.info.music_img?this.info.music_img:'https://img.oez.cc/2020/12/07/f6e43dc79d74a.png'
        }
        this.preview_show.audio=true
        return
      }
      this.preview_show.other=true
    },
    customRow(record, index){
      return{
        on:{
          click:event=>{
            this.$router.push(record.file_id)
          }
        }
      }
    },
    handleOkPassword(){
      this.show.password=false
      this.refreshFileId()
    },
    cancelPassword(){
      this.$router.go(-1)
    },
    copyFileLink(){
      let content=this.info.backend_url+"/d/"+this.file_id
      copyToClip(content)
      this.$msg.success('链接已复制到剪贴板.');
    }
  },
  mounted(){
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
.layout{
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: min(980px,98vw);
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
/* .files{
  
} */
.file-icon{
  margin-right: 10px;
  font-size: 20px;
  color: #1890ff;
}
/* .preview{

} */

#d-player{
  height: 80vh;
  width: 100%;
}

.doc-preview{
  width: 100%;
  height: 80vh;
  box-sizing: inherit;
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

.down-btn{
  margin-left: 4px;
}

</style>
