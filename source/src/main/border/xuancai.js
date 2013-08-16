require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$xuancaibkContent = $('#xuancaibkContent'),
		$xuancaibk = $('#xuancaibk'),
		$xuancaibkT = $('#xuancaibkT'),
		$xuancaibkitem = $('.xuancaibkitem'),
		$xuancaiopacity = $('#xuancaiopacity');

	var border = {
		proxySendMessage: function() {
			var opa = parseInt($(this).val(), 10) / 100;
			border.sendMessage(opa);
			return this;
		},
		sendMessage: function(opa) {
			clearTimeout(handle);
		
			handle = setTimeout(function(){
				chrome.extension.sendMessage({
					opacity: opa,
					cmd: 'scroll',
					type: 'opacity'
				});
			}, 100);
			return this;
		},
		setOpacity: function(val) {
			$xuancaiopacity.val(val);
			return this;
		},
		setClick: function(canClick) {
			data.canClick = canClick;
			return this;
		},
		push: function() {
			push();
			return this;
		},
		show: function() {
			$xuancaibkitem.show();
			return this;
		},
		hide: function() {
			$xuancaibkitem.hide();
			return this;
		}
	};

	// 素材点击
	$xuancaibkContent.delegate('img', 'click', function() {
		border.setClick(false).show().sendMessage(1).setOpacity(100);
		
		chrome.extension.sendMessage({
			cmd: 'border',
			type: 'xuancai',
			src: $(this).attr('src')
		});

	});
	// 功能按钮
	$xuancaibk.delegate('span', 'click', function() {

		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});

		border.push().setOpacity(100).setClick(true).hide();

		$xuancaibkT.click();
	});
	// 透明度
	$xuancaiopacity.change(border.proxySendMessage.bind($xuancaiopacity));
});