/*
 * 浏览器大小改变重新设置列表高度
 */
require(['jquery'], function($) {

	var $list = $('#list');

	// 获取列表高度
	function getHeight() {

		var minHeight = 0,
			diffHeight = 230, // 列表距离顶部的距离
			innerHeight = window.innerHeight;

		return innerHeight < minHeight ?
					minHeight : innerHeight - diffHeight;
	};

	// 设置列表高度
	function resize() {

		var height = getHeight();

		$list.css({height : height});
	};

	resize();

	window.onresize = resize;
});
