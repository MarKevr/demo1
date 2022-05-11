import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Roles from '../components/jurisdiction/Roles'
import Rights from '../components/jurisdiction/Rights'
import Cate from '../components/Commodity/Cate'
import ProducList from '../components/Commodity/ProducLlist'
import GoodsList from '../components/Commodity/goods_list'
import Add from '../components/Commodity/Add'
import Order from '../components/order/Order'
import Report from '../components/report/Report'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children:
      [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/categories', component: Cate },
        { path: '/params', component: ProducList },
        { path: '/goods', component: GoodsList },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '//reports', component: Report }
      ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
