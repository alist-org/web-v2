<template>
  <div class="home">
    <div class="layout">
      <Header />
      <div class="content">
        <div class="tool">
          <Path />
        </div>
        <a-divider style="margin: 10px 0 5px 0;" />
        <Files v-if="type === 'folder'"/>
        <Readme v-if="type === 'folder'"/>
        <Preview v-if="type === 'file'" />
        <NotFound v-if="type === 'no'" />
      </div>
      <Footer />
    </div>
  </div>
  <a-modal v-model:visible="showPassword" title="请输入密码" @ok="okPassword" @cancel="cancelPassword">
    <a-input-password ref="inputRef" placeholder="此处为盘符密码" v-model:value="password" @pressEnter="okPassword"/>
  </a-modal>
</template>

<script lang="ts">
import Files from '@/components/Files.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import NotFound from '@/components/NotFound.vue';
import Path from '@/components/Path.vue'
import Preview from '@/components/Preview.vue';
import Readme from '@/components/Readme.vue';
import { GlobalDataProps } from '@/store';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import useRefresh from '../hooks/useRefresh'

export default defineComponent({
  name: 'Home',
  components: {
    Header,
    Footer,
    Path,
    Files,
    Preview,
    NotFound,
    Readme
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const type = computed(()=>store.state.type)
    const {refresh}=useRefresh()
    watch(()=>route.fullPath,() => {
      if(route.fullPath!=='/'){
        refresh()
      }else{
        if(store.state.info.roots)router.push(store.state.info.roots[0])
      }
    })
    onMounted(() => {
      store.dispatch("fetchInfo").then(()=>{
        if(route.fullPath!=='/'){
          refresh()
        }else{
          if(store.state.info.roots)router.push(store.state.info.roots[0])
        }
      })
    })
    const showPassword = computed<boolean>(() => {
      return store.state.meta.code===401
    })
    const inputRef = ref()
    watch(showPassword, ()=>{
      setTimeout(()=>{
        if(showPassword.value&&inputRef.value){
          inputRef.value.focus()
        }
      },50)
    })
    const password = ref<string>(store.state.password)
    const okPassword = () => {
      store.commit('setPassword',password.value)
      refresh()
    }
    const cancelPassword = () => {
      router.go(-1)
    }
    return{
      type,
      showPassword,
      password,
      okPassword,
      cancelPassword,
      inputRef,
    }
  }
});
</script>

<style scoped>
.home{
  /* background-color: var(--bgColor, white); */
  color: var(--textColor, black);
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: center;
  padding: 0;
  margin: 0;
  /* filter: invert(1) hue-rotate(180deg); */
}

.layout{
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: min(98vw, 980px);
}

@media screen and (max-width: 980px) {
  .layout{
    width: 98vw;
  }
}

.content{
  min-height: 80vh;
  width: 100%;
  display: flex;
  display: -webkit-flex; 
  flex-direction: column;
  justify-content: flex-start;
}
</style>