// lock
// 特效
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
	    $oitem = $('.oitem'),
	    $opacity1 = $('#opacity1'),
	    $texiao1T = $('#texiao1T'),
	    $texiao1 = $('#texiao1'),
	    $opacity2 = $('#opacity2'),
	    $texiao2 = $('#texiao2'),
	    $texiao2T = $('#texiao2T'),
	    $texiaoTContentSpec = $('.texiaoTContent .spec')

	var specially = {
		proxySendMessage: function() {
			var opa = parseInt(this.val(), 10) / 100;
			specially.sendMessage(opa);
			return this;
		},
		sendMessage: function(opa) {
			specially.setClick(false).show();
			clearTimeout(handle);
		
			handle = setTimeout(function(){
				chrome.extension.sendMessage({
					opacity: opa,
					cmd: 'scroll',
					type: 'opacity'
				});
			}, 100);
			return this;
		},
		speciallClick: function() {
			// 获取功能类型
			var type = $(this).attr('cmd');
			
			chrome.extension.sendMessage({
				cmd: 'button',
				type: type
			});
			// 重置控件值
			specially.push().setOpacity(100).setClick(true).hide();

			return this;
		},
		setOpacity: function(val) {
			$opacity1.val(val);
			$opacity2.val(val);
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
			$texiao1.show();
			$texiao2.show();
			$oitem.show();
			return this;
		},
		hide: function() {
			$texiao1.hide();
			$texiao2.hide();
			$oitem.hide();
			return this;
		}
	};
	// 透明度调整
	$opacity1.change(specially.proxySendMessage.bind($opacity1));
	$opacity2.change(specially.proxySendMessage.bind($opacity2));
	// 特效点击
	$texiaoTContentSpec.delegate('span', 'click', function() {
		// 将底层透明度设置为1
		specially.sendMessage(1).setOpacity(100);

		var $this = $(this),
			confing = $this.attr('confing');

		chrome.extension.sendMessage({
			cmd: 'moreWorkerProcess',
			process: 'specially',
			type: 'merge',
			config: confing
		});

	});
	// 特效1功能按钮
	$texiao1.delegate('span', 'click', function() {

		specially.speciallClick.bind(this)();
		// 收起内容框
		$texiao1T.click();
	});
	// 特效2功能按钮
	$texiao2.delegate('span', 'click', function() {

		specially.speciallClick.bind(this)();
		// 收起内容框
		$texiao2T.click();
	});
});