<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <global/>
      <router-view/>
    </div>
  </a-config-provider>

</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import Global from './components/Global.vue';
export default {
  components: { Global },
  data() {
    return {
      locale: zhCN,
    };
  },
};
</script>