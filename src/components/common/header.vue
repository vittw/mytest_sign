<template>
	<div class="header">
		<!--<div class="left" @click="leftClick">
			<span class="back" v-if="backState"></span>
			<span class="close" v-else></span>
		</div>
		<div class="title">
			{{common_title}}
		</div>
		<div v-if="rigState" class="right" @click="rightClick"></div>-->
		<van-nav-bar
		  :title="common_title"
		  @click-left="onClickLeft"
		  @click-right="onClickRight"
		>
			<div slot="left">
				<span class="back" v-if="backState"></span>
				<span class="close" v-else></span>
			</div>
			<div slot="right" v-if="rigState" class="right" @click="rightClick">
				<span class="search"></span>
			</div>
			
		</van-nav-bar>
	</div>
</template>

<script>
	import { NavBar,Icon } from 'vant';
	import { addClass, removeClass } from '@/functions/dom'
	export default{
		components:{
			addClass, removeClass,
			[NavBar.name]:NavBar,
			[Icon.name]:Icon
		},
		props:{
			//默认显示返回的箭头
			backState:{
				type:Boolean,
				default:true
			},
			//默认不显示最右边的搜索按钮
			rigState:{
				type:Boolean,
				default:false
			},
			common_title:{
				type:String,
				default:'标题'
			},
		},
		data(){
			return{
				
			}
		},
		created(){},
		methods:{
			onClickLeft() {
		      alert('返回');
		    },
		    onClickRight() {
		      alert('按钮');
		    },
			
			
			leftClick(ev){
				addClass(ev.currentTarget, 'icon_on')
				if(this.backState){
					this.$router.go(-1)
					console.log('返回')
				}else{
					console.log('关闭')
					this.$bridge.callHandler(
			          'finishBridge'
			          ,''
			        )
				}
			},
			rightClick(ev){
//				addClass(ev.currentTarget, 'icon_on')
				this.$emit('click_serach')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.icon_on{
		background-color: #F6F6F6;
	}
</style>