import { useContext } from "react";
import { IContext } from "../pages/list";
import { md5_16 } from "../utils/md5";

export const useEncrypt = ()=>{
  const {getSetting,password} = useContext(IContext);
  return (url:string)=>{
    if(getSetting('check down link')!=="true" || password===''){
      return url;
    }
    const name = url.split('/').pop();
    return `${url}?pw=${md5_16("alist"+password+name)}`;
  }
}