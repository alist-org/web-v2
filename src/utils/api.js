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

