import checkWebUpdate from '@/utils/check_update'
import { backendUrl } from '@/utils/const'
import loadJS from '@/utils/load_js'
import { message } from 'ant-design-vue'
import { createStore } from 'vuex'
import { infoGet, pathPost, searchPost } from '@/utils/api'
import { Md5 } from 'ts-md5/dist/md5'

interface MetaProps {
  code: number;
  msg?: string;
}

interface InfoProps {
  title?: string;
  roots?: string[];
  logo?: string;
  footer_text?: string;
  footer_url?: string;
  music_img?: string;
  check_update?: string;
  script?: string;
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
  password: string;
  sizeStr: string;
  time: string;
  icon: string;
  content_hash: string;
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
  drive: string;
  isImages: boolean;
  showImages: boolean;
  isMultiple: boolean;
}

export default createStore<GlobalDataProps>({
  state: {
    info: {},
    loading: true,
    password: localStorage.getItem('password')||'',
    meta: {
      code: 200,
    },
    data: [],
    type: 'folder',
    audios: [],
    drive: '',
    isImages: false,
    showImages: false,
    isMultiple: localStorage.getItem('isMultiple')==='true',
  },
  mutations: {
    setIsMultiple(state, isMultiple: boolean){
      localStorage.setItem('isMultiple',isMultiple?"true":"false")
      state.isMultiple = isMultiple
    },
    setShowImages(state, showImages){
      state.showImages = showImages
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setPassword(state, password) {
      state.password = password
      localStorage.setItem('password', password)
    },
    setInfo(state, info) {
      state.info = info
    },
    setMeta(state, meta) {
      state.meta = meta
    },
    setDrive(state, drive) {
      state.drive = drive
    },
    setData(state, data) {
      state.isImages = false
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
            const md5 = Md5.hashStr(state.password) as string
            audios.push({
              name: file.name,
              url: backendUrl+'d/'+ encodeURI(file.dir + file.name) +"?pw=" + md5.substring(8, 24),
              cover: state.info.music_img||'https://img.oez.cc/2020/12/19/0f8b57866bdb5.gif'
            })
          }
        }
        state.isImages = files.filter(item => item.category === 'image').length > 0
        state.audios = audios
      }
      state.data = data
    }
  },
  actions: {
    async fetchInfo({state, commit}) {
      const {data} = await infoGet()
      const infoData: InfoProps = data.data
      document.title = infoData.title||'Alist'
      if(infoData.check_update){
        checkWebUpdate()
      }
      if(infoData.script){
        await loadJS(infoData.script)
      }
      if(!infoData.logo){
        infoData.logo = require('../assets/alist.png')
      }
      commit('setInfo',infoData)
    },
    async fetchPathOrSearch({state, commit}, {path, query}){
      commit('setLoading', true)
      if(query){
        const {data} = await searchPost(query, path)
        if(data.code !== 200){
          message.error(data.msg)
        }
        commit('setData',data.data)
      }else{
        const {data} = await pathPost(path, state.password)
        commit('setMeta', data)
        if(data.code !== 200){
          message.error(data.message)
        }
        if(data.code === 401){
          return
        }
        commit('setData',data.data)
      }
      commit('setLoading', false)
    }
  },
  getters: {
  },
  modules: {
  }
})
