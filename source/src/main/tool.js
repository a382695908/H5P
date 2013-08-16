// 底部工具栏
require(['jquery', 'data', 'refresh'], function($, data, refresh) {

	var queue = data.bgp.queue,
		$footer = $('#footer'),
		contrast;

	refresh();

	$footer.delegate('span', 'click', function() {
		if(!data.canClick) {
			return false;
		}
		var $this = $(this),
			cmd = $this.attr('cmd'),
			result,
			original = false;

		if($this.hasClass('disable')) {
			return;
		}

		switch(cmd) {
			case 'revoke':
				result = queue.revoke();
				data.bgp.PI.p = result.data.clone();
				data.bgp.PI.n = result.data.clone();
				data.bgp.FORM.fProcess.reload();
				break;
			case 'redo':
				result = queue.redo();
				data.bgp.PI.p = result.data.clone();
				data.bgp.PI.n = result.data.clone();
				data.bgp.FORM.fProcess.reload();
				break;
			case 'original':
				queue.push(data.bgp.PI.o.clone());
				data.bgp.PI.p = data.bgp.PI.o.clone();
				data.bgp.PI.n = data.bgp.PI.o.clone();
				data.bgp.FORM.fProcess.reload();
				original = true;
				break;
			default:
		};

		refresh();

		if(original) {
			$this.addClass('disable');
		}
	}).find('span[cmd="contrast"]').mousedown(function() {
		contrast = true;
		data.bgp.PI.n = data.bgp.PI.o.clone();
		data.bgp.FORM.fProcess.reload();
	});
	$(document).mouseup(function() {
		if(contrast) {
			data.bgp.PI.n = data.bgp.PI.p.clone();
			data.bgp.FORM.fProcess.reload();
			contrast = false;
		}
	})

});