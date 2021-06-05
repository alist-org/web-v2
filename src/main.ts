import { createApp } from 'vue'
import {
  Button, Divider, Tag, Card, Breadcrumb, Table, Modal, Input, Result, Spin, Popover, Space,
  Switch
} from 'ant-design-vue'
import {
  QrcodeOutlined, HomeOutlined, WindowsFilled,
  FileExcelFilled, FileMarkdownFilled, FilePdfFilled,
  FilePptFilled, FileWordFilled, FileZipFilled,
  AndroidFilled, AppleFilled, FileImageFilled,
  FileTextFilled, YoutubeFilled, CustomerServiceFilled,
  FileFilled, FolderFilled, 
  CopyOutlined, DownloadOutlined, RetweetOutlined
} from '@ant-design/icons-vue'
import 'ant-design-vue/dist/antd.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
// import '@kangc/v-md-editor/lib/theme/style/github.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import './assets/global.css'
import App from './App.vue'
import router from './router'
import store from './store'

import contextmenu from 'vue3-contextmenu'
import 'vue3-contextmenu/dist/vue3-contextmenu.css'

const app = createApp(App)

app.use(contextmenu)

// VMdPreview.use(githubTheme)
VMdPreview.use(vuepressTheme)
app.use(VMdPreview)

app.use(Button)
app.use(Divider)
app.use(Tag)
app.use(Card)
app.use(Breadcrumb)
app.use(Table)
app.use(Modal)
app.use(Input)
app.use(Result)
app.use(Spin)
app.use(Popover)
app.use(Space)
app.use(Switch)
app.component('qr-code', QrcodeOutlined)
app.component('home', HomeOutlined)
app.component('windows', WindowsFilled)
app.component('file-excel', FileExcelFilled)
app.component('file-markdown', FileMarkdownFilled)
app.component('file-pdf', FilePdfFilled)
app.component('file-ppt', FilePptFilled)
app.component('file-word', FileWordFilled)
app.component('file-zip', FileZipFilled)
app.component('android', AndroidFilled)
app.component('apple', AppleFilled)
app.component('file-image', FileImageFilled)
app.component('file-text', FileTextFilled)
app.component('youtube', YoutubeFilled)
app.component('customer-service', CustomerServiceFilled)
app.component('file', FileFilled)
app.component('folder', FolderFilled)
app.component('copy', CopyOutlined)
app.component('download', DownloadOutlined)
app.component('retweet', RetweetOutlined)

app.use(store).use(router)
app.mount('#app')
