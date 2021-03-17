<template>
  <div class="files">
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
</template>

<script lang="ts">
import { FileProps, GlobalDataProps } from "@/store"
import { computed, defineComponent } from "vue"
import { useStore } from "vuex"
import { useRouter } from 'vue-router'
import { getFileSize } from '../utils/file_size'
import { formatDate } from '../utils/date'
import { getIcon } from '../utils/get_icon'
import { useDownloadFile } from "@/hooks/useDownloadUrl"

export default defineComponent({
  name: "Files",
  setup() {
    const store = useStore<GlobalDataProps>();
    const router = useRouter()
    const columns = [
      {
        align: "left",
        dataIndex: "name",
        title: "文件",
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
        title: "时间",
        width: 170,
        sorter: (a, b) => {
          return a.time < b.time ? 1 : -1;
        },
      },
    ];
    const filesLoading = computed(() => store.state.loading)

    const files = computed(() => {
      const data = store.state.data as FileProps[]
      const res = data.map(item => {
        item.time = formatDate(item.updated_at)
        if(item.type=='folder'){
          item.sizeStr='-'
        }else{
          item.sizeStr=getFileSize(item.size)
        }
        item.icon = getIcon(item)
        return item
      })
      return res
    })
    const customRow = (record) => {
      return{
        onClick:(e)=>{
          if(e.target&&e.target.tagName==='svg'){return}
          router.push('/'+record.dir+record.name)
        }
      }
    }
    const {getFileDownLink, copyFileLink} = useDownloadFile()
    const isImages = computed(() => store.state.isImages)
    const showImages = computed(() => store.state.showImages)
    const images = computed(() => files.value.filter(item=>item.category==='image'))
    return {
      columns,
      files,
      filesLoading,
      customRow,
      getFileDownLink,
      copyFileLink,
      isImages,
      showImages,
      images
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
  display: -webkit-flex; /* Safari */
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: center;
  list-style: none;
}
.image {
  height:120px;
  margin: 4px;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  background-color: rgba(240, 248, 255,0.8);
  cursor: pointer;
}
.image img {
  height: 100%;
  width: auto;
}
</style>