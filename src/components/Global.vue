<template>
  <div id="global">
    <MyIcon class="icon" :type="isDark?'icon-Sun':'icon-moon'" @click="change"/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue';
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2594335_ba51zkwh1a4.js',
});

export default defineComponent({
  components: {MyIcon},
  setup() {
    const darkMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = ref<boolean>(!darkMedia.matches)
    const change = () => {
      isDark.value = !isDark.value
      if(isDark.value){
        // document.querySelector('body')?.style.setProperty('--bgColor','#121212')
        document.querySelector('body')?.style.setProperty('--bgColor','#27282b')
        // document.querySelector('body')?.style.setProperty('--textColor','#d9d9d9')
        document.querySelector('body')?.style.setProperty('--textColor','#d9d9d9')
        document.querySelector('body')?.style.setProperty('--bg2Color','#4e4e4e')
        document.querySelector('body')?.style.setProperty('--lineColor','transparent')
      }else{
        document.querySelector('body')?.style.removeProperty('--bgColor')
        document.querySelector('body')?.style.removeProperty('--textColor')
        document.querySelector('body')?.style.removeProperty('--bg2Color')
        document.querySelector('body')?.style.removeProperty('--lineColor')
      }
    }
    darkMedia.onchange = ()=>{
      isDark.value = !darkMedia.matches
      change()
    }
    change()
    return {
      isDark,
      change
    }
  },
})
</script>

<style scoped>
  #global {
    position: fixed;
    top: 50%;
    transform: translate(0, -50%);
    right:5px;
    z-index: 999;
  }
  .icon {
    font-size: 25px;
  }
  /* @media screen and (max-width: 1000px) {
    #global {
      display: none;
    }
  } */
</style>