// lock
// 色彩调整
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
	    $c = $('#qinghong'),
	    $m = $('#zilv'),
	    $y = $('#huanglan'),
	    $secaitiaozhengT = $('#secaitiaozhengT'),
	    $secaitiaozheng = $('#secaitiaozheng');
	    
	var balance = {
		sendMessage: function() {
			balance.setClick(false).show();
			clearTimeout(handle);
		
			handle = setTimeout(function(){
				var c = parseInt($c.val(), 10),
				    m = parseInt($m.val(), 10),
				    y = parseInt($y.val(), 10);
				chrome.extension.sendMessage({
					cyan: c, 
					magenta: m,
					yellow: y,
					type: 'single',
					process: 'balance',
					cmd: 'moreWorkerProcess'
				});
			}, 100);
			return this;
		},
		setC: function(val) {
			$c.val(val);
			return this;
		},
		setM: function(val) {
			$m.val(val);
			return this;
		},
		setY: function(val) {
			$y.val(val);
			return this;
		},
		push: function() {
			push();
			return this;
		},
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		show: function() {
			$secaitiaozheng.show();
			return this;
		},
		hide: function() {
			$secaitiaozheng.hide();
			return this;
		}
	};
	// 色彩调整
	$c.change(balance.sendMessage);
	$m.change(balance.sendMessage);
	$y.change(balance.sendMessage);
	// 功能按钮
	$secaitiaozheng.delegate('span', 'click', function() {
		// 获取功能类型
		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});
		// 重置控件值
		balance.push().setY(0).setM(0).setC(0)
			.setClick(true).hide();
		// 收起内容框	
		$secaitiaozhengT.click();
	});
});