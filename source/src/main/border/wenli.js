require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$wenlibkContent = $('#wenlibkContent'),
		$wenlibk = $('#wenlibk'),
		$wenlibkT = $('#wenlibkT'),
		$wenlibkColor = $('#wenlibkColor');

	var border = {
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		push: function() {
			push();
			return this;
		},
		show: function() {
			$wenlibk.show();
			$wenlibkColor.show();
			return this;
		},
		hide: function() {
			$wenlibk.hide();
			$wenlibkColor.hide();
			return this;
		},
		src: 'assets/border/wenli/{img}.png',
		arg: {
			img: null,
			arg: null
		}
	};
	// 更换颜色
	$wenlibkColor.delegate('span', 'click', function() {

		border.arg.arg = $(this).attr('value');

		chrome.extension.sendMessage({
			cmd: 'border',
			type: 'wenli',
			src: border.src,
			arg: border.arg
		});
	}).find('span').each(function(index, item) {
		var $item = $(item);

		$item.css({ background: '#' + $item.attr('value') })
	});
	// 素材点击
	$wenlibkContent.delegate('span', 'click', function() {

		border.setClick(false).show();

		border.arg.img = $(this).attr('cmd');
		border.arg.arg = 'cccccc';

		chrome.extension.sendMessage({
			cmd: 'border',
			type: 'wenli',
			src: border.src,
			arg: border.arg
		});

	});
	// 功能按钮
	$wenlibk.delegate('span', 'click', function() {

		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});

		border.push().setClick(true).hide();

		$wenlibkT.click();
	});
});