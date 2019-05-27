export function hasClass(el, className) {
	let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
	return reg.test(el.className)
}

//添加一个class
export function addClass(el, className) {
	if(hasClass(el, className)) {
		return
	}

	let newClass = el.className.split(' ')
	newClass.push(className)
	el.className = newClass.join(' ')
}
//去掉一个class名
export function removeClass(el, className) {
	if(hasClass(el, className)) {
		var newClass = ' ' + el.className.replace(/[\t\r\n]/g, '') + ' ';
		while(newClass.indexOf(' ' + className + ' ') >= 0) {
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		el.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}
// 作用：根据id、类、标签查找元素
// 参数：
//		selector : 选择器
//		context : 查询上下文，默认为 document
// 返回值：
//		查找到的满足条件的DOM元素或集合
export function $(selector, context) {
	// 未传递context时，默认为 document
	context = context || document;
	// 判断选择器类型
	if(selector.indexOf("#") === 0) // id选择器
		return document.getElementById(selector.slice(1));
	if(selector.indexOf(".") === 0) // 类选择器
		return getElementsByClassName(selector.slice(1), context);
	// 元素选择器
	return context.getElementsByTagName(selector);
}

// 作用：解决根据类名查找元素的兼容问题
// 参数：
//		className : 类名
//		context : 查询上下文，默认为 document
// 返回值：
//		返回查找到的满足条件的元素集合或数组
export function getElementsByClassName(className, context) {
	// 未传递 context 时，默认为 document
	context = context || document;
	// 判断，浏览器是否支持使用 getElementsByClassName() 方法
	if(context.getElementsByClassName) // 支持
		return context.getElementsByClassName(className);

	/* 不支持使用 getElementsByClassName() 方法 */
	// 定义数组，保存查找结果
	var result = [];
	// 将上下文中所有后代元素查找出来
	var elements = context.getElementsByTagName("*");
	// 遍历所有元素
	for(var i = 0, len = elements.length; i < len; i++) {
		// 将当前遍历到的元素的类名保存到数组中
		var classNames = elements[i].className.split(" ");
		// 判断在该数组中是否存在要查找的类名
		if(inArray(className, classNames) !== -1) // 说明在数组中存在待查找的类名，即当前遍历到的元素是等查找的元素之一
			result.push(elements[i]);
	}
	// 返回查找结果数组
	return result;
}

// 作用：获取/设置 指定元素的某CSS属性值
// 参数：
//		element : DOM元素对象
//		attrName : CSS属性名
//		attrValue : 待设置的 CSS 属性值
// 返回值：
//		返回的是查找到的CSS属性值
export function css(element, attrName, attrValue) {
	// 获取
	if(typeof attrValue === "undefined") {
		return window.getComputedStyle ?
			window.getComputedStyle(element)[attrName] :
			element.currentStyle[attrName];
	}
	// 设置
	element.style[attrName] = attrValue;
}

// 获取光标在文档中的定位位置
export function page(event) {
	var _top = event.clientY + scrollTop();
	var _left = event.clientX + scrollLeft();
	return {
		x: _left,
		y: _top
	}
}
// 封装函数 得到属性
export function getStyle(obj,attr) {  //  谁的      那个属性
    if(obj.currentStyle)  // ie 等
    {
        return obj.currentStyle[attr];  // 返回传递过来的某个属性
    }
    else
    {
        return window.getComputedStyle(obj,null)[attr];  // w3c 浏览器
    }
} 

// 多个属性的运动框架 以及添加回调函数
export function animate(obj,json,fn){  // 目标obj   json 属性：属性值  fn回调函数
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var flag = true;// 用来判断是否停止定时器  
		// 遍历json
		for (var attr in json) {  //attr 属性  json[attr]值
			var curStyle = 0;
			if (attr == "opacity") {
				curStyle = parseInt(getStyle(obj,attr)*100);
			} else{
				curStyle = parseInt(getStyle(obj,attr));// 获得数值
			}
			// 得到步长  目标位置就是json[attr]
			var step = (json[attr]-curStyle) / 10;
			step = step > 0 ? Math.ceil(step) :Math.floor(step);
			
			// 判断透明度
			if (attr == "opacity") { // 判断用户有没有输入opacity
				if ("opacity" in obj.style) { 
					obj.style.opacity = (curStyle + step) / 100;
				} else{
					obj.style.filter = "alpha(opacity="+(curStyle +step)+")";
				}
				
			} else if(attr == "zIndex"){
				obj.style.zIndex = json[attr];
			} else{
				obj.style[attr] = curStyle +step +"px";
			}
			// 判断是否已经都到了目标位置   只要其中一个不满足条件 就不应该停止定时器
			if (curStyle != json[attr]) {
				flag = false;
			}
		}
		// 判断定时器条件 是否该停止了
		if (flag) {
			clearInterval(obj.timer)
			// 当定时器停止后，动画也就结束了.如果有回调函数就执行回调函数
			if(fn){
				fn();
			}
			
		}
	},30);
}
// 作用：求元素的内容宽度
export function width(element) {
	if (element === window)
		return document.documentElement.clientWidth || document.body.clientWidth;

	var _width = 0;
	if (css(element, "display") !== "none"){
		_width = element.clientWidth 
		    - parseFloat(css(element, "paddingLeft"))
			- parseFloat(css(element, "paddingRight"));
	} else {
		_width = parseFloat(css(element, "width"));
	}

	return _width;
}

// 作用：求元素的内容宽度
export function height(element) {
	if (element === window)
		return document.documentElement.clientHeight || document.body.clientHeight;
	
	var _height = 0;
	if (css(element, "display") !== "none"){
		_height = element.clientHeight 
		    - parseFloat(css(element, "paddingTop"))
			- parseFloat(css(element, "paddingBottom"));
	} else {
		_height = parseFloat(css(element, "height"));
	}

	return _height;
}