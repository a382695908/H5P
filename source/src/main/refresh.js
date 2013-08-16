// 刷新底部工具栏按钮是否可用
define('refresh', ['jquery', 'data'], function($, data) {

	var queue = data.bgp.queue,
		$span = $('#footer span');

	return function() {

		var count = queue.count(),
			revoke = queue.canRevoke(),
			redo = queue.canRedo();

		if(count > 0) {	

			revoke ? 
				$span.eq(0).removeClass('disable') :
				$span.eq(0).addClass('disable');

			redo ?
				$span.eq(1).removeClass('disable') :
				$span.eq(1).addClass('disable');

			!revoke & !redo?
				$span.eq(2).addClass('disable') :
				$span.eq(2).removeClass('disable');

			$span.eq(3).removeClass('disable');
		}
	}

});