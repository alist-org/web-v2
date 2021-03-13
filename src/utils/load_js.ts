const loadJS = (content: string) => {
  return new Promise<void>((resolve,reject)=>{
    const script = document.createElement('script')
    script.type = "text/javascript"
    script.onload = ()=>{
      resolve()
    }
    script.onerror = ()=>{
      reject()
    }
    if(/^(http|https):\/\/([\w.]+\/?)\S*/.test(content)){
      script.src=content
    }else{
      script.text= content
    }
    document.querySelector('body')!.appendChild(script)
  })
}

export default loadJS