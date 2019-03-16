import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

import 'common/sass/index.scss'

Vue.config.productionTip = false

Vue.use(VueRouter)

const routes = [
  {
    path: '/goods',
    // component: () => import('@/components/goods/goods')
    component: goods
  },
  {
    path: '/ratings',
    // component: () => import('@/components/ratings/ratings')
    component: ratings
  },
  {
    path: '/seller',
    // component: () => import('@/components/seller/seller')
    component: seller
  },
  {
    path: '/',
    component: goods
  }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  }).$mount('#app')
