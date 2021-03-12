<template>
  <div :class="isAdrWx?'home-wx':'home'">
    <div class="layout">
      <Header />
      <div class="content">
        <div class="tool">
          <Path />
        </div>
        <a-divider style="margin: 10px 0 5px 0;" />
        <Files v-if="type === 'folder'"/>
        <Preview v-if="type === 'file'" />
        <NotFound v-if="type === 'no'" />
      </div>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import Files from '@/components/Files.vue';
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import NotFound from '@/components/NotFound.vue';
import Path from '@/components/Path.vue'
import Preview from '@/components/Preview.vue';
import { GlobalDataProps } from '@/store';
import { computed, defineComponent, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Home',
  components: {
    Header,
    Footer,
    Path,
    Files,
    Preview,
    NotFound
  },
  setup() {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    let isAdrWx = false
    if(navigator.userAgent.match(/MicroMessenger/i)&&navigator.userAgent.match(/android/i)){
      isAdrWx=true
    }
    const type = computed(()=>store.state.type)
    watch(()=>route.fullPath,(newVal) => {
      store.dispatch('fetchPathOrSearch',{path: decodeURI(route.path.substring(1)), query: route.query['q']})
    })
    onMounted(() => {
      store.dispatch("fetchInfo")
      store.dispatch('fetchPathOrSearch',{path: decodeURI(route.path.substring(1)), query: route.query['q']})
    })
    return{
      isAdrWx,
      type
    }
  }
});
</script>

<style scoped>
.home{
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  justify-content: center;
  padding: 0;
  margin: 0;
}
.home-wx{
  width: 100%;
  display: flex;
  display: -webkit-flex; /* Safari */
  /* justify-content: center; */
  padding: 0;
  margin: 0;
}
.layout{
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: min(980px,98vw);
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