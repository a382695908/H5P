/*
 * 主窗体类
 */
function FormMain() {

	this._id = null;
};
FormMain.prototype = {

	__createMain__: function(request) {
		
		var self = this,
			img;
		// 判断是否存在主窗体
		if(self._id || request.focuse){
			// 更新获取焦点
			chrome.windows.update( 
				self._id,
				{ focused : true } 
			);
		}else{
			// 创建主窗体
			chrome.windows.create({
				url: 'main.html',
				width: 235,
				height: 600,
				left: 30,
				top: 30,
				focused: true,
				type: 'popup'
			},function( win ){ 
				// 设置窗体ID
				self._id = win.id;
			});
		};
		// 从页面右键图片入口
		if(request.src){
	
			img = new Image;
			img.onload = function(){
				this.onload = null;
				if(self._callback){
					// 加载成功回调
					self._callback.bind( this )();
				}
			};
			img.src = request.src;
		};
		return this;
	},

	execCmd: function(request){
		
		var fn = this['__'+request.cmd+'__'];
		if(fn) fn.bind(this)(request);
		return this;
	},

	oninit: function(callback) {
	
		this._callback = callback;
		return this;
	},

	getId: function(){
	
		return this._id;
	},

	dispose: function(id){
	
		if(id == this._id){
			this._id = null;
			chrome.extension.sendMessage({cmd : 'cancel'});
		}
		return this;
	},
	
	reload: function() {

		new Reload(this).reload();
		return this;
	}
};
