<template>
  <div class="files">
    <div class="files-list" v-contextmenu>
      <div v-if="isImages&&showImages">
        <ul id="images">
          <li v-for="image in images" :key="image.name" class="image">
            <img :src="getFileDownLink(image)" :alt="image.name">
          </li>
        </ul>
      </div>
      <a-table v-else
        :columns="columns"
        :data-source="files"
        :pagination="false"
        rowKey="file_id"
        :customRow="customRow"
        :loading="filesLoading"
        :scroll="{ x: 'max-content' }"
        :row-selection="isMultiple?{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, }:null"
      >
        <template #name="{ text,record }">
          <component :is="record.icon" class="file-icon"/>
          {{ text }}
          <span v-if="record.type==='file'" class="action">
            <copy id="action-1" @click="copyFileLink(record)" />
            <a target="_blank" :href="getFileDownLink(record)">
              <download class="action" id="action-2"></download>
            </a>
          </span>
        </template>
      </a-table>
    </div>
    <br />
    <context-menu>
      <context-menu-item @click="multipleChoice" :divider="true">{{isMultiple?"✓":""}}多选</context-menu-item>
      <context-menu-submenu :label="'操作'">
        <context-menu-item :disabled="!isMultiple" @click="download">下载</context-menu-item>
        <context-menu-item :disabled="!isMultiple" @click="copyDownloadLink">复制直链</context-menu-item>
        <context-menu-item :disabled="!isMultiple" @click="copyTransText">复制秒传</context-menu-item>
        <context-menu-item :disabled="!isMultiple" @click="getTransFile">获取秒传文件</context-menu-item>
      </context-menu-submenu>
    </context-menu>
  </div>
</template>

<script lang="ts">
import {FileProps, GlobalDataProps} from "@/store"
import {computed, defineComponent, ref, watch} from "vue"
import {useStore} from "vuex"
import {useRouter} from 'vue-router'
import {getFileSize} from '@/utils/file_size'
import {formatDate} from '@/utils/date'
import {getIcon} from '@/utils/get_icon'
import {useDownloadFile} from "@/hooks/useDownloadUrl"
import Viewer from 'viewerjs'
import {ColumnProps} from 'ant-design-vue/es/table/interface';
import downloadText from '../utils/downText'
import {message} from "ant-design-vue"
import {copyToClip} from "@/utils/copy_clip"

type Key = ColumnProps['key'];

export default defineComponent({
  name: "Files",
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter()
    const columns = [
      {
        align: "left",
        dataIndex: "name",
        title: "文件名称",
        slots: { customRender: "name" },
        sorter: (a, b) => {
          return a.name < b.name ? 1 : -1;
        },
      },
      {
        align: "right",
        dataIndex: "sizeStr",
        title: "大小",
        width: 100,
        sorter: (a, b) => {
          return a.size - b.size;
        },
      },
      {
        align: "right",
        dataIndex: "time",
        title: "修改时间",
        width: 170,
        sorter: (a, b) => {
          return a.time < b.time ? 1 : -1;
        },
      },
    ];

    const filesLoading = computed(() => store.state.loading)
    watch(filesLoading,() => {
      if(!filesLoading.value && store.state.showImages){
        setTimeout(()=>{
          const images = document.getElementById('images')
          if(images){
            new Viewer(images);
          }
        },100)
      }
    })
    const files = computed(() => {
      const data = store.state.data as FileProps[]
      return data.map(item => {
        item.time = formatDate(item.updated_at)
        if (item.type == 'folder') {
          item.sizeStr = '-'
        } else {
          item.sizeStr = getFileSize(item.size)
        }
        item.icon = getIcon(item)
        return item
      })
    })
    const selectedRowKeys = ref<Key[]>([])
    const selectedRows = ref<FileProps[]>([])
    const customRow = (record) => {
      return{
        onClick:(e)=>{
          if(e.target&&e.target.tagName==='svg'){return}
          selectedRowKeys.value = []
          selectedRows.value =[]
          router.push('/'+record.dir+record.name)
        }
      }
    }
    const {getFileDownLink, copyFileLink} = useDownloadFile()
    const isImages = computed(() => store.state.isImages)
    const showImages = computed(() => store.state.showImages)
    const images = computed(() => files.value.filter(item=>item.category==='image'))
    
    const onSelectChange = (_selectedRowKeys: Key[],_selectedRows) => {
      // console.log('selectedRowKeys changed: ', _selectedRowKeys);
      selectedRows.value = _selectedRows
      selectedRowKeys.value = _selectedRowKeys;
    };
    const isMultiple = computed(() => store.state.isMultiple)
    const multipleChoice = ()=>{
      store.commit('setIsMultiple', !isMultiple.value)
    }
    const getTransText = () => {
      let text = ''
      let containFolder = false;
      selectedRows.value.forEach(item => {
        if(item.type === 'folder'){
          containFolder = true;
        }else{
          text += `aliyunpan://${item.name}|${item.content_hash}|${item.size}|${item.content_type}\n`
        }
      })
      if(containFolder){
        message.warn("选择中包含了文件夹,已自动去除.")
      }
      return text
    }
    const copyDownloadLink = () => {
      let text = ''
      let containFolder = false;
      selectedRows.value.forEach(item => {
        if(item.type === 'folder'){
          containFolder = true;
        }else{
          text += getFileDownLink(item)+'\n'
        }
      })
      if(containFolder){
        message.warn("选择中包含了文件夹,已自动去除.")
      }
      copyToClip(text)
      message.success("已复制直链.")
    }
    const copyTransText = () => {
      copyToClip(getTransText())
      message.success("已复制秒传文本.")
    }
    const download = () => {
      selectedRows.value.forEach(item => {
        if(item.type !== 'folder'){
          window.open(getFileDownLink(item), "_blank")
        }
      })
    }
    const getTransFile = () => {
      const files = selectedRows.value.filter(item => item.type==='file')

      if(files.length===0){
        message.warn('未选择文件.')
        return
      }
      downloadText(`${files[0].name}等${files.length}个文件.txt`,getTransText())
    }
    return {
      columns,
      files,
      filesLoading,
      customRow,
      getFileDownLink,
      copyFileLink,
      isImages,
      showImages,
      images,
      selectedRowKeys,
      onSelectChange,
      multipleChoice,
      isMultiple,
      copyDownloadLink,
      copyTransText,
      download,
      getTransFile,
    }
  },
});
</script>

<style scoped>
.file-icon {
  margin-right: 10px;
  font-size: 20px;
  color: #1890ff;
}
.action {
  color: gray;
}
#images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  /* grid-gap: 24px; */
  list-style: none;
  justify-items: center;
}
.image {
  width: 100px;
  height: 90px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;
}
.image img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  border-radius: 5px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}
</style>