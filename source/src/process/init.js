Process.prototype.init = function() {
	
	var data = this.data,
		stateStr = data.bgp.getState(),
		state = this.state(),
		fn = state[stateStr];

	fn ? fn() : state.close();

	// 自动获取焦点
	$(document).mouseover(function() {
		chrome.extension.sendMessage({
			cmd: 'createProcess', 
			state: data.bgp.getState()
		});
	});
};

new Process().init();



