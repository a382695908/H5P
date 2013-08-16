// 修改尺寸
require(['jquery', 'push', 'data'], function($, push, data) {

	var $xiugaichicunT = $('#xiugaichicunT'),
		$checkboxcut1 = $('#checkboxcut1'),
		$xiugaichicun = $('#xiugaichicun'),
		$xiugaichicunwidth = $('#xiugaichicunwidth'),
		$xiugaichicunheight = $('#xiugaichicunheight');

	var changeSize = {

		push: function() {
			push();
			return this;
		},
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		validate: function(val) {
			val = $.trim(val);
			val = parseInt(val, 10);
			if(val) {
				return true;
			}
			return false;
		},
		setSize: function() {
			var size = data.bgp.PI.n.getSize();
			$xiugaichicunwidth.val(size.width);
			$xiugaichicunheight.val(size.height);
		},
		sendMessage: function(cmd, val) {
			var isLock = $checkboxcut1.attr('checked'),
				width = parseInt($xiugaichicunwidth.val(), 10), 
				height = parseInt($xiugaichicunheight.val(), 10),
				size, rate;
			
			if(isLock) {
				size = data.bgp.PI.p.getSize();
				rate = size.width / size.height;
				if(cmd == 'width') {
					width = val;
					height = Math.round(width / rate);
				}else {
					height = val;
					width = Math.round(height * rate);
				}
			}
			
			$xiugaichicunwidth.val(width);
			$xiugaichicunheight.val(height);

			chrome.extension.sendMessage({ 
				cmd: 'changeSize',
				width: width,
				height: height
			});
		},
		change: function() {
			var isInt = changeSize.validate(this.val());
		
			if(!isInt) {
				changeSize.setSize();
			}
			// 发送修改指令
			changeSize.sendMessage(this.attr('cmd'), parseInt(this.val(), 10));
		}
	};
	// 宽度改变
	$xiugaichicunwidth.keyup(changeSize.change.bind($xiugaichicunwidth));
	// 高度改变
	$xiugaichicunheight.keyup(changeSize.change.bind($xiugaichicunheight));
	// 标题点击
	$xiugaichicunT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $xiugaichicunT;
		
		// 初始化控件值
		if(!$this.hasClass('current')) {
			changeSize.setSize();
		}
	});
	// 功能按钮
	$xiugaichicun.delegate('span', 'click', function() {
		// 获取功能类型
		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});
	
		changeSize.push().setClick(true);
		// 收起内容框
		$xiugaichicunT.click();
	});
});