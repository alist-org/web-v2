import axios from 'axios'
import request from './request'

export const list = (parent_file_id,password)=>{
    return request({
        url:"list",
        method:"post",
        data:{
            parent_file_id:parent_file_id,
            password:password
        }
    })
}

export const get = (file_id) =>{
    return request({
        url:"get",
        method:"post",
        data:{
            file_id:file_id
        }
    })
}

export const search = (query) =>{
    return request({
        url:"search",
        method:"post",
        data:{
            query:query
        }
    })
}

export const info = () =>{
    return request({
        url:"info",
        method:"get",
    })
}

export const office_preview = (file_id) =>{
    return request({
        url:"office_preview",
        method:"post",
        data:{
            file_id:file_id
        }
    })
}

export const getWebLatest = ()=>{
    return axios.get('https://api.github.com/repos/Xhofe/alist-web/releases/latest')
}

export const getBackLatest = ()=>{
    return axios.get('https://api.github.com/repos/Xhofe/alist/releases/latest')
}

export const getText = (url)=>{
    return axios.get(url)
}