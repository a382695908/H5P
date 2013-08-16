// 马赛克
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$masaikeT = $('#masaikeT'),
		$masaikeTypeDiv = $('#masaikeTypeDiv'),
		$masaikeType = $('#masaikeType'),
		$masaikeLevel = $('#masaikeLevel'),
		$masaikeSizeVal = $('#masaikeSizeVal'),
		$masaikeSize = $('#masaikeSize'),
		$masaike = $('#masaike');

	var masaike = {
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
	
				var level = parseInt($masaikeLevel.val(), 10);
	
				chrome.extension.sendMessage({ 
					cmd: 'singleWorkerProcess',
					process: 'mosaic',
					radius: level * 2
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
			data.bgp.PI.part.transparent = data.bgp.PI.n.clone();
			return this;
		},
		push: function() {
			push();
			return this;
		},
		setSizeP: function(val) {
			$masaikeSize.val(val);
			return this;
		},
		setSizePT: function(val) {
			$masaikeSizeVal.text(val);
			return this;
		},
		setLevelP: function(val) {
			$masaikeLevel.val(val);
			return this;
		},
		setCheckP: function() {
			$masaikeType.attr('checked', true);
			return this;
		}
	};
	
	// 局部马赛克点击
	$masaikeT.click(function() {
		
		if(!data.canClick) {
			return false;
		}

		var $this = $(this);

		if($this.hasClass('current')) {

			masaike.setState('image').reload(0);
		}else {
			// 初始化控件值
			masaike.setSizeP(50).setSizePT(50).setLevelP(3).setCheckP();
			// 设置处理类型为马赛克，笔刷状态
			masaike.setState('part').setPenType('erase').setPenSize(50).setPart().sendMessage();
		}
	});
	// 画笔类型
	$masaikeTypeDiv.delegate('input', 'click', function() {

		var type = $(this).attr('id') == 'masaikeType' ? 'erase' : 'brush';

		masaike.setPenType(type);
	});
	// 画笔大小
	$masaikeSize.change(function() {

		masaike.setSizePT(this.value).setPenSize(this.value).reload(200);
	});
	// 绑定虚化力度调整
	$masaikeLevel.change(masaike.sendMessage);

	// 功能按钮
	$masaike.delegate('span', 'click', function() {

		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		}
		masaike.push().setClick(true);

		$masaikeT.click();
	});
});