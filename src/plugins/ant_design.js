import Vue from 'vue'
// import 'ant-design-vue/dist/antd.css'

// import Button from 'ant-design-vue/lib/button'

import {
    Button,Divider,Tag,Card,Breadcrumb,Table,message,Icon,Modal,Input,Result,Spin
} from 'ant-design-vue';

// Vue.component(Button.name, Button);
Vue.use(Button)
Vue.use(Divider)
Vue.use(Tag)
Vue.use(Card)
Vue.use(Breadcrumb)
Vue.use(Table)
Vue.use(Icon)
Vue.use(Modal)
Vue.use(Input)
Vue.use(Result)
Vue.use(Spin)
Vue.prototype.$msg=message