<template>
	<div class="a_outBox">
		<myHeader></myHeader>
		<div class="a_content">
			<div class="a_hello">
				<div class="ah_left">您好！哈哈哈哈</div>
				<div class="ah_right">
					<span class="ah_time">2019-05-13</span>
					<span class="ah_timeImg"></span>
				</div>
			</div>
			<!--图表-->
			<div class="a_chart">
				<div class="ah_number">
					<div class="num_left">
						<span class="num_img"></span>
						<div class="num_title">
							<span class="num_littleTitle">有派件无签收</span>
							<span class="num_value">3000(票)</span>
						</div>
					</div>
					<div class="num_right">
						<span class="num_img"></span>
						<div class="num_title">
							<span class="num_littleTitle">有派件无签收</span>
							<span class="num_value">3000(票)</span>
						</div>
					</div>
				</div>
				
			</div>
			<!--业务员排名-->
			<div class="a_index">
				<main class="position-box">
					
					
					<!-- 需要一个创建一个父容器 组件高度默认等于父容器的高度 -->
					<vue-better-scroll class="wrapper" ref="scroll" :scrollbar="scrollbarObj" :pullDownRefresh="pullDownRefreshObj" :pullUpLoad="pullUpLoadObj" :startY="parseInt(startY)" @pullingDown="onPullingDown" @pullingUp="onPullingUp">
						<div class="chart_chart">
							<canvas id="mountNode" style="width: 100%;"></canvas>
						</div>
						<div class="chart_update" >
							<span style="display: inline-block;width: 100%;height: 46px;line-height: 46px;text-align: center;border-bottom: 8px solid #F5F5F5;">
								数据跟新于  2019-05-13</span>
						</div>
						<ul class="list-content" style="padding: 0px 16px;">
							<li class="list-item" v-for="(item,index) in items" style="width: 100%;height: 46px;display: flex;justify-content: space-between;align-items: center;">
								<span>{{index+1}}</span>
								<span>{{item.cusname}}</span>
								<span>{{item.count}}</span>
							</li>
						</ul>
					</vue-better-scroll>
				</main>

			</div>
		</div>
	</div>
</template>

