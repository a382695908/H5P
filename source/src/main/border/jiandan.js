require(['jquery', 'push', 'data'], function($, push, data) {

	var handle,
		$jiandanbkContent = $('#jiandanbkContent'),
		$jiandanbk = $('#jiandanbk'),
		$jiandanbkT = $('#jiandanbkT');

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
			$jiandanbk.show();
			return this;
		},
		hide: function() {
			$jiandanbk.hide();
			return this;
		}
	};
	// 素材点击
	$jiandanbkContent.delegate('span', 'click', function() {

		border.setClick(false).show();

		chrome.extension.sendMessage({
			cmd: 'border',
			type: 'jiandan',
			arg: jiandanConfing[$(this).attr('cmd')],
			src: jiandanConfing.src
		});

	});
	// 功能按钮
	$jiandanbk.delegate('span', 'click', function() {

		var type = $(this).attr('cmd');

		chrome.extension.sendMessage({
			cmd: 'button',
			type: type
		});

		border.push().setClick(true).hide();

		$jiandanbkT.click();
	});

	// 边框配置
	var jiandanConfing = {
		src: {
			more: 'assets/border/jiandan/{img}/Image {index} at frame 0.png',
			single: 'assets/border/jiandan/{img}.png'
		},
		1: {
			cmd: 'more',
			arg: [0,0,0,0],
			img: 1
		},
		2: {
			cmd: 'more',
			arg: [0,0,0,0],
			img: 2
		},
		4: {
			cmd: 'more',
			arg: [0,0,0,0],
			img: 4
		},
		5: {
			cmd: 'more',
			arg: [0,0,0,0],
			img: 5
		},
		6: {
			cmd: 'single',
			arg: {
				//X Y 重复大小
				RP : { x : 34, y : 0},
				//左上角大小
				LT : { w : 1, h : 45},
				//右下角大小
				RB : { w : 1, h : 45},
				//上右下左距离
				AS : { t : 34, r : 0, b : 45, l : 0}
			},
			img: 6
		},
		7: {
			cmd: 'single',
			arg: {
				//X Y 重复大小
				RP : { x : 23, y : 30},
				//左上角大小
				LT : { w : 80, h : 85},
				//右下角大小
				RB : { w : 221, h : 212},
				//上右下左距离
				AS : { t : 35, r : 143, b : 45, l : 37}
			},
			img: 7
		},
		8: {
			cmd: 'single',
			arg: {
				//X Y 重复大小
				RP : { x : 5, y : 8},
				//左上角大小
				LT : { w : 161, h : 158},
				//右下角大小
				RB : { w : 488, h : 301},
				//上右下左距离
				AS : { t : 34, r : 193, b : 46, l : 38}
			},
			img: 8
		},
		9: {
			cmd: 'single',
			arg: {
				//X Y 重复大小
				RP : { x : 8, y : 8},
				//左上角大小
				LT : { w : 161, h : 158},
				//右下角大小
				RB : { w : 488, h : 301},
				//上右下左距离
				AS : { t : 34, r : 193, b : 46, l : 38}
			},
			img: 9
		}
	};
});