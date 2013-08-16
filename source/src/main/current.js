//当前处理图片点击事件
require(['data','jquery'], function(data, $) {

	$('#currentImage').click(function() {

		var img = data.bgp.PI.n,
			size;

		if(img) {
			size = img.getSize();

			chrome.extension.sendMessage({
				cmd: 'createProcess', 
				state: data.bgp.getState() || 'image',
				width: size.width,
				height: size.height,
				left: Math.floor(window.screen.width / 2 - size.width / 2),
				top: 0
			});

			// 获取焦点
			$(document).mouseover();
		};
	});

	// 自动获取焦点
	$(document).mouseover(function() {
		chrome.extension.sendMessage({
			cmd: 'createMain', 
			focuse: true
		});
	});

	
});