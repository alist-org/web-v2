import { SmileOutlined } from "@ant-design/icons-vue"
import { notification } from "ant-design-vue"
import { h } from "vue"
import { getWebLatest } from "./api"
import { VERSION } from "./const"
import { versionStringCompare } from "./version_compare"

const checkWebUpdate = () => {
  getWebLatest().then(res=>{
    const lasted=res.data.tag_name.substring(1)
    const now=VERSION.substring(1)
    if(versionStringCompare(lasted,now)==1){
      notification.open({
        message: '发现新版本',
        description:
          '前端新版本:'+res.data.tag_name+', 请至'+res.data.html_url+'获取新版本',
        icon: h(SmileOutlined,{style: 'color: #1890ff'}),
      });
    }else{
      //已经是最新版本
      console.log(VERSION)
    }
  })
}

export default checkWebUpdate