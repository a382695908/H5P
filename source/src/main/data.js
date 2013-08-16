/*
 * 窗体打开时初始化，获取底层数据，当前处理图片
 */
define("data", [], function() {
	// 生产颜色列表框
	var rgb = ['00','33','66','99','cc','ff'],
		data = [],
		flag = 0,
		i, len, j, le, val,
		str = '<span class="color" value="{val}"></span>';
	// 第一行
	for (i = 0, len = 6; i < len; i++) {
		val = rgb[i] + rgb[i] + rgb[i];
		data.push(str.replace(/{val}/,val));
	};
	'ff0000,00ff00,0000ff,ffff00,00ffff,ff00ff'.split(',').forEach(function(item, i) {
		data.push(str.replace(/{val}/,item));
	});
	// 第二行
	for(i = 0, len = 12; i < len; i++) {
		data.push(str.replace(/{val}/,'000000'));
	}
	// 剩余行
	for (i = 0, len = 18; i < len; i++) {
		if(i % 6 == 0 && i != 0) {
			flag ++;
		}
		for(j = 0, le = 12; j < le; j++) {
			val = j > 5 ? rgb[flag + 3] : rgb[flag];
			val = val + rgb[i % 6] + rgb[j % 6];
			data.push(str.replace(/{val}/,val));
		}
	};

	return {
		bgp: chrome.extension.getBackgroundPage().bgp,
		colorList: data.join(''), // 颜色列表
		canClick: true // 二级导航是否可用
	};
});