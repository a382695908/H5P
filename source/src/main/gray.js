// 彩色笔
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$caisebiT = $('#caisebiT'),
		$caisebiTypeDiv = $('#caisebiTypeDiv'),
		$caisebiType = $('#caisebiType'),
		$caisebiSizeVal = $('#caisebiSizeVal'),
		$caisebiSize = $('#caisebiSize'),
		$caisebi = $('#caisebi');
	
	var gray = {
		reload: function(time) {
			
			clearTimeout(handle);
			
			handle = setTimeout(function() {
				data.bgp.FORM.fProcess.reload();
			}, time);

			return this;
		},
		sendMessage: function() {

			clearTimeout(handle);
		
			handle = setTimeout(function() {
	
				chrome.extension.sendMessage({ 
					cmd: 'singleWorkerProcess',
					process: 'gray'
				});
	
			}, 100);
			return this;
		},
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		setState: function(state) {
			data.bgp.setState(state);
			return this;
		},
		setPenType: function(type) {
			data.bgp.setPenType(type);
			return this;
		},
		setPenSize: function(size) {
			data.bgp.setPenSize(size);
			return this;
		},
		setPart: function() {
			data.bgp.PI.part.transparent = data.bgp.PI.p.clone().transparent();
			return this;
		},
		push: function() {
			push();
			return this;
		},
		setSizeP: function(val) {
			$caisebiSize.val(val);
			return this;
		},
		setSizePT: function(val) {
			$caisebiSizeVal.text(val);
			return this;
		},
		setCheckP: function() {
			$caisebiType.attr('checked', true);
			return this;
		}
	};
	// 局部彩色笔点击
	$caisebiT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $(this);

		if($this.hasClass('current')) {

			gray.setState('image').reload(0);
		}else {
			// 初始化控件值
			gray.setSizeP(50).setSizePT(50).setCheckP();
			// 设置处理类型为彩色笔，笔刷状态
			gray.setState('part').setPenType('brush').setPenSize(50).setPart().sendMessage();
		}
	});
	// 画笔类型
	$caisebiTypeDiv.delegate('input', 'click', function() {

		var type = $(this).attr('id') == 'caisebiType' ? 'brush' : 'erase';

		gray.setPenType(type);
	});
	// 画笔大小
	$caisebiSize.change(function() {

		gray.setSizePT(this.value).setPenSize(this.value).reload(200);
	});
	// 功能按钮
	$caisebi.delegate('span', 'click', function() {

		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		}
		gray.push().setClick(true);

		$caisebiT.click();
	});
});