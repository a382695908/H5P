require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$xuanzhuangT = $('#xuanzhuangT'),
		$xuanzhuang = $('#xuanzhuang'),
		$rotateBtn = $('#rotateBtn'),
		$rotate = $('#rotate'),
		$rotateTxt = $('#rotateTxt');

	var rotate = {
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		push: function() {
			push();
			return this;
		},
		show: function() {
			$xuanzhuang.show();
			return this;
		},
		hide: function() {
			$xuanzhuang.hide();
			this.setTxt(0).arg = {
				deg: 0,
				horizonta: false,
				vertical: false
			};
			$rotate.val(0);
			return this;
		},
		setTxt: function(val) {
			$rotateTxt.text(val);
			return this;
		},
		arg:{
			deg: 0,
			horizonta: false,
			vertical: false
		},
		sendMessage: function() {
			rotate.setClick(false).show();

			var deg = (rotate.arg.deg + parseInt($rotate.val(), 10));

			deg = ((deg % 360) + 360) % 360;

			chrome.extension.sendMessage({
				cmd: 'rotate',
				arg: rotate.arg,
				deg: deg
			});

			console.log(deg)
			return this;
		}
	};
	$rotate.change(function() {
		rotate.setTxt($rotate.val());
		clearTimeout(handle);
		handle = setTimeout(function() {
			rotate.sendMessage();
		}, 36);
	});
	// 旋转按钮
	$rotateBtn.delegate('span', 'click', function() {

		var cmd = $(this).attr('cmd');

		switch(cmd) {
			case 'l':
				rotate.arg.deg -= 90;
				break;
			case 'r':
				rotate.arg.deg += 90;
				break;
			case 'h':
				rotate.arg.horizonta = !rotate.arg.horizonta;
				break;
			case 'v':
				rotate.arg.vertical = !rotate.arg.vertical;
				break;
		}
		rotate.sendMessage();
	});
	// 功能按钮
	$xuanzhuang.delegate('span', 'click', function() {

		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});

		rotate.push().setClick(true).hide();

		$xuanzhuangT.click();
	});

});