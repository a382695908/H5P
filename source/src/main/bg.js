// 背景涂鸦
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$beijingT = $('#beijingT'),
		$beijingTypeDiv = $('#beijingTypeDiv'),
		$beijingType = $('#beijingType'),
		$beijingSizeVal = $('#beijingSizeVal'),
		$beijingSize = $('#beijingSize'),
		$beijing = $('#beijing'),
		$beijingContent = $('#beijingContent');

	var beijing = {
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
			$beijingSize.val(val);
			return this;
		},
		setSizePT: function(val) {
			$beijingSizeVal.text(val);
			return this;
		},
		setCheckP: function() {
			$beijingType.attr('checked', true);
			return this;
		},
		background: function(src) {
			var img = new Image;
			img.onload = function() {
				this.onload = null;
				data.bgp.PI.part.img = data.bgp.PI.p.clone().repeatImage(this);
				beijing.reload(0);
			}
			img.src = src;
		}
	};
	// 印章素材
	$beijingContent.delegate('span', 'click', function() {

		var $this = $(this);

		$beijingContent.find('span[class="current"]').removeClass('current');
		$this.addClass('current');

		beijing.background($this.find('img').attr('src'));

	}).find('span:first').addClass('current');
	// 局部马赛克点击
	$beijingT.click(function() {
		
		if(!data.canClick) {
			return false;
		}

		var $this = $(this),
			$first = $beijingContent.find('span:first');

		if($this.hasClass('current')) {

			beijing.setState('image').reload(0);
		}else {
			var src = $first.find('img').attr('src');
			// 初始化控件值
			beijing.setSizeP(50).setSizePT(50).setCheckP();
			// 设置处理类型为背景，笔刷状态
			beijing.setState('part').setPenType('erase').setPenSize(50).setPart().background(src);
		}
	});
	// 画笔类型
	$beijingTypeDiv.delegate('input', 'click', function() {

		var type = $(this).attr('id') == 'beijingType' ? 'erase' : 'brush';

		beijing.setPenType(type);
	});
	// 画笔大小
	$beijingSize.change(function() {

		beijing.setSizePT(this.value).setPenSize(this.value).reload(200);
	});


	// 功能按钮
	$beijing.delegate('span', 'click', function() {

		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		}
		beijing.push().setClick(true);

		$beijingT.click();
	});
});