import { backendUrl } from "@/utils/const";
import { copyToClip } from "@/utils/copy_clip";
import { message } from "ant-design-vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

function useDownloadUrl() {
  const route = useRoute()
  const downloadUrl = computed(() => backendUrl + "d" + decodeURI(route.path))
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