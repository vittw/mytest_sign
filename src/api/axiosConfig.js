/*axios配置*/
import store from '../store/store.js'
const axiosConfig = {
//	baseURL: 'https://appsys.sto.cn',/*生产环境*/
//	baseURL: 'http://222.72.44.130:19999/',/*外网测试接口地址*/
	baseURL: 'http://192.168.124.208:8080/',// wttg
	/*测试接口地址*/
	retry: 4,
	retryDelay: 1000,
	timeout: 20000,
//	withCredentials: true,//打包上线时要打开
	headers: {
		'Content-Type': 'application/json',
		'source': 'jn',
		'clientType': 'H5',
		
		'appId':'app',//打包上线时要注释掉
		'isSKip':'true',//打包上线时要注释掉
		
	},
};
export default axiosConfig