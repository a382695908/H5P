// 印章
require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		count = 76,
		src = 'assets/seal/',
		target = '<span cmd="{index}"><img src="{src}"></span>',
		$yinzhangContent = $('#yinzhangContent'),
		$yinzhangT = $('#yinzhangT'),
		$yinzhangTypeDiv = $('#yinzhangTypeDiv'),
		$yinzhangType = $('#yinzhangType'),
		$yinzhangitem1 = $('.yinzhangitem1'),
		$yinzhangitem2 = $('.yinzhangitem2'),
		$yinzhangSizeVal = $('#yinzhangSizeVal'),
		$yinzhangSize = $('#yinzhangSize'),
		$yinzhangTranVal = $('#yinzhangTranVal'),
		$yinzhangTran = $('#yinzhangTran'),
		$yinzhangEraseSize = $('#yinzhangEraseSize'),
		$yinzhangEraseSizeVal = $('#yinzhangEraseSizeVal'),
		$yinzhangClear = $('#yinzhangClear'),
		$yinzhang = $('#yinzhang'),
		$yinzhangColor = $('#yinzhangColor'),
		$current = $('#yinzhangOtherColorContent .current'),
		$input = $('#yinzhangOtherColorContent input'),
		$colorWrap = $('#yinzhangColorWrap'),
		$colorContent = $('#yinzhangColorContent'),
		$btnChooseColor = $('#yinzhangBtnChooseColor'),
		$currentColor = $('#yinzhangCurrentColor'),
		html = [],
		i, span;

	var tuya = {
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		init: function() {
			data.bgp.tuya = {};
			data.bgp.PI.part.img = data.bgp.PI.p.clone();
			data.bgp.PI.part.transparent = data.bgp.PI.p.clone().transparent();
			data.bgp.tuya.refreshColor = function(val) {
				data.bgp.tuya.color = val;
				tuya.color(val);
			};
			return this;
		},
		type: function(type) {
			// 类型: brush - 画笔, erase - 橡皮擦
			data.bgp.tuya.type = type;
			return this;
		},
		seal: function(seal) {
			// 印章图片地址
			data.bgp.tuya.seal = seal;
			return this;
		},
		opacity: function(val) {
			// 绘制的透明度 100 制
			data.bgp.tuya.opacity = parseInt(val, 10);
			return this;
		},
		bsize: function(val) {
			// 画笔大小
			data.bgp.tuya.bsize = parseInt(val, 10);
			return this;
		},
		setRandom: function(random) {
			data.bgp.tuya.random = random;
			return this;
		},
		setGetColor: function(getColor) {
			data.bgp.tuya.getColor = getColor;
			return this;
		},
		esize: function(val) {
			// 橡皮擦大小
			data.bgp.tuya.esize = parseInt(val, 10);
			data.bgp.setPenSize(val);
			return this;
		},
		clear: function(clear) {
			// 清除所有
			data.bgp.tuya.clear = clear;
			return this;
		},
		color: function(val) {
			data.bgp.tuya.color = val;
			$current.css({
				background: '#' + val
			}).attr('value', val);
			$currentColor.css({
				background: '#' + val
			}).attr('value', val);
			$input.val(val.toUpperCase());
			return this;
		},
		tranP: function(val) {
			$yinzhangTran.val(val);
			$yinzhangTranVal.text(val);
			return this;
		},
		sizeP: function(val) {
			$yinzhangSize.val(val);
			$yinzhangSizeVal.text(val);
			return this;
		},
		eraseP: function(val) {
			$yinzhangEraseSize.val(val);
			$yinzhangEraseSizeVal.text(val);
			return this;
		},
		brushP: function(brush) {
			if(brush) {
				$yinzhangitem1.show();
				$yinzhangitem2.hide();
			}else {
				$yinzhangitem1.hide();
				$yinzhangitem2.show();
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
	// 生成素材
	for (i = 1; i <= count; i++) {
		span = target.replace(/{index}/, i);
		span = span.replace(/{src}/, src + i + '.png');
		html.push(span);
	};
	// 类型切换
	$yinzhangTypeDiv.delegate('input', 'click', function() {

		var $this = $(this);

		$this.attr('id') == 'yinzhangType' ?
			tuya.type('brush').brushP(1) :
			tuya.type('erase').brushP(0).clear(false);

		tuya.reload();
	});
	// 印章素材
	$yinzhangContent.html(html.join('')).delegate('span', 'click', function() {

		var $this = $(this);

		$yinzhangContent.find('span[class="current"]').removeClass('current');
		$this.addClass('current');

		tuya.seal($this.find('img').attr('src')).reload();

	}).find('span:first').addClass('current');
	// 印章标题
	$yinzhangT.click(function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $(this),
			$first = $yinzhangContent.find('span:first');

		if($this.hasClass('current')) {

			tuya.setState('image');

		}else {
			var sealImg = $first.find('img').attr('src');
			var $input = $yinzhangColor.find('input');
			var random = $input.get(0).checked;
			var getColor = $input.get(1).checked;
			$yinzhangType.attr('checked', true);
			// 设置第一张图为当前印章
			$yinzhangContent.find('span[class="current"]').removeClass('current');
			$first.addClass('current');
			// 初始化控件值
			tuya.tranP(100).sizeP(100).eraseP(50).brushP(1);
			// 设置涂鸦对象
			tuya.init().type('brush').esize(50).bsize(100).opacity(100)
				.seal(sealImg).color('000000').setState('seal').setRandom(random).setGetColor(getColor);
		}

		tuya.reload();
	});
	function timeout(fn) {
		var self = this;
		clearTimeout(handle);
		handle = setTimeout(function() {
			fn(self);
		}, 200);
	};
	// 画笔大小
	$yinzhangSize.change(function() {
		timeout.bind(this)(function(self) {
			tuya.bsize(self.value).sizeP(self.value).reload();
		});
	});
	// 透明度
	$yinzhangTran.change(function() {
		timeout.bind(this)(function(self) {
			tuya.opacity(self.value).tranP(self.value).reload();
		});
	});
	// 橡皮擦
	$yinzhangEraseSize.change(function() {
		timeout.bind(this)(function(self) {
			tuya.esize(self.value).eraseP(self.value).reload();
		});
	});
	// 清除所有
	$yinzhangClear.click(function() {
		tuya.clear(true).reload();
	});
	// 功能按钮
	$yinzhang.delegate('span', 'click', function() {
		
		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'ok') {
			chrome.extension.sendMessage({ 
				cmd: 'button',
				type: 'partOk'
			});
		};
		tuya.push().setClick(true);

		$yinzhangT.click()
	});
	//随机颜色，取色
	$yinzhangColor.delegate('input', 'click', function() {

		var $this = $(this),
			cmd = $this.attr('cmd');

		if(cmd == 'random') {
			tuya.setRandom(this.checked);
		}else {
			tuya.setGetColor(this.checked).reload();
		}

	});

	$colorContent.html(data.colorList).delegate('span', 'mouseenter', function() {

		var  val = $(this).attr('value');

		// tuya.color(value);
		$current.css({
			background: '#' + val
		}).attr('value', val);
		$input.val(val.toUpperCase());

	}).delegate('.color', 'click', function() {

		var $this = $(this),
			color = $this.attr('value');

		tuya.color(color).reload();
	});

	$input.click(function() {

		return false;

	}).keyup(function() {

		var val = $(this).val();

		tuya.color(val);

	}).blur(function() {

		var val = $(this).val();

		if(val.length < 6 || val.length > 6) {
			tuya.color('000000');
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
	$('#yinzhangContentDiv .color').each(function(index, item) {

		var $item = $(item);

		$item.css({ background: '#' + $item.attr('value') })
	});
});