import { FileProps, GlobalDataProps } from "@/store";
import { backendUrl } from "@/utils/const";
import { copyToClip } from "@/utils/copy_clip";
import { message } from "ant-design-vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { Md5 } from 'ts-md5/dist/md5'

function useDownloadUrl() {
  const store = useStore<GlobalDataProps>()
  const route = useRoute()
  const downloadUrl = computed(() => {
    let url = backendUrl + "d" + encodeURI(decodeURI(route.path))
    const file = store.state.data as FileProps
    if(file.password === 'y' && store.state.password){
      const md5 = Md5.hashStr(store.state.password) as string
      url += '?pw=' + md5.substring(8, 24)
    }
    return url
  })
  const copyFileLink = () => {
    copyToClip(downloadUrl.value)
    message.success("链接已复制到剪贴板.")
  }
  return {
    downloadUrl,
    copyFileLink
  }
}

export const useDownloadFile = () =>{
  const store = useStore<GlobalDataProps>()
  const getFileDownLink = (file: FileProps)=>{
    let url = backendUrl + 'd/' + encodeURI(file.dir + file.name)
    if(file.password === 'y' && store.state.password){
      const md5 = Md5.hashStr(store.state.password) as string
      url += '?pw=' + md5.substring(8, 24)
    }
    return url
  }
  const copyFileLink = (file: FileProps) => {
    copyToClip(getFileDownLink(file))
    message.success("链接已复制到剪贴板.")
  }
  return {
    getFileDownLink,
    copyFileLink,
  }
}

export default useDownloadUrl