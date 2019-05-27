import store from "./store.js"
//import * as types from './mutations-types'
import $functions from '../functions/function.js'
const F2 = require('@antv/f2');
const mutations = {
	setHomeListTop(state,top){
      state.top=top;
	},

	
	
	/*记录登录信息*/
  	saveLogininfo(state,obj){
    	state.userinfo=obj;
  	},
  	//登录信息中的组织信息
  	saveLoginOrig(state,obj){
  		state.organizeInfo=obj
  	},
  	//保存日期信息
  	dateInfo(state,obj){
  		state.dateInfo=obj;
//		console.log(obj)
  	},
  	
  	//保存更新时间{}
  	saveUpdateTime(state,obj){
  		state.saveTime=obj;
  		console.log(obj)
  	},
  	//保存更改过后的时间
  	saveCurrentTime(state,obj){
  		state.currentTime=obj
  	},
  	//保存搜索框中的值
  	getSelectValue(state,obj){
  		state.getSelectValue=obj
  	},
  	
  	
  	
	//屏幕高度自适应
	_getHeight(state,obj){
		let wh = document.body.clientHeight;
		let dh = document.querySelector(".header_box").clientHeight;
		let bh = document.querySelector(".banner").clientHeight;
		let th = document.querySelector(".date").clientHeight;
		let wwh = (wh - dh - bh - th) + 'px'
		document.querySelector(".bscroll").style.height = wwh;
	},
	//第一饼图
	_pieOne(state,obj){},
	
	//收
	receiveData(state,obj){
		state.receiveData=obj
	},
	receive(state,obj){
		state.receive=obj
	},
	
	//付
	payData(state,obj){
		state.payData=obj
	},
	pay(state,obj){
		state.pay=obj
	},
	
	
}

export default mutations