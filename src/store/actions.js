import store from "./store.js"
//import * as types from './mutations-types'
const actions = {
	
	//图表的绘制
	_pieOne(store,data){
		store.commit("_pieOne",data)
		console.log(data)
	},
	//屏幕高度自适应
	_getHeight(store){
		store.commit('_getHeight')
	},
	
	setListTop(store,top){
    	store.commit('setHomeListTop',top);
	}

	
}
export default actions
