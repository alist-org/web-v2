<template>
  <div class="readme" v-show="readme!==undefined">
    <a-spin :spinning="readmeSpinning">
      <a-card title="Readme.md" style="width: 100%" size="small">
        <v-md-preview :text="readmeValue"></v-md-preview>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { FileProps, GlobalDataProps } from "@/store";
import { useStore } from "vuex";
import { computed, defineComponent, ref, watch } from "vue";
import { getPost, getText } from "@/utils/api";

export default defineComponent({
  name: 'Readme',
  setup() {
    const store = useStore<GlobalDataProps>()
    const type = computed(() => store.state.type)
    const readmeSpinning = ref<boolean>(true)
    const readmeValue = ref<string>('')
    const refreshReadme = (readmeFile: FileProps|undefined) => {
      if(readmeFile!==undefined){
        getPost(readmeFile.dir+readmeFile.name, store.state.password).then(resp=>{
          const res = resp.data
          if(res.code===200){
            getText(res.data.url).then(resp=>{
              readmeValue.value=resp.data
              readmeSpinning.value=false
            })
          }
        })
      }
    }
    const readme = computed(()=>{
      const file = store.state.data as FileProps
      if(file.type){
        return undefined
      }
      const files = store.state.data as FileProps[]
      const readmeFile = files.find(item => item.name.toLowerCase() === 'readme.md')
      refreshReadme(readmeFile)
      return readmeFile
    })
    return{
      type,
      readme,
      readmeValue,
      readmeSpinning,
    }
  },
});
</script>

<style scoped>

</style>
