<template>
  <div class="path">
    <router-link :to="'/'+routes[0].path">
      <home style="margin-right: 10px;"/>
    </router-link>
    <a-breadcrumb :routes="routes">
      <template #itemRender="{ route, routes, paths }">
        <span v-if="routes.indexOf(route) === 0" :to="`/${paths.join('/')}`">
          <!-- <home style="margin-right: 1px;"/> -->
          {{ route.breadcrumbName }}
        </span>
        <router-link v-else-if="routes[0].children.indexOf(route) !== -1" :to="`/${paths[1]}`">
          {{ route.breadcrumbName }}
        </router-link>
        <span v-else-if="!q&&routes.indexOf(route) === routes.length - 1">
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
import store from '@/store'
import {computed, defineComponent} from 'vue'
import {useRoute} from 'vue-router'

interface Route {
  path: string;
  breadcrumbName: string;
  children?: Array<{
    path: string;
    breadcrumbName: string;
  }>;
}

export default defineComponent({
  name: 'Path',
  setup() {
    const route = useRoute()
    const q = computed(() => route.query.q)
    const routes = computed(() => {
      const paths = route.params.path as string[]
      if(!paths){
        return[{path: '/', breadcrumbName: 'home'}]
      }
      const res: Route[] = paths.map(item => {
        return{
          path: item,
          breadcrumbName: item
        }
      })
      res[0].children = store.state.info.roots?.map(item => {
        return {
          path: item,
          breadcrumbName: item
        }
      }) || []
      return res
    })
    return {
      routes,
      q,
      route
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
  align-items: center;
}
</style>
