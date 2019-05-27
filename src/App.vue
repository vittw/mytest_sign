<template>
	<div id="app">
		<!-- <img src="./assets/logo.png"> -->
		<router-view></router-view>
	</div>
</template>

<script>
	import store from './store/store.js'
	import { mapMutations } from 'vuex'
	import { Dialog } from 'vant';
	export default {
		name: 'App',
		data(){
			return{
//				show:false,
//				show:true
			}
		},
		components:{
			[Dialog.name]:Dialog
		},
		created() {
			document.body.removeChild(document.getElementById('Loading'))
			//保存登录信息
			this.$bridge.callHandler(
				'submitFromWeb', '', (responseData) => {
					let data1 = JSON.parse(responseData)
					
					this.$store.commit('saveLogininfo', data1.loginResp.employee)
					this.$store.commit('saveLoginOrig', data1.loginResp.organize)
//					this.show=true
					
					
				}
			)
		},
		mounted(){
			if(store.state.userinfo.companyCategoryCode=='独立网点'){//网点
				this.$router.push({
					name:'D_main',
				})
			}else if(store.state.userinfo.companyCategoryCode=='总公司'||store.state.userinfo.companyCategoryCode=='部门'){//总部
				this.$router.push({
					name: 'Z_main'
				})
				
			}else if(store.state.userinfo.companyCategoryCode=='管理区'&&store.state.userinfo.companyName.search("片区")==-1){//省区
				this.$router.push({
					name: 'P_main'
				})
			}else if(store.state.userinfo.companyCategoryCode=='管理区'&&store.state.userinfo.companyName.search("片区")!=-1){
				Dialog.alert({
				  message: '当前登录账号为片区，暂时不支持此类账号查看'
				}).then(() => {
				  this.$bridge.callHandler(
			          'finishBridge'
			          ,''
			        )
				});
			}else if(store.state.userinfo.companyCategoryCode=='承包区'){//承包区
				this.$router.push({
					name: 'A_main'
				})
			}else{
				this.$bridge.callHandler(
		          'finishBridge'
		          ,''
		        )
			}
		},
		computed: {
		    ...mapMutations([
		      'saveLogininfo'
		    ])
		},
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		background-color: #FFFFFF;
		/*margin-top: 60px;*/
		width: 100%;
	}
</style>