<script>
	const F2 = require('@antv/f2');
	let count = 1
	import { Search, List, Cell, PullRefresh, Dialog } from 'vant';
	import myHeader from '@/components/common/header'
	import myCell from '@/components/common/myCell'
	import VueBetterScroll from 'vue2-better-scroll'
	export default {
		components: {
			myHeader,
			myCell,
			VueBetterScroll,
			[Search.name]: Search,
			[List.name]: List,
			[Cell.name]: Cell,
			[PullRefresh.name]: PullRefresh,
			[Dialog.name]: Dialog
		},
		data() {
			return {
				value: '',
				chartdata: [{
					name: '含问题件',
					月份: '有派件无签收',
					月均降雨量: 18.9
				}, {
					name: '含问题件',
					月份: '有到件无签收',
					月均降雨量: 28.8
				}, {
					name: '去问题件',
					月份: '有派件无签收',
					月均降雨量: 12.4
				}, {
					name: '去问题件',
					月份: '有到件无签收',
					月均降雨量: 23.2
				}],

				//List相关
				list: [],
				loading: false,
				finished: false,

				//下拉刷新相关
				count: 0,
				isLoading: false,

				paiming: [],
				current: [],

				// 这个配置可以开启滚动条，默认为 false。当设置为 true 或者是一个 Object 的时候，都会开启滚动条，默认是会 fade 的
				scrollbarObj: {
					fade: true
				},
				// 这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop）
				pullDownRefreshObj: {
					threshold: 20,
					stop: 40
				},
				// 这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机
				pullUpLoadObj: {
					threshold: 30,
					txt: {
						more: '加载更多',
						noMore: '没有更多数据了'
					}
				},
				startY: 0, // 纵轴方向初始化位置
				scrollToX: 0,
				scrollToY: 0,
				scrollToTime: 700,
				items: []
			}
		},
		mounted() {
//			let wh = document.body.clientHeight
//			let th = document.querySelector('.header').clientHeight
//			let cur = (wh - th - 240) + 'px'
//			console.log(wh, th)
//			console.log(cur)
			//			document.querySelector(".a_content").style.height = cur

			this.drawChart()

			this.onPullingDown()
		},
		created() {},

		methods: {
			// 滚动到页面顶部
			scrollTo() {
				this.$refs.scroll.scrollTo(this.scrollToX, this.scrollToY, this.scrollToTime)
			},
			// 模拟数据请求
			getData() {
				this.paiming=[{
					"cusname":"张三",
					"count":147
				}]
//				return new Promise(resolve => {
//					setTimeout(() => {
//						const arr = []
//						for(let i = 0; i < 10; i++) {
//							arr.push(count++)
//						}
//						resolve(arr)
//					}, 1000)
//				})
//				this.$function.requestHttpMethods('face-jn/sign/stats/unsigned-arrive/emp-list?site=陕西澄城县公司&date=2019-01-21'+'&pageNo='+this.pageNo, {
//					params: {}
//				}, 'get').then((res) => {
//					console.log(res,'业务员排名')
//					if(res.respCode==='000'){
//						if(res.data.data.length>0){
//							this.totalNum=res.data.total
//							for(let i=0;i<res.data.data.length;i++){
//								this.items.push(res.data.data[i])
//							}
//							
//							
//						}
//					}else{
//						Dialog.alert({
//							message: res.resMessage
//						}).then(() => {});
//					}
//				})
				
			},
			onPullingDown() {
				// 模拟下拉刷新
				console.log('下拉刷新')
//				count = 0
//				this.getData().then(res => {
//					this.items = res
//					this.$refs.scroll.forceUpdate(true)
//				})


				this.pageNo=1
				this.items=[]
				this.getData()
				this.$refs.scroll.forceUpdate(true)
			},
			onPullingUp() {
				// 模拟上拉 加载更多数据
				console.log('上拉加载')
//				this.getData().then(res => {
//					this.items = this.items.concat(res)
//					if(count < 30) {
//						this.$refs.scroll.forceUpdate(true)
//					} else {
//						//此时已经没有更多的数据
//						this.$refs.scroll.forceUpdate(false)
//					}
//				})
				this.pageNo=this.pageNo+1
				this.getData()
				if(this.items.length<this.totalNum){
					this.$refs.scroll.forceUpdate(true)
				}else{
					this.$refs.scroll.forceUpdate(false)
				}



			},

			onLoad() {
				// 异步更新数据
				setTimeout(() => {
					for(let i = 0; i < this.paiming.length; i++) {
						if(i < 5) {
							this.current.push(this.paiming[i])
						} else {

						}

					}
					// 加载状态结束
					this.loading = false;

					// 数据全部加载完成
					if(this.current.length >= this.paiming.length) {
						this.finished = true;
					}
				}, 1000);
			},

			//下拉刷新
			onRefresh() {
				setTimeout(() => {
					console.log('刷新成功');
					this.isLoading = false;
					this.count++;
				}, 500);
			},

			drawChart() {
				var chart = new F2.Chart({
					id: 'mountNode',
					height: 280,
					pixelRatio: window.devicePixelRatio
				});
				chart.source(this.chartdata);
				chart.legend({
					marker: {
						symbol: 'square', // marker 的形状
						radius: 5 // 半径大小
					}
				});
				chart.tooltip({
					showItemMarker: true,
					nameStyle: {
						fontSize: 14,
					}, // tooltip name 项的文本样式配置
					valueStyle: {
						fontSize: 14,
					},
				});
				chart.axis('月份', {
					label: function label(text, index, total) {
						var textCfg = {
							fontSize: 12
						};
						return textCfg;
					}
				});
				chart.axis('月均降雨量', {
					label: function label(text, index, total) {
						var textCfg = {
							fontSize: 12
						};
						return textCfg;
					}
				});

				chart.interval().position('月份*月均降雨量').color('name', ['#FF5B5B', '#1FCCAD']).size(50).shape('text').adjust({
					type: 'dodge',
					marginRatio: 0.8 // 设置分组间柱子的间距
				});
				chart.render();
			}
		},

	}
</script>

<style lang="scss" scoped>
	.position-box {
		position: fixed;
		top: 178px;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.header{
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 99999;
	}
	.a_content{
		position: absolute;
		top: 46px;
		left: 0px;
		z-index: 99999;
	}
</style>