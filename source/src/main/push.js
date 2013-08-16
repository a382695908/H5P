// 确定时，延迟200毫秒，刷新底部工具栏的按钮状态
define('push', ['refresh'], function(refresh) {
	
	return function() {
		setTimeout(function() {
			refresh();
		},200);
	}
});