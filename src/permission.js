import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 不重定向的白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })   //  没登录就重定向到主页‘/’
      NProgress.done() // HACK: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      //
      const hasRoles = store.getters.roles && store.getters.roles.length > 0    // 通过用户角色信息决定是否有权限进入
      if (hasRoles) {
        next()
      } else {          // 没有就尝试获取
        try {
          // note: roles必须是数组， such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')  // 获取用户信息
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)   //  基于roles动态生成路由map

          router.addRoutes(accessRoutes)    // 动态添加数组

          // NOTE:  router.addRoutes之后的next()可能会失效，因为可能next()的时候路由并没有完全add完成，可通过在next(option)中重新定向引发beforeEach再次运行
          // 参考：https://juejin.cn/post/6844903478880370701#heading-8

          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {      //  没有token
    if (whiteList.indexOf(to.path) !== -1) {  // 在白名单就不用进行login
      next()
    } else {
      next(`/login?redirect=${to.path}`)       // 不在白名单就要进行login
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
