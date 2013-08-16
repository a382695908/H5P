//打开图片方式
require(['jquery', 'data', 'push'], function($, data, push) {

	 // - 打开文件、视频
	$('#tool').delegate('span', 'click', function() {
		
		if(!data.canClick) {
			return false;
		}
		// 清空当前图片
		data.bgp.PI.o = null;
		data.bgp.PI.p = null;
		data.bgp.PI.n = null;
		data.bgp.clearQueue();
		push();
		var $this = $(this);
		
		chrome.extension.sendMessage({ 
			cmd: 'createProcess', 
			state: $this.attr('cmd'),
			width: 500,
			height: 300,
			left: window.screen.width / 2 - 250,
			top: 0
		});
		// 重新加载主页面
		data.bgp.FORM.fMain.reload();
	});
	
});