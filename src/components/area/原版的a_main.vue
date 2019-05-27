<template>
	<div>
		<div class="outer_box" >
			<myHeader :h_stateone="h_stateone" :common_title="common_title" :serach_state="serach_state" :back_state="back_state" :close_state="close_state" @click_serach="click_serach"></myHeader>
			<div class="inner_box_two" v-if="h_statetwo">
				<div class="h_left">
					<slot>
						<span @click="back2Click" class="back"></span>
					</slot>
				</div>
				<div class="h_right">
					<slot>
						<van-search v-model="value" placeholder="请输入网点名称搜索" show-action @input="onSearch">
							<div slot="action" @click="onSearch2">搜索</div>
						</van-search>
					</slot>
				</div>
			</div>

			<div class="logo_banner">
				<div class="logo_left">
					您好！{{companyName}}
				</div>
				<div class="logo_right" @click="select_date">
					<span class="logo_date">{{currentDate}}</span>
					<span class="logo_select"></span>
				</div>
			</div>
			<div class="content_box" ref="scroll">
				<div class="state_one">
					<div class="number_banner">
						<div class="num_left">
							<div class="num_inn_le"></div>
							<div class="num_inn_rig">
								<p class="num_desc">有派件无签收</p>
								<p class="num_value">{{unsignedSendCount}}</p>
							</div>
						</div>
						<div class="num_right">
							<div class="num_riginn_le"></div>
							<div class="num_inn_rig">
								<p class="num_desc">有到件无签收</p>
								<p class="num_value">{{unsignedArriveCount}}</p>
							</div>
						</div>
					</div>
					
					<div class="chartBox">
						<canvas id="mountNode"></canvas>
					</div>
					
					<!--<div class="update_time" v-if="update_state">
						数据更新于{{updateTime}}
					</div>-->
					<div class="update_time">
						数据更新于2019-04-08 11:21:21
					</div>
					<div class="fengeixian"></div>
					<div class="lists">
						<div class="myTitle">
							<!--<myCell>
								<template slot="leftInfor">
									<span>排名</span>
									<span>业务员名称</span>
									<span>有派无签票数（去问题件）</span>
								</template>
							</myCell>-->
							
							<van-cell value="有派无签票数(去问题件)">
							  <template slot="title">
							    <span class="custom-text" >排序</span>
							    <span style="margin-left: 36px;">业务员名称</span>
							    <!--<van-tag type="danger">标签</van-tag>-->
							  </template>
							</van-cell>
						</div>
						
						<div class="searchTwo">
							<van-search
							  v-model="value2"
							  placeholder="请输入业务员名称"
							  @input="onSearch"
							  @search="onSearch"
							  @focus="onBlur"
							  @blur="cancelBlur"
							>
							</van-search>
						</div>
						<div class="listss">
							<!--<myCell isExit v-for="(item,index) in paiming" :key="index" @cellClick="cellClick(item)">
								<template slot="leftInfor">
									<span>{{index+1}}</span>
									<span>{{item.name}}</span>
									<span>{{item.value}}</span>
								</template>
							</myCell>-->
							<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
								<p>刷新次数: {{ count }}</p>
							<van-list
							  v-model="loading"
							  :finished="finished"
							  finished-text="没有更多数据了"
							  loading-text="正在加载中。。。"
							  @load="onLoad"
							>
							<van-cell v-for="(item,index) in paiming" :key="index" :value="item.value" is-link @click="cellClick(item)">
							  <template slot="title">
							    <span class="custom-text" >{{index+1}}</span>
							    <span style="margin-left: 46px;">{{item.name}}</span>
							  </template>
							</van-cell>
							</van-list>
							</van-pull-refresh>
							
						</div>
						<!--<div class="more" @touchstart='touchstart' @touchend='touchend'>
							<span>点击加载更多</span>
						</div>-->
					</div>
					
					
				</div>
			</div>
			
			
			<van-popup v-model="dateshow" position="bottom" :overlay="true">
				<van-datetime-picker v-model="current" :max-date="maxDate" type="date" @confirm="dateConfirm" @cancel="cancel" />
			</van-popup>
		</div>
	</div>
