// 背景虚化
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$beijingxuhuaT = $('#beijingxuhuaT'),
		$beijingxuhuaTypeDiv = $('#beijingxuhuaTypeDiv'),
		$beijingxuhuaType = $('#beijingxuhuaType'),
		$beijingxuhuaLevel = $('#beijingxuhuaLevel'),
		$beijingxuhuaSizeVal = $('#beijingxuhuaSizeVal'),
		$beijingxuhuaSize = $('#beijingxuhuaSize'),
		$beijingxuhua = $('#beijingxuhua');
	
	var blur = {
		reload: function(time) {
			
			clearTimeout(handle);
			
			handle = setTimeout(function() {
				data.bgp.FORM.fProcess.reload();
			}, time);

			return this;
		},
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		sendMessage: function() {

			clearTimeout(handle);
		
			handle = setTimeout(function() {
	
				var level = parseInt($beijingxuhuaLevel.val(), 10);
	
				chrome.extension.sendMessage({ 
					cmd: 'singleWorkerProcess',
					process: 'blur',
					radius: level * 2
				});
	
			}, 100);

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
			$beijingxuhuaSize.val(val);
			return this;
		},
		setSizePT: function(val) {
			$beijingxuhuaSizeVal.text(val);
			return this;
		},
		setLevelP: function(val) {
			$beijingxuhuaLevel.val(val);
			return this;
		},
		setCheckP: function() {
			$beijingxuhuaType.attr('checked', true);
			return this;
		}
	};

	// 背景虚化点击
	$beijingxuhuaT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $(this);

		if($this.hasClass('current')) {

			blur.setState('image').reload(0);
		}else {
			// 初始化控件值
			blur.setSizeP(50).setSizePT(50).setLevelP(3).setCheckP();
			// 设置处理类型为虚化，笔刷状态
			blur.setState('part').setPenType('brush').setPenSize(50).setPart().sendMessage();
		}
	});
	// 画笔类型
	$beijingxuhuaTypeDiv.delegate('input', 'click', function() {

		var type =  $(this).attr('id') == 'beijingxuhuaType' ? 'brush' : 'erase';

		blur.setPenType(type);
	});
	// 画笔大小
	$beijingxuhuaSize.change(function() {

		blur.setSizePT(this.value).setPenSize(this.value).reload(200);
	});
	// 绑定虚化力度调整
	$beijingxuhuaLevel.change(blur.sendMessage);
	// 功能按钮
	$beijingxuhua.delegate('span', 'click', function() {

		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		}
		blur.push().setClick(true);

		$beijingxuhuaT.click();
	});
});