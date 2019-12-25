import Vue from 'vue'
import VueRouter from 'vue-router'
import Chat from '@/views/Chat.vue'
import Specialist from '@/views/Specialist.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/Chat/:loginPhone/:targetPhone',
    name: 'chat',
    meta:{
    	title:''
    },
    component: Chat
  },
  {
  	path: '/',
    name: 'Specialist',
    meta:{
    	title:'顾问列表'
    },
    component: Specialist
  }
]

const router = new VueRouter({
  routes
})

export default router