</template>
<script>
	const F2 = require('@antv/f2');
	import myHeader from '@/components/common/header'
	import mySerch from '@/components/common/header_serch'
	import { addClass, removeClass } from '@/functions/dom';
	import myCell from '@/components/common/myCell'
	import { Popup, DatetimePicker, Search, Dialog,Cell,Tag,Icon } from 'vant';
	import { Toast,List,PullRefresh } from 'vant';
	export default {
		components: {
			myHeader,
			mySerch,
			myCell,
			addClass,
			removeClass,
			[Search.name]: Search,
			[Popup.name]: Popup,
			[Dialog.name]: Dialog,
			[DatetimePicker.name]: DatetimePicker,
			[Toast.name]: Toast,
			[Cell.name]:Cell,
			[Tag.name]:Tag,
			[Icon.name]:Icon,
			[List.name]:List,
			[PullRefresh.name]:PullRefresh
		},

		data() {
			return {
				common_title: '签收对比监控',
				back_state: false,
				close_state: true,
				h_stateone: true,
				h_statetwo: false,
				serach_state: false,
				companyName: '',

				oneShow: false,
				twoShow: true,
				threeShow: false,
				currentDate: this.$function.getDay(new Date(), 0),

				//日期选择相关
				dateshow: false,
				current: new Date(),

				value: '', //搜索框中的值
				mohu_data: [],

				chartData: [],
				unsignedSendCount: 0,
				unsignedArriveCount: 0,
				allData: {},

				updateTime: '', //数据更新时间
				update_state: false,

				flagTime: '', //临时存储时间
				maxDate: '',
				chart: '',
				value2:'',
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
				acPaiming:[
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
				myScroll:0,
				myScrollShow:false,
				
				//上拉加载相关
				loading: false,
			    finished: false,
			    //下拉刷新相关
			    count: 0,
      			isLoading: false,
			}
		},
		
		activated(){
			
//  		let that=this;
//  		this.$refs.scroll.addEventListener("scroll",that.recordScrollPosition,true); 
		},
  		deactivated(){
//  		let that=this;
//  		this.$refs.scroll.removeEventListener("scroll",that.recordScrollPosition,true); 
  		},
		mounted() {
			this.maxDate = new Date(this.$function.getDay(this.current, 0))
			let dates = this.$function.getDay(this.currentDate, 0)
			this.companyName = this.$store.state.userinfo.companyName
			
			
			
			let that=this;
			this.$refs.scroll.addEventListener("scroll",that.recordScrollPosition,true);
			
			this.getHeight()
			//中间的图表
//			this.getInfor();
			//业务员排名接口
			this.getSalesRank()
			
			
			var chartdata=[{
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
				}]
			var chart = new F2.Chart({
					id: 'mountNode',
					height:280,
					pixelRatio: window.devicePixelRatio
				});
				chart.source(chartdata);
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
			
		},
		created(){
//			var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
//		    window.onresize = function() {
//		        var nowClientHeight = document.documentElement.clientHeight || document.body.clientHeight;
//		        if (clientHeight - nowClientHeight > 60 ) {//因为ios有自带的底部高度
//		            //键盘弹出的事件处理
//		            document.getElementById("apply").classList.add("focusState");
//		        }
//		        else {
//		            //键盘收起的事件处理
//		        	document.getElementById("apply").classList.remove("focusState");
////					removeClass(document.getElementById("apply"),'focusState')
//		        } 
//		    }

		},
		methods: {
			//上拉加载数据
			onLoad() {
		      // 异步更新数据
		      setTimeout(() => {
//		        for (let i = 0; i < this.paiming.length; i++) {
//		        		this.paiming.push(this.paiming[i])
//		        	
//		        }
		        // 加载状态结束
		        this.loading = false;
		
		        // 数据全部加载完成
		        if (this.paiming.length >= 10) {
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
			
			recordScrollPosition(e) {
				this.myScroll=e.target.scrollTop
//				this.$store.dispatch("setListTop",e.target.scrollTop);//实时存入到vuex中
				
				let nScrollHeight = this.$refs.scroll.scrollHeight;  // 滚动距离总长   内部div的高度
				let nScrollTop = e.target.scrollTop;  // 滚动条（点）当前的位置在内部div的高度 里占多少
			},

			
			//搜索业务员名称（模糊搜索查询）
			onSearch(){
				let current=[]
				console.log(this.value2)
				console.log(this.paiming,'排名')
				for(let i=0;i<this.acPaiming.length;i++){
					if(this.acPaiming[i].name.search(this.value2)!=-1){
						current.push(this.acPaiming[i])
						this.paiming=current
					}else{
						
					}
				}
			},
			onBlur(e){
//				console.log('得到')
//				
//				let myStyle=`width:100%;position: absolute;top:0;
//				animation:mymove 5s;
//				-webkit-animation:mymove 5s;
//				@keyframes mymove{
//					from {top:433px;}
//					to {top:0px;}
//				}
//					
//				@-webkit-keyframes mymove{
//					from {top:433px;}
//					to {top:0px;}
//				}`
//				document.querySelector(".lists").style=myStyle
			},
			cancelBlur(){
//				console.log('失去焦点')
//				
//				let myStyle=`
//				width:100%;
//				position: absolute;
//				left:0;
//				animation:mymove 5s;
//				-webkit-animation:mymove 5s;
//				@keyframes mymove{
//					from {top:0px;}
//					to {top:433px;}
//				}
//					
//				@-webkit-keyframes mymove{
//					from {top:0px;}
//					to {top:433px;}
//				}`
//				document.querySelector(".lists").style=myStyle
			},
			//点击查看更多
			touchstart(ev) {
				addClass(ev.currentTarget, 'icon_on')
				alert('你点击了查看更多')
			},
			touchend(ev) {
				removeClass(ev.currentTarget, 'icon_on')
			},
			//跳转到业务员的详情页
			cellClick(item){
				console.log(item)
				console.log(event.path[1].children[1].innerText)
				console.log(123456)
				this.$router.push({
					name:'A_detail'
				})
			},
			//业务员排名
			getSalesRank(){
				
			},
			
			getInfor(){
				this.$function.requestHttpMethods('face-jn/sign/stats?site=' + this.companyName, {
					params: {}
				}, 'get').then((res) => {
					console.log(res, '哈哈')
	
					Toast.loading({
						mask: true,
						duration: 3000, // 持续展示 toast的时间
						message: '加载中...'
					});
	
					if(res.respCode === '000') {
	
						this.updateTime = this.$function.formatDateTime(this.current)
						this.update_state = true
	
						this.$store.commit('saveUpdateTime', this.updateTime)
	
						this.allData = res.data;
						this.unsignedSendCount = this.allData.unsignedSendCount
						this.unsignedArriveCount = this.allData.unsignedArriveCount
	
						this.chartData = [{
								name: '含问题件',
								sel: '有派件无签收',
								values: res.data.allSendCount
							},
							{
								name: '含问题件',
								sel: '有到件无签收',
								values: res.data.allArriveCount
							},
							{
								name: '去问题件',
								sel: '有派件无签收',
								values: res.data.unsignedSendCount
							},
							{
								name: '去问题件',
								sel: '有到件无签收',
								values: res.data.unsignedArriveCount
							}
	
						]
	
						console.log(this.chartData)
					} else {
						//							this.threeShow=!this.threeShow
						Dialog.alert({
							message: res.resMessage
						}).then(() => {
							// on close
						});
					}
	
					let that = this
					setTimeout(function() {
//						that.getHeight()
						that.draw();
					}, 3000)
				})
			},
			click_serach() {
				//				this.oneShow=false
				this.twoShow = !this.twoShow
				this.threeShow = !this.threeShow
				this.h_statetwo = !this.h_statetwo
				this.h_stateone = !this.h_stateone
			},
			serachClick() {
				this.h_stateone = false
				this.h_statetwo = true
				this.twoShow = false
				this.threeShow = true
			},
			select_date() {
				this.dateshow = !this.dateshow
			},
			getHeight() {
				let wh=document.body.clientHeight
				let th=document.querySelector(".header_box").clientHeight
				let lh=document.querySelector(".logo_banner").clientHeight
				let nh=document.querySelector(".number_banner").clientHeight
				
				let curr=(wh-th-lh)+'px'
				document.querySelector(".state_one").style.height=curr
			},
			getHeightTwo() {
				let whole = document.body.clientHeight
				let wheader = document.querySelector('.header_box').clientHeight
				let say = document.querySelector(".logo_banner").clientHeight
				let two = (whole - wheader - say) + 'px'
				document.querySelector('.state_two').style.height = two
			},
			cancel() {
				this.dateshow = !this.dateshow
			},
			dateConfirm(volumns) {
				//				this.currentDate = this.$function.getDay(volumns, 0)
				//				this.dateshow = !this.dateshow

				//				let sy=this.$store.state.saveTime.substring(0,10)
				this.currentDate = this.$function.getDay(volumns, 0)
				//将改变过后的数据保存起来
				this.$store.commit('saveCurrentTime', this.currentDate)

				this.update_state = true
				this.dateshow = !this.dateshow

				this.$function.requestHttpMethods('face-jn/sign/stats?site=' + this.companyName + '&date=' + this.currentDate, {
					params: {}
				}, 'get').then((res) => {
					console.log(res, '根据搜索出来的结果')
					if(res.respCode === '000') {
						this.allData = res.data;
						if(this.currentDate == res.data.timestamp.substring(0, 10)) {
							console.log('当天')
							this.updateTime = res.data.timestamp
							//								this.updateTime=this.$function.getDay(volumns,0)
						} else {
							console.log('非当天')
							this.updateTime = this.$function.getDay(volumns, 0) + '  ' + '23:59:59'
						}
						//						if()
						//						this.updateTime = this.$function.formatDateTime(this.current)
						//						this.update_state = true

						this.unsignedSendCount = this.allData.unsignedSendCount
						this.unsignedArriveCount = this.allData.unsignedArriveCount
						this.companyName = this.companyName
						this.chartData = [{
								name: '含问题件',
								sel: '有派件无签收',
								values: res.data.allSendCount
							},
							{
								name: '含问题件',
								sel: '有到件无签收',
								values: res.data.allArriveCount
							},
							{
								name: '去问题件',
								sel: '有派件无签收',
								values: res.data.unsignedSendCount
							},
							{
								name: '去问题件',
								sel: '有到件无签收',
								values: res.data.unsignedArriveCount
							}

						]
						//									this.getHeight()
						this.draw();
						console.log(this.chartData)
					} else {
						//this.threeShow=!this.threeShow
						Dialog.alert({
							message: res.resMessage
						}).then(() => {
							this.threeShow = !this.threeShow
						});
					}

					let that = this
					setTimeout(function() {
						that.getHeight()
						that.draw();
					}, 3000)
				})

			},

			draw() {
				var Shape = F2.Shape;
				var Util = F2.Util;
				Shape.registerShape('interval', 'text', {
					draw: function draw(cfg, container) {
						var points = this.parsePoints(cfg.points);
						// points 顶点的顺序
						// 1 ---- 2
						// |      |
						// 0 ---- 3
						var style = Util.mix({
							fill: cfg.color,
							z: true // 需要闭合
						}, cfg.style);
						var intervalShape = container.addShape('rect', {
							attrs: Util.mix({
								x: points[1].x,
								y: points[1].y,
								width: points[2].x - points[1].x,
								height: points[0].y - points[1].y
							}, style)
						});

						var origin = cfg.origin._origin; // 获取对应的原始数据记录
						var textShape = container.addShape('text', {
							zIndex: 1,
							attrs: {
								x: (points[1].x + points[2].x) / 2,
								y: points[1].y - 5, // 往上偏移 5 像素
								text: origin['values'],
								fill: '#808080',
								textAlign: 'center',
								textBaseline: 'bottom',
								fontSize: 12 // 字体大小
							}
						});
						container.sort();
						return [intervalShape, textShape];
					}
				});
				if(this.chart) {
					this.chart.destroy()
				}
				var chart;
				this.chart = chart = new F2.Chart({
					id: 'mountNode',
					height:800,
					pixelRatio: window.devicePixelRatio
				});
				chart.source(this.chartData);
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
					}
				});
				chart.axis('sel', {
					label: function label(text, index, total) {
						var textCfg = {
							fontSize: 12
						};
						if(index === 0) {
							textCfg.textAlign = 'center';
						} else if(index === total - 1) {
							textCfg.textAlign = 'center';
						}
						return textCfg;
					}
				});
				chart.axis('values', {
					label: function label(text, index, total) {
						var textCfg = {
							fontSize: 12
						};
						return textCfg;
					}
				});
				chart.interval().position('sel*values').color('name', ['#FF5B5B', '#1FCCAD']).size(50).shape('text').adjust({
					type: 'dodge',
					marginRatio: 0.4 // 设置分组间柱子的间距
				});
				chart.render();
			},
		},
		watch: {},

	}
</script>

<style lang="stylus" scoped>
	@import "~staticPath/css/var";
	.focusState {
		position: absolute;
		/*top: 0px;
		left: 0px;*/
		width: 100%;
		/*bottom: 0px;*/
	}
	.logo_select {
		bg-image('../../assets/img/Triangle');
		background-size: auto 20px;
	}
	
	.num_inn_le {
		bg-image('../../assets/img/pic_1');
		background-size: auto 50px;
	}
	
	.num_riginn_le {
		bg-image('../../assets/img/pic_2');
		background-size: auto 50px;
	}
	
	.state_one {
		width: 100%;
		overflow: auto;
		position: relative;
	}
	
	.state_two {
		background-color: #ffffff;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.two_inner {
			/*background-color:red;*/
			.two_img {
				display: inline-block;
				width: 400px;
				height: 300px;
				bg-image('../../assets/img/Group2');
				background-size: auto 100%;
			}
			.desc_two {
				line-height: 100px;
				background-color: #FE7621;
				color: #FFFFFF;
				font-size: 30px;
				border-radius: 10px;
			}
			.desc {
				line-height: 100px;
				font-size: 30px;
				border-radius: 10px;
			}
		}
	}
	
	.inner_box_two {
		width: 100%;
		height: 100px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
		border-bottom: 0.5px solid #E8E8E8;
		.h_left {
			width: 15%;
			height: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			.back {
				display: inline-block;
				width: 100%;
				height: 100%;
				bg-image('../../assets/img/back_copy');
				background-size: auto 40%;
			}
			.close {
				display: inline-block;
				width: 100%;
				height: 100%;
				bg-image('../../assets/img/fork');
				background-size: auto 40%;
			}
		}
		.h_right {
			width: 85%;
			height: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-right: 32px;
		}
	}
	/*模糊查询出来的列表*/
	
	.outer_box {
		/*position: relative;*/
	}
	
	.mohu {
		width: 100%;
		position: absolute;
		top: 100px;
		left: 0px;
		background-color: #FFFFFF;
		z-index: 9999;
		.mohu_inner {
			max-height: 500px;
			flex: 1;
			overflow: auto;
			.mohu_item {
				text-align: left;
				padding-left: 50px;
				line-height: 80px;
				font-size: 28px;
				border-bottom: 1px solid #E8E8E8;
			}
		}
	}
	
	.icon_on {
		background-color: #F6F6F6;
	}
	.more{
		width: 100%;
		height: 100px;
		font-size: 32px;
		/*background-color: #F5F5F5;*/
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		span{
			display: inline-block;
			/*background-color: red;*/
		}
	}
</style>