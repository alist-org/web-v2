import { backendUrl } from '@/utils/const'
import { message } from 'ant-design-vue'
import { createStore } from 'vuex'
import { infoGet, pathPost, searchPost, rebuildGet } from '../utils/api'

interface MetaProps {
  code: number;
  msg?: string;
}

interface RespProps<P> {
  meta: MetaProps;
  data: P;
}

export interface ListProps<P> {
  [index: number]: P;
}

interface InfoProps {
  title?: string;
  logo?: string;
  footer_text?: string;
  footer_url?: string;
  music_img?: string;
  check_update?: string;
  scrip?: string;
  autoplay?: boolean;
  preview?: {
    url: string;
    pre_process: string[];
    extensions: string[];
    text: string[];
    max_size: number;
  };
}

export interface FileProps {
  dir: string;
  file_extension: string;
  file_id: string;
  name: string;
  type: string;
  updated_at: string;
  category: string;
  content_type: string;
  size: number;
  password: "";
  sizeStr: string;
  time: string;
  icon: string;
}

interface Audio {
  name: string;
  url: string;
  cover: string;
}

export interface GlobalDataProps {
  loading: boolean;
  info: InfoProps;
  password: string;
  meta: MetaProps;
  data: FileProps|FileProps[];
  type: string;
  audios: Audio[];
}

export default createStore<GlobalDataProps>({
  state: {
    info: {},
    loading: true,
    password: "",
    meta: {
      code: 200,
    },
    data: [],
    type: 'folder',
    audios: [],
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading
    },
    setPassword(state, password) {
      state.password = password
    },
    setInfo(state, info) {
      state.info = info
    },
    setMeta(state, meta) {
      state.meta = meta
    },
    setData(state, data) {
      if(!data) {
        state.type = 'no'
        state.data = []
        return
      }
      if(data.type){
        state.type = 'file'
      }else{
        state.type = 'folder'
        const audios: Audio[] = []
        const files = data as FileProps[]
        for(const file of files){
          if(file.category === 'audio'){
            audios.push({
              name: file.name,
              url: backendUrl+'d/'+file.dir+file.name,
              cover: state.info.music_img||'https://img.oez.cc/2020/12/19/0f8b57866bdb5.gif'
            })
          }
        }
        state.audios = audios
      }
      state.data = data
    }
  },
  actions: {
    async fetchInfo({state, commit}) {
      const {data} = await infoGet()
      const infoData: InfoProps = data.data
      if(!infoData.logo){
        infoData.logo = require('../assets/alist.png')
      }
      commit('setInfo',infoData)
    },
    async fetchPathOrSearch({state, commit}, {path, query}){
      if(query){
        const {data} = await searchPost(query, path)
        const {meta} =data
        if(meta.code !== 200){
          message.error(meta.msg)
        }
        commit('setData',data.data)
      }else{
        const {data} = await pathPost(path, state.password)
        const {meta} =data
        if(meta.code !== 200){
          message.error(meta.msg)
        }
        if(meta.code === 401){
          console.log('')
        }
        commit('setData',data.data)
      }
    }
  },
  getters: {
  },
  modules: {
  }
})
