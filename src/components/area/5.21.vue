<template>
	<div class="a_outBox">
		<myHeader></myHeader>
		<div class="a_content">
			<div class="a_hello">
				<div class="ah_left">您好！申通快递</div>
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
				<div class="chart_chart">
					<canvas id="mountNode"></canvas>
				</div>
				<div class="chart_update">
					<span>数据跟新于  2019-05-13</span>
				</div>
			</div>
			<!--业务员排名-->
			<div class="a_index">
				<!--<div class="ai_chartTitle">
					<span>排序</span>
					<span>业务员名称</span>
					<span>有派无签票数(去问题件)</span>
				</div>-->
				<van-cell value="有派无签票数(去问题件)">
				  <template slot="title">
				    <span class="custom-text" >排序</span>
				    <span style="margin-left: 36px;">业务员名称</span>
				    <!--<van-tag type="danger">标签</van-tag>-->
				  </template>
				</van-cell>
				
				<van-search placeholder="请输入搜索关键词" v-model="value" />
				
				<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
  				<!--<p>刷新次数: {{ count }}</p>-->

				<van-list
				  v-model="loading"
				  :finished="finished"
				  finished-text="没有更多数据了"
				  loading-text="正在加载中。。。"
				  @load="onLoad"
				>
				  <!--<van-cell
				    v-for="item in list"
				    :key="item"
				    :title="item"
				  />-->
					<!--<myCell isExit v-for="(item,index) in current" :key="index" @cellClick="cellClick(item)">
						<template slot="leftInfor">
							<span>{{index+1}}</span>
							<span>{{item.name}}</span>
							<span>{{item.value}}</span>
						</template>
					</myCell>-->
					
					<van-cell v-for="(item,index) in current" :key="index" :value="item.value" is-link>
					  <template slot="title">
					    <span class="custom-text" >{{index+1}}</span>
					    <span style="margin-left: 46px;">{{item.name}}</span>
					    <!--<van-tag type="danger">标签</van-tag>-->
					  </template>
					</van-cell>
				</van-list>
				</van-pull-refresh>
			</div>
		</div>
	</div>
</template>

<script>
	const F2 = require('@antv/f2');
	import { Search,List,Cell,PullRefresh   } from 'vant';
	import myHeader from '@/components/common/header'
	import myCell from '@/components/common/myCell'
	import VueBetterScroll from 'vue2-better-scroll'
	export default {
		components: {
			myHeader,myCell,VueBetterScroll,
			[Search.name]:Search,
			[List.name]:List,
			[Cell.name]:Cell,
			[PullRefresh.name]:PullRefresh
		},
		data() {
			return {
				value:'',
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
      			
      			
			    paiming:[
					{name:'张三',value:'123456'},
					{name:'张三2',value:'123456'},
					{name:'张三3',value:'123456'},
					{name:'张三4',value:'123456'},
					{name:'张三4',value:'123456'},
					{name:'张三4',value:'123456'},
					{name:'张三4',value:'123456'},
					{name:'张三4',value:'123456'},
					{name:'张三4',value:'123456'},
					{name:'张三5',value:'123456'}
				],
				current:[]
			}
		},
		mounted() {
			let wh = document.body.clientHeight
			let th = document.querySelector('.header').clientHeight
			let cur = (wh - th - 240) + 'px'
			console.log(wh, th)
			console.log(cur)
//			document.querySelector(".a_content").style.height = cur

			this.drawChart()
		},
		created() {},

		methods: {
			
			onLoad() {
		      // 异步更新数据
		      setTimeout(() => {
		        for (let i = 0; i < this.paiming.length; i++) {
		        	if(i<5){
		        		this.current.push(this.paiming[i])
		        	}else{
		        		
		        	}
		        	
		        }
		        // 加载状态结束
		        this.loading = false;
		
		        // 数据全部加载完成
		        if (this.current.length >= this.paiming.length) {
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
					height:280,
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

</style>