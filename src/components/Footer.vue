<template>
  <a-divider id="footer-line"/>
  <div class="footer">
    Powered By <a target="_blank" href="https://github.com/Xhofe/alist">AList</a>
    <a-divider type="vertical" />
    <a-button type="link" size="small" @click="showPassword = true">ReBuild</a-button>
    <a-divider v-if="info.footer_text" type="vertical" />
    <a v-if="info.footer_text" target="_blank" :href="info.footer_url">{{info.footer_text}}</a>
  </div>
  <a-modal v-model:visible="showPassword" title="重建目录密码" @ok="rebuild" @cancel="showPassword = false">
    <a-input-password placeholder="input password" v-model:value="password" @pressEnter="rebuild"/>
  </a-modal>
</template>

<script lang="ts">
import { GlobalDataProps } from '@/store'
import { rebuildGet } from '@/utils/api'
import { message } from 'ant-design-vue'
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import useRefresh from '@/hooks/useRefresh'

export default defineComponent({
  name: 'Footer',
  setup() {
    const store = useStore<GlobalDataProps>()
    const info = computed(() => store.state.info)
    const showPassword = ref<boolean>(false)
    const password = ref<string>(localStorage.getItem('rebuild-password')||'')
    const {refresh} = useRefresh()
    const rebuild = ()=>{
      localStorage.setItem('rebuild-password', password.value)
      showPassword.value = false
      rebuildGet(password.value).then(resp=>{
        const res =resp.data
        if(res.meta.code===200){
          message.success(res.meta.msg)
          refresh()
        }else{
          message.error(res.meta.msg)
        }
      })
    }
    return {
      info,
      rebuild,
      showPassword,
      password,
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
