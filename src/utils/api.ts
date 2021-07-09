import axios from 'axios'
import request from './request'

export const getPost = (path: string, password: string) => {
  return request({
    url: "get",
    method: "post",
    data: {
      path: path,
      password: password
    }
  })
}

export const pathPost = (path: string, password: string) => {
  return request({
    url: "path",
    method: "post",
    data: {
      path: path,
      password: password
    }
  })
}

export const searchPost = (keyword: string, dir: string) => {
  return request({
    url: "local_search",
    method: "post",
    data: {
      keyword: keyword,
      dir: dir
    }
  })
}

export const infoGet = () => {
  return request({
    url: "info",
    method: "get",
  })
}

export const rebuildPost = (path, password: string, depth) => {
  return request({
    url: `rebuild`,
    method: "post",
    data: {
      path: path,
      password: password,
      depth: parseInt(depth),
    }
  })
}

export const officePreviewPost = (drive, fileId: string) => {
  return request({
    url: `office_preview/${drive}`,
    method: "post",
    data: {
      'file_id': fileId
    }
  })
}

export const videoPreviewPost = (drive, fileId: string) => {
  return request({
    url: `video_preview/${drive}`,
    method: "post",
    data: {
      'file_id': fileId
    }
  })
}

export const videoPreviewPlayInfoPost = (drive, fileId: string) => {
  return request({
    url: `video_preview_play_info/${drive}`,
    method: "post",
    data: {
      'file_id': fileId
    }
  })
}

export const getWebLatest = () => {
  return axios.get('https://api.github.com/repos/Xhofe/alist-web/releases/latest')
}

export const getBackLatest = () => {
  return axios.get('https://api.github.com/repos/Xhofe/alist/releases/latest')
}

export const getText = (url: string) => {
  return axios.get(url)
}