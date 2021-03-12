import { GlobalDataProps } from "@/store"
import { useRoute } from "vue-router"
import { useStore } from "vuex"

function useRefresh() {
  const store = useStore<GlobalDataProps>()
  const route = useRoute()
  const refresh = () => {
    store.dispatch('fetchPathOrSearch',{path: decodeURI(route.path.substring(1)), query: route.query['q']})
  }
  return {
    refresh
  }
}

export default useRefresh