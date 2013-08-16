/*
 * 主处理窗体类
 */
var FormProcess = function(){
	
	this._id = null;
	// 窗体当前处于何种状态
	// medio - 处于拍摄状态
	// file  - 处于打开文件状态
	// image - 处于打开图片状态
	this._state = null;
};
FormProcess.prototype = {
	
	__createProcess__: function(request) {
		
		var self = this;
		
		if(this._state != request.state || !self._id){
			if(self._id) chrome.windows.remove( self._id );
			chrome.windows.create({
				url: 'process.html',
				width: request.width,
				height: request.height,
				left: request.left,
				top: request.top,
				type: 'popup'
			},function( win ){ 
				self._id = win.id;
			});
		}else{
			chrome.windows.update(self._id, {focused: true});
		};
	
		this._state = request.state;
		return this;
	},

	__updateProcess__: function(request) {
	
		chrome.windows.update( this._id,{ 
			width: request.width,
			height: request.height,
			left: request.left,
			top: request.top
		});
		return this;
	},

	execCmd: function(request) {
	
		var fn = this['__'+request.cmd+'__'];
		if(fn) fn.bind(this)(request);
		return this;
	},

	getId: function() {
	
		return this._id;
	},

	getState: function() {
	
		return this._state;
	},

	setState: function(state) {
		
		this._state = state;
		return this;
	},

	dispose: function(id) {
		
		if(id == this._id){
			this._id = null;
			this._state = null;
		}
		return this;
	},

	reload: function() {

		new Reload(this).reload();
		return this;
	}
};
