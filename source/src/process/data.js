/*
 * 窗体打开时初始化，获取底层数据
 */
function Process() {

	var bg = chrome.extension.getBackgroundPage();

	this.data =  {
		bgp: bg.bgp,
		bg: bg
	}
} 