// lock
// 基础调整
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
	    $b = $('#liangdu'),
	    $c = $('#duibidu'),
	    $bv = $('#liangduVal'),
	    $cv = $('#duibiduVal'),
	    $jichutiaozheng = $('#jichutiaozheng'),
	    $jichutiaozhengT = $('#jichutiaozhengT');

	var base = {
		sendMessage: function() {
			base.setClick(false).show();
			clearTimeout(handle);

			handle = setTimeout(function(){
				var b = parseInt($b.val(), 10),
				    c = parseInt($c.val(), 10);
				chrome.extension.sendMessage({ 
					brightness: b,
				   	contrast: c,
					type: 'single',
					process: 'base',
					cmd: 'moreWorkerProcess'
				});
			},100);
			return this;
		},
		setBv: function(val) {
			$bv.text(val);
			return this;
		},
		setCv: function(val) {
			$cv.text(val);
			return this;
		},
		setB: function(val) {
			$b.val(val);
			return this;
		},
		setC: function(val) {
			$c.val(val);
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
			$jichutiaozheng.show();
			return this;
		},
		hide: function() {
			$jichutiaozheng.hide();
			return this;
		}
	};
	//亮度
	$b.change(function() {
		base.setBv(this.value).sendMessage();
	});
	// 对比度
	$c.change(function() {
		base.setCv(this.value).sendMessage();
	});
	// 功能按钮
	$jichutiaozheng.delegate('span', 'click', function() {
		// 获取功能类型
		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});
		// 重置控件值
		base.push().setB(0).setC(0).setBv(0).setCv(0)
			.setClick(true).hide();
		// 收起内容框
		$jichutiaozhengT.click();
	});
	
});