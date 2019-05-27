/*
  name@公共方法
  data@2018/04/08
  author@344822559@qq.com
*/

// import MD5 from "md5";
var MD5 = require('md5.js');
// import CryptoJS from 'crypto-js';
import Axios from 'axios';
// import Jsonp from 'jsonp'
import AxiosConfig from '../api/axiosConfig'
import CommonParams from '../api/commonParams'
import qs from 'qs';
//import Checks from './checkformat';
//import '../../static/jquery-1.11.0.js'
import store from '../store/store.js'

const functions = {

	setStore: (name, content) => {
		if(!name) return;
		if(typeof content !== 'string') {
			content = JSON.stringify(content);
		}
		window.localStorage.setItem(name, content);
	},

	getStore: name => {
		if(!name) return false;
		return window.localStorage.getItem(name);
	},

	removeStore: name => {
		if(!name) return;
		window.localStorage.removeItem(name);
	},

	setsessionStore: (name, content) => {
		if(!name) return;
		if(typeof content !== 'string') {
			content = JSON.stringify(content);
		}
		window.sessionStorage.setItem(name, content);
	},

	getsessionStore: name => {
		if(!name) return;
		return window.sessionStorage.getItem(name);
	},

	removesessionStore: name => {
		if(!name) return;
		window.sessionStorage.removeItem(name);
	},

	createdMd5: args => {
		args = args.toString(); /*转字符串*/
		let md5stream = new MD5();
		return md5stream.update(args).digest('hex');
	},

	/*数据序列化*/
	serializationData: obj => {
		return qs.stringify(obj)
	},

	/*axios*/
	requestHttpMethods: (url, data,HttpMethod = 'post', commonParam = true, config = AxiosConfig) => {
		let formatDate = commonParam ? Object.assign({}, CommonParams, data) : data;
		let formatHttp = HttpMethod.toLowerCase();
		if(formatHttp == 'post') {
//			formatDate = qs.stringify(formatDate);
		}
		
		config.headers['userId']=store.state.userinfo.id;
		//config.headers['siteId']=store.state.userinfo.companyId;
		
		let instance=Axios.create(config)
		let HttpSendType = formatHttp == 'post' ? instance.post : instance.get;
		return HttpSendType(url, formatDate,config).then(res => {
				return Promise.resolve(res.data)
			})
			.catch(err => {
				alert(err);
			})
	},

	/*封装jsonp方法*/
	jsonpMethod(url, data, commonParam = true){

		let formatDate = commonParam ? Object.assign({}, CommonParams, data) : data;
		url += (url.indexOf('?') < 0 ? '?' : '&') + this.param(formatDate);
		return new Promise((resolve, reject) => {
			Jsonp(url, formatDate, (err, data) => {
				// 类似node的设计，如果err是null，表示成功，data是后端返回的数据
				if(!err) {
					resolve(data)
				} else {
					reject(err)
				}
			})
		})
	},
	/*jsonpurl格式化*/
	param(data) {
		let url = ''
		for(var k in data) {
			let value = data[k] !== undefined ? data[k] : ''
			url += '&' + k + '=' + encodeURIComponent(value)
		}
		return url ? url.substring(1) : ''
	},

	/*
	methods:des加密
	message@明文
	key@约定秘钥
	*/
	encryptByDES(message, key) {
		const keyHex = CryptoJS.enc.Utf8.parse(key);
		const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();

	},
	/*
	methods:DES解密
	ciphertext@DES加密报文
	key@约定秘钥
	*/
	decryptByDES(ciphertext, key) {
		const keyHex = CryptoJS.enc.Utf8.parse(key);
		// direct decrypt ciphertext
		const decrypted = CryptoJS.DES.decrypt({
			ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
		}, keyHex, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	},
	//随机生成32位字符
	sign() {
		let len = 32;
		let $charts = '0123456789qwertyuioplkjhgfdsazxcvbnm';
		let maxlength = $charts.length;
		let pwd = '';
		for(let i = 0; i < len; i++) {
			pwd += $charts.charAt(Math.floor(Math.random() * maxlength));
		}
		return pwd;
	},
	//日期字符串的拼接，返回年月日
	formatDateTime: (date1) => {
		var date = new Date(date1)
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var minute = date.getMinutes();
		var seconds = date.getSeconds();
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
		h = h < 10 ? ('0' + h) : h;
		minute = minute < 10 ? ('0' + minute) : minute;
		seconds = seconds < 10 ? ('0' + seconds) : seconds;
		return y +'-'+ m +'-'+ d+' '+h+':'+minute+':'+seconds;
	},
	
	
	formatDateTime2: (date1) => {
		var date = new Date(date1)
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var minute = date.getMinutes();
		var seconds = date.getSeconds();
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
		h = h < 10 ? ('0' + h) : h;
		minute = minute < 10 ? ('0' + minute) : minute;
		seconds = seconds < 10 ? ('0' + seconds) : seconds;
		return y +'-'+ m +'-'+ d+' '+'23'+':'+'59'+':'+'59';
	},
	//返回day天前的日期
	getDay:(datas,day)=>{
    var today = new Date(datas);
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); 
    var tYear = today.getFullYear();
    var tMonth = today.getMonth()+1;
    var tDate = today.getDate();
    tMonth = tMonth<10?('0'+tMonth):tMonth;
    tDate = tDate<10?('0'+tDate):tDate;
    return tYear+'.'+tMonth+'.'+tDate;
},


getDayTwo:(datas,day)=>{
    var today = new Date(datas);
    var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
    today.setTime(targetday_milliseconds); 
    var tYear = today.getFullYear();
    var tMonth = today.getMonth()+1;
    var tDate = today.getDate();
    tMonth = tMonth<10?('0'+tMonth):tMonth;
    tDate = tDate<10?('0'+tDate):tDate;
    return tYear+''+tMonth+''+tDate;
},
	//返回当前月份向前减num的日期
	formatDateReduce: (date1) => {
		var date = new Date(date1)
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		
		var d = date.getDate();
		
		var h = date.getHours();
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		var seconds = date.getSeconds();
		seconds = seconds < 10 ? ('0' + seconds) : seconds;
		return y +'-'+ m +'-'+ d;
	},
	//获取前几个月的时间
	GetPreMonthDay:(monthNum)=>{
//		var dateArr = dates.split('-');
	var dateArr = new Date()
  var year = dateArr.getFullYear(); //获取当前日期的年份
  var month = dateArr.getMonth()+1; //获取当前日期的月份
  var day = dateArr.getDate(); //获取当前日期的日
  var days = new Date(year, month, 0);
  days = days.getDate(); //获取当前日期中月的天数
  var year2 = year;
  var month2 = parseInt(month) - monthNum;
  if (month2 <=0) {
   year2 = parseInt(year2) - parseInt(month2 / 12 == 0 ? 1 : parseInt(month2) / 12);
   month2 = 12 - (Math.abs(month2) % 12);
  }
  var day2 = day;
  var days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
   day2 = days2;
  }
  if (month2 < 10) {
   month2 = '0' + month2;
  }
  day2=day2<10?('0'+day2):day2
  var t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
 },
 
 
	addMonth:(date, num)=>{
    num = parseInt(num);
    var sDate = new Date(date);

    var sYear = sDate.getFullYear();
    var sMonth = sDate.getMonth() + 1;
    var sDay = sDate.getDate();

    var eYear = sYear;
    var eMonth = sMonth + num;
    var eDay = sDay;
    while (eMonth > 12) {
      eYear++;
      eMonth -= 12;
    }

    var eDate = new Date(eYear, eMonth - 1, eDay);

    while (eDate.getMonth() != eMonth - 1) {
      eDay--;
      eDate = new Date(eYear, eMonth - 1, eDay);
    }
		
		let y=eDate.getFullYear()
		let m=eDate.getMonth()+1
		let d=eDate.getDate()
		
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
//		return eDate;
    return y +'-'+ m +'-'+ d;
}
	

}

export default functions;