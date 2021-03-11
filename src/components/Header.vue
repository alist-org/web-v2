<template>
  <div class="header">
    <router-link to="/">
      <img v-if="info.logo" :src="info.logo" alt="AList" style="height:56px;width:auto;" id="logo">
      <a-spin v-else />
    </router-link>
    <a-space>
      <a-popover title="二维码" class="qrcode">
        <template #content>
          <img :src="'https://api.xhofe.top/qr?size=200&text='+url"/>
        </template>
        <a-button type="primary" shape="circle" size="large">
          <template #icon><component :is="'qr-code'"/></template>
        </a-button>
      </a-popover>
      <a-space v-if="isFile">
        <a-button type="primary" shape="circle" size="large" @click="copyFileLink">
          <template #icon><copy /></template>
        </a-button>
        <a target="_blank" :href="downloadUrl">
          <a-button type="primary" shape="circle" size="large">
            <template #icon><download/></template>
          </a-button>
        </a>
      </a-space>
    </a-space>
  </div>
  <a-divider class="header-content" />
</template>

<script lang="ts">
import { GlobalDataProps } from '@/store'
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { backendUrl } from '../utils/const'
import { copyToClip } from '../utils/copy_clip'
export default defineComponent({
  name: 'Header',
  setup() {
    const store = useStore<GlobalDataProps>()
    const route =useRoute()
    const info = computed(() => store.state.info)
    const url = computed(() => window.location.href)
    const isFile = computed(() => store.state.isFile)
    onMounted(() => {
      store.dispatch('fetchInfo')
    })
    const downloadUrl = computed(() => backendUrl+'d'+route.path)
    const copyFileLink = () => {
      copyToClip(downloadUrl.value)
      message.success('链接已复制到剪贴板.')
    }
    return{
      info,
      url,
      isFile,
      copyFileLink,
      downloadUrl
    }
  }
})
</script>

<style scoped>
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
</style>