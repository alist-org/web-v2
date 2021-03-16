<template>
  <div class="path">
    <home style="margin-right: 10px;"/>
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes, paths }">
        <span v-if="!q&&routes.indexOf(route) === routes.length - 1">
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else :to="`/${paths.join('/')}`">
          {{ route.breadcrumbName }}
        </router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'Path',
  setup() {
    const route = useRoute()
    const q = computed(() => route.query.q)
    const routes = computed(() => {
      const paths = route.params.path as string[]
      if(!paths){
        return[]
      }
      return paths.map(item => {
        return{
          path: item,
          breadcrumbName: item
        }
      })
    })
    return {
      routes,
      q
    }
  },
})
</script>

<style scoped>
.path{
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); */
  margin: 2px 2px;
  padding: 2px;
  display: flex;
  display: -webkit-flex; 
  font-size: 20px;
}
</style>
