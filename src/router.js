import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import * as Application from '@/components/application'
Vue.use(Router)

const routers = new Router({

  routes: [{
    path: '/',
    redirect: '/application'
  }, {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/application',
    component: Application.app,
    name: 'application',
    children: Application.router
  }]
})

routers.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
    return
  }

  const token = sessionStorage.getItem('token')
  if (token) {
    // 登录
    next()
  } else {
    // 没有登录
    next('/login')
  }
})

export default routers
