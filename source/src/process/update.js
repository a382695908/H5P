Process.prototype.update = function(w, h, l, t) {
	chrome.extension.sendMessage({ 
		cmd:'updateProcess', 
		width: w,
		height: h,
		left: l,
		top: t
	});
}