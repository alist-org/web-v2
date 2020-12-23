import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/ant_design'

// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
