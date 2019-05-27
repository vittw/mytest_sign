// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'babel-polyfill'
import FastClick from 'fastclick'
import VueLazyload from 'vue-lazyload'
//import './assets/css/base.styl'
//import './assets/css/var.scss'
//import './assets/css/reset.styl'

import './assets/css/reset.scss'

//import './assets/css/myStyl.styl'
//import Vant from 'vant';
//Vue.use(Vant)
import 'vant/lib/index.css';
import '@/assets/css/common.scss';
import Functions from './functions/function.js'
import Surl from './api/surAll.js'
import './rem/rem'

import { Toast } from 'vant';
Vue.use(Toast);

import axios from 'axios'
Vue.prototype.$http = axios
Vue.prototype.$function=Functions;
Vue.prototype.$url=Surl;
Vue.config.productionTip = false

FastClick.attach(document.body)

import store from './store/store'
import JsBridg from '@/functions/bridge'
//import vConsole from '@/functions/vconsole'
Vue.prototype.$store = store
Vue.prototype.$bridge = JsBridg

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
