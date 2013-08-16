// 裁剪尺寸
require(['jquery', 'push', 'data'], function($, push, data) {

	var $caijianT = $('#caijianT'),
		$checkboxcut = $('#checkboxcut'),
		$caijian = $('#caijian'),
		$caijianwidth = $('#caijianwidth'),
		$caijianheight = $('#caijianheight');

	// 裁剪对象
	data.bgp.cut = {
		width: 0,
		height: 0,
		left: 0,
		top: 0,
		bottom: 0,
		right: 0,
		isLock: false,
		setPosition: function(t, r, b, l) {
			this.left = l;
			this.right = r;
			this.bottom = b;
			this.top = t;
			return this;
		},
		setSize: function(width, height) {
			var size = data.bgp.PI.n.getSize();
			width = width > size.width ? size.width : width;
			height = height > size.height ? size.height : height;
			this.width = width;
			this.height = height;
			$caijianwidth.val(width);
			$caijianheight.val(height)
			return this;
		},
		setLock: function(isLock) {
			this.isLock = isLock;
			return this;
		},
		reset: function() {
			this.setPosition(0, 0, 0, 0);
			this.setSize(0, 0);
			return this;
		},
		clip: function(type) {
			chrome.extension.sendMessage({
				cmd: 'button',
				type: type || 'clipOk',
				arg: [this.width, this.height, this.left, this.top]
			});
			
			cut.push().setClick(true);

			$caijianT.click();
		}
	};

	var cut = {

		reload: function() {
			data.bgp.FORM.fProcess.reload();
		},
		setState: function(state) {
			data.bgp.setState(state);
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
			data.bgp.cut.setSize(Math.floor(size.width / 2), Math.floor(size.height / 2));
			return this;
		},
		sendMessage: function(cmd, val) {
			var isLock = $checkboxcut.attr('checked'),
				width = parseInt($caijianwidth.val(), 10), 
				height = parseInt($caijianheight.val(), 10),
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
			
			data.bgp.cut.setSize(width, height).setLock(isLock);

			cut.reload();
		}
	};
	$checkboxcut.click(function() {
		data.bgp.cut.reset().setLock($checkboxcut.attr('checked'));

		cut.setSize().reload();
	});
	// 标题点击
	$caijianT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $caijianT;
		
		// 初始化控件值
		if($this.hasClass('current')) {
			cut.setState('image');
		}else { 
			data.bgp.cut.reset().setLock($checkboxcut.attr('checked'));
			cut.setState('cut').setSize().reload();
		}

	});
	// 功能按钮
	$caijian.delegate('span', 'click', function() {
		// 获取功能类型
		var type = $(this).attr('cmd');

		data.bgp.cut.clip(type);
	});
});