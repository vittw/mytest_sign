<template>
	<div class="outer_cell" @touchstart='touchstart' @touchend='touchend' @click="cellClick">
		<div class="left">
			<slot name="leftInfor">
				
			</slot>
		</div>
		<div class="right" v-if="isExit">
			<van-icon name="arrow" />
		</div>
	</div>
</template>

<script>
	import { Popup, DatetimePicker, Search, Dialog,Cell,Tag,Icon } from 'vant';
	import { addClass, removeClass } from '@/functions/dom';
	export default{
		components:{
			addClass,
			removeClass,
			[Search.name]: Search,
			[Popup.name]: Popup,
			[Dialog.name]: Dialog,
			[DatetimePicker.name]: DatetimePicker,
//			[Toast.name]: Toast,
			[Cell.name]:Cell,
			[Tag.name]:Tag,
			[Icon.name]:Icon
		},
		props:{
			isExit:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				
			}
		},
		methods:{
			touchstart(ev) {
				addClass(ev.currentTarget, 'icon_on')
			},
			touchend(ev) {
				removeClass(ev.currentTarget, 'icon_on')
			},
			cellClick(){
				this.$emit('cellClick')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.outer_cell{
		width: 100%;
		height: 47px;
		border-bottom: 1px solid #E8E8E8;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 16px;
		font-size: 12px;
		box-sizing: border-box;
		.left{
			width: 100%;
			height: 47px;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			span{
				display: flex;
				justify-content: flex-start;
				align-items: center;
				font-size: 12px;
			}
		}
		.right{
			.van-icon{
				color: #CCCCCC;
			}
		}
	}
	.outer_cell .left span:nth-child(1){
		width: 20%;
	}
	.outer_cell .left span:nth-child(2){
		width: 30%;
	}
	.outer_cell .left span:nth-child(3){
		width: 50%;
	}
	.van-icon{
	/*//  background-color: #F6F6F6;*/
	    font-size: 12px !important;
	}
	
</style>