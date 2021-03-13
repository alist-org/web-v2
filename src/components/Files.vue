<template>
  <div class="files">
    <a-table
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
      </template>
    </a-table>
  </div>
  <br />
</template>

<script lang="ts">
import { FileProps, GlobalDataProps } from "@/store";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import { getFileSize } from '../utils/file_size'
import { formatDate } from '../utils/date'
import { getIcon } from '../utils/get_icon'

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
        onClick:()=>{
          router.push('/'+record.dir+record.name)
        }
      }
    }
    return {
      columns,
      files,
      filesLoading,
      customRow
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
</style>