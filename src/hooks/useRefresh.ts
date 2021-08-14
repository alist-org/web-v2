import { GlobalDataProps } from "@/store";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

function useRefresh() {
  const store = useStore<GlobalDataProps>();
  const route = useRoute();
  const refresh = () => {
    const paths = route.params.path as string[];
    if (paths) {
      store.commit("setDrive", paths[0]);
    }
    store.dispatch("fetchPathOrSearch", {
      path: decodeURI(route.fullPath.substring(1)).split('?')[0],
      query: route.query["q"],
    });
  };
  return {
    refresh,
  };
}

export default useRefresh;
