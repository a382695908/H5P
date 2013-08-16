// 铅笔
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$qianbiT = $('#qianbiT'),
		$qianbiTypeDiv = $('#qianbiTypeDiv'),
		$qianbiType = $('#qianbiType'),
		$qianbiitem1 = $('.qianbiitem1'),
		$qianbiitem2 = $('.qianbiitem2'),
		$qianbiEraseSize = $('#qianbiEraseSize'),
		$qianbiEraseSizeVal = $('#qianbiEraseSizeVal'),
		$qianbiClear = $('#qianbiClear'),
		$qianbi = $('#qianbi'),
		$current = $('#qianbiOtherColorContent .current'),
		$input = $('#qianbiOtherColorContent input'),
		$colorWrap = $('#qianbiColorWrap'),
		$colorContent = $('#qianbiColorContent'),
		$btnChooseColor = $('#qianbiBtnChooseColor'),
		$currentColor = $('#qianbiCurrentColor');

	var pencil = {
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		init: function() {
			data.bgp.pencil = {};
			data.bgp.PI.part.img = data.bgp.PI.p.clone();
			data.bgp.PI.part.transparent = data.bgp.PI.p.clone();
			return this;
		},
		type: function(type) {
			// 类型: brush - 画笔, erase - 橡皮擦
			data.bgp.pencil.type = type;
			return this;
		},
		esize: function(val) {
			// 橡皮擦大小
			data.bgp.pencil.esize = parseInt(val, 10);
			data.bgp.setPenSize(val);
			return this;
		},
		clear: function(clear) {
			// 清除所有
			data.bgp.pencil.clear = clear;
			return this;
		},
		color: function(val) {
			data.bgp.pencil.color = val;
			$current.css({
				background: '#' + val
			}).attr('value', val);
			$currentColor.css({
				background: '#' + val
			}).attr('value', val);
			$input.val(val.toUpperCase());
			return this;
		},
		eraseP: function(val) {
			$qianbiEraseSize.val(val);
			$qianbiEraseSizeVal.text(val);
			return this;
		},
		brushP: function(brush) {
			if(brush) {
				$qianbiitem1.show();
				$qianbiitem2.hide();
			}else {
				$qianbiitem1.hide();
				$qianbiitem2.show();
			}
			return this;
		},
		reload: function() {
			data.bgp.FORM.fProcess.reload();
			return this;
		},
		setState: function(state) {
			data.bgp.setState(state);
			return this;
		},
		push: function() {
			push();
			return this;
		}
	};
	// 类型切换
	$qianbiTypeDiv.delegate('input', 'click', function() {

		var $this = $(this);

		$this.attr('id') == 'qianbiType' ?
			pencil.type('brush').brushP(1) :
			pencil.type('erase').brushP(0).clear(false);

		pencil.reload();
	});
	
	// 印章标题
	$qianbiT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $(this);

		if($this.hasClass('current')) {

			pencil.setState('image');

		}else {
			$qianbiType.attr('checked', true);
			// 初始化控件值
			pencil.eraseP(50).brushP(1);
			// 设置涂鸦对象
			pencil.init().type('brush').esize(50).color('000000').setState('pencil');
		}

		pencil.reload();
	});
	function timeout(fn) {
		var self = this;
		clearTimeout(handle);
		handle = setTimeout(function() {
			fn(self);
		}, 200);
	};
	// 橡皮擦
	$qianbiEraseSize.change(function() {
		timeout.bind(this)(function(self) {
			pencil.esize(self.value).eraseP(self.value).reload();
		});
	});
	// 清除所有
	$qianbiClear.click(function() {
		pencil.clear(true).reload();
	});
	// 功能按钮
	$qianbi.delegate('span', 'click', function() {
		
		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		};
		pencil.push().setClick(true);

		$qianbiT.click()
	});

	$colorContent.html(data.colorList).delegate('span', 'mouseenter', function() {

		var  val = $(this).attr('value');

		$current.css({
			background: '#' + val
		}).attr('value', val);
		$input.val(val.toUpperCase());

	}).delegate('.color', 'click', function() {

		var $this = $(this),
			color = $this.attr('value');

		pencil.color(color).reload();
	});

	$input.click(function() {

		return false;

	}).keyup(function() {

		var val = $(this).val();

		pencil.color(val);

	}).blur(function() {

		var val = $(this).val();

		if(val.length < 6 || val.length > 6) {
			pencil.color('000000');
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
	$('#qianbiContentDiv .color').each(function(index, item) {

		var $item = $(item);

		$item.css({ background: '#' + $item.attr('value') })
	});
});