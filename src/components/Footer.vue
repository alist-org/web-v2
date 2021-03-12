<template>
  <a-divider id="footer-line"/>
  <div class="footer">
    Powered By <a target="_blank" href="https://github.com/Xhofe/alist">AList</a>
    <a-divider type="vertical" />
    <a-button type="link">重建目录</a-button>
    <a-divider v-if="info.footer_text" type="vertical" />
    <a v-if="info.footer_text" target="_blank" :href="info.footer_url">{{info.footer_text}}</a>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from '@/store'
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Footer',
  setup() {
    const store = useStore<GlobalDataProps>()
    const info = computed(() => store.state.info)
    return {
      info
    }
  },
})
</script>

<style scoped>
.footer{
  width: 100%;
  text-align: center;
  height: 40px;
}
#footer-line{
  margin: 10px 0;
}
</style>
