import { GlobalDataProps } from "@/store";
import { backendUrl } from "@/utils/const";
import { copyToClip } from "@/utils/copy_clip";
import { message } from "ant-design-vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

function useDownloadUrl() {
  const store = useStore<GlobalDataProps>()
  const route = useRoute()
  const downloadUrl = computed(() => backendUrl + "d" + decodeURI(route.path) + '?pw=' + store.state.password)
  const copyFileLink = () => {
    copyToClip(downloadUrl.value)
    message.success("链接已复制到剪贴板.")
  }
  return {
    downloadUrl,
    copyFileLink
  }
}

export default useDownloadUrl