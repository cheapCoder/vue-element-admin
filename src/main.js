import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import Cookies from 'js-cookie' //  轻巧的处理cookie的js库  https://github.com/js-cookie/js-cookie#basic-usage

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import './styles/element-variables.scss'
import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import './icons' // icon
import './permission' // 权限控制
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * 生产环境会用MockJs，项目上线后请移除
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')

  mockXHR()    // TODO:什么功能？
}

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',  // 设置elementUI的默认大小
  locale: enLang // 如果使用中文，无需设置，请删除
})

Object.keys(filters).forEach(key => {     // 遍历注册全局过滤器
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
