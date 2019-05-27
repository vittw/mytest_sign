import Vue from 'vue'
import Vuex from 'vuex'

// 根状态管理
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

// Vuex 自带日志插件
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

let store=new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
export default store