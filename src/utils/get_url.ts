export const getUrl=(fullUrl: string)=>{
  if(!fullUrl){
      fullUrl=window.location.href
  }
  const urlArr=fullUrl.split('/')
  return urlArr.slice(0,3).join('/')+'/'
}