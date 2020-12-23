<template>
  <div class="home">
    <div class="layout">
    <div class="header">
      <router-link to="/"><img src="../assets/alist.png" alt="AList" style="height:100%;width:auto;"></router-link>
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
          <p>card content</p>
        </a-card>
      </div>
      <div class="preview">

      </div>
    </div>
    <a-divider id="footer-line"/>
    <div class="footer">
      Powered By <a target="_blank" href="https://github.com/Xhofe/alist">AList</a>
      <a-divider type="vertical" />
      <a target="_blank" href="https://nn.ci">Xhofe's Blog</a>
    </div>
    <a-modal v-model="show.password" title="Input password" @ok="handleOkPassword" @cancel="cancelPassword">
      <a-input-password placeholder="input password" v-model="password" @pressEnter="handleOkPassword"/>
    </a-modal>
    </div>
  </div>
</template>

<script>

import {list,get,search} from '../utils/api'
import {formatDate} from '../utils/date'
import {getFileSize} from '../utils/file_size'

export default {
  name: 'Home',
  watch:{
    '$route'(to,from){
      this.init()
    }
  },
  data(){
    return{
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
      files:[],
      files_loading:true,
      show:{
        search:false,
        routes:true,
        files:true,
        preview:false,
        readme:false,
        password:false,
      },
      file_id:undefined,
      password:undefined,
      routes:[],
      
      file_extensions:{
        xls:'file-excel',
        xlsx:'file-excel',
        md:'file-markdown',
        pdf:'file-pdf',
        ppt:'file-ppt',
        pptx:'file-pptx',
        doc:'file-word',
        docx:'file-word',
        // jpg:'file-jpg',
        zip:'file-zip',
        gz:'file-zip',
        rar:'file-zip',
        "7z":'file-zip',
        tar:'file-zip',
        jar:'file-zip',
        xz:'file-zip'
      },
      categorys:{
        image:'file-image',
        doc:'file-text',
        video:'video-camera',
      },
    }
  },
  methods:{
    init(){
      this.show.routes=true
      this.show.files=true
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
              showFile()
            }else{
              // 也不是文件
              this.$msg.warning(res.meta.msg)
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
      if (readme!=""){
        this.show.readme=true
      }else{
        this.show.readme=false
      }
    },
    showFile(){
      
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
    }
  },
  mounted(){
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
  justify-content: flex-start;
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
.files{
  
}
.file-icon{
  margin-right: 10px;
  font-size: 20px;
  color: #53b0f6;
}
.preview{

}
.footer{
  width: 100%;
  text-align: center;
  height: 40px;
}
#footer-line{
  margin: 10px 0;
}

</style>
