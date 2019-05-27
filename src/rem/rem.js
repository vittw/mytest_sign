// 设置 rem 函数
function setRem () {
  /*默认是750宽度的设计图 除以7.5也就说测量设计图的尺寸然后除以100 就得到rem的值 然后写在样式上*/

  var deviceWidth = document.documentElement.clientWidth; /*设备宽度*/

  // if(deviceWidth > 750) deviceWidth = 750;
  /*当设备宽度大于750的时候按照750来显示*/

  // 当前页面宽度相对于 750 宽的缩放比例，可根据自己需要修改。
  const scale = deviceWidth / 7.5
  // 设置页面根节点字体大小
  document.documentElement.style.fontSize = scale + 'px'
}
// 初始化
setRem()
// 改变窗口大小时重新设置 rem
window.onresize = function () {
  setRem()
}
