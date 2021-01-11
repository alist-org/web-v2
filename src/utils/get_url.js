export const getUrl=(full_url)=>{
    if(!full_url){
        full_url=window.location.href
    }
    let url_arr=full_url.split('/')
    return url_arr.slice(0,3).join('/')
}