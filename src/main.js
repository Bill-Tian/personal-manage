/*
 * @Author: Mr.Tian
 * @Date: 2021-12-09 11:55:35
 * @LastEditTime: 2021-12-16 10:05:49
 * @LastEditors: Mr.Tian
 * @Description: 
 */
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'

import 'github-markdown-css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)
installElementPlus(app)
app
    .use(store)
    .use(router)
    .use(mavonEditor)
    .mount('#app')