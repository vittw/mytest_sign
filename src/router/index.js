import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

//承包区
//import A_main from '@/components/area/a_main'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path:'/A_main',
  		name:'A_main',
//		conponent:A_main
  		component:resolve=>require(['@/components/area/a_main'],resolve)
  	}
    
  ]
})
