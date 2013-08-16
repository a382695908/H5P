// 局部变色笔
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$biansebiT = $('#biansebiT'),
		$biansebiTypeDiv = $('#biansebiTypeDiv'),
		$biansebiType = $('#biansebiType'),
		$biansebiSizeVal = $('#biansebiSizeVal'),
		$biansebiSize = $('#biansebiSize'),
		$biansebi = $('#biansebi'),
	    $currentColor = $('#currentColor'),
	    $biansebiContent = $('#biansebiContent'),
	    $current = $('#otherColorContent .current'),
		$input = $('#otherColorContent input'),
		$colorWrap = $('#colorWrap'),
		$colorContent = $('#colorContent'),
		$btnChooseColor = $('#btnChooseColor');

	var change = {
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
			data.bgp.PI.part.img = data.bgp.PI.p.clone();
			data.bgp.PI.part.transparent = data.bgp.PI.p.clone();
			data.bgp.PI.part.color = $currentColor.attr('value');
			return this;
		},
		push: function() {
			push();
			return this;
		},
		setSizeP: function(val) {
			$biansebiSize.val(val);
			return this;
		},
		setSizePT: function(val) {
			$biansebiSizeVal.text(val);
			return this;
		},
		setCheckP: function() {
			$biansebiType.attr('checked', true);
			return this;
		},
		color: function(color) {
			data.bgp.PI.part.color = color;
			$current.css({
				background: '#' + color
			}).attr('value', color);
			$currentColor.css({
				background: '#' + color
			}).attr('value', color);
			$input.val(color.toUpperCase());
			return this;
		} 
	};
	// 局部彩色笔点击
	$biansebiT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $(this);

		if($this.hasClass('current')) {

			change.setState('image');
		}else {
			// 初始化控件值
			change.setSizeP(50).setSizePT(50).setCheckP();
			// 设置处理类型为彩色笔，笔刷状态
			change.setState('partChange').setPenType('brush').setPenSize(50).setPart();
		}
		change.reload(0);
	});
	// 画笔类型
	$biansebiTypeDiv.delegate('input', 'click', function() {

		var type = $(this).attr('id') == 'biansebiType' ? 'brush' : 'erase';

		change.setPenType(type);
	});
	// 画笔大小
	$biansebiSize.change(function() {

		change.setSizePT(this.value).setPenSize(this.value).reload(200);
	});
	// 功能按钮
	$biansebi.delegate('span', 'click', function() {

		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		}
		change.push().setClick(true);
		
		$biansebiT.click();
	});

	$biansebiContent.delegate('.color', 'click', function() {
		
		var $this = $(this),
			color = $this.attr('value');

		change.color(color);
	});

	$colorContent.html(data.colorList).delegate('span', 'mouseenter', function() {

		var  value = $(this).attr('value');

		// change.color(value);
		$current.css({
			background: '#' + value
		}).attr('value', value);
		$input.val(value.toUpperCase());
	});

	$input.click(function() {

		return false;

	}).keyup(function() {

		var val = $(this).val();

		change.color(val);

	}).blur(function() {

		var val = $(this).val();

		if(val.length < 6 || val.length > 6) {
			change.color('000000');
		}
	});
	// 显示颜色列表
	$btnChooseColor.click(function() {
		$colorWrap.slideDown(100);
		return false;
	});

	$(document).click(function() {
		$colorWrap.slideUp(100);
	});
	// 显示span的颜色
	$('#biansebiContent .color').each(function(index, item) {

		var $item = $(item);

		$item.css({ background: '#' + $item.attr('value') })
	});
});