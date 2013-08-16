// 整个应用
/*
 * 主后台处理类
 */
function Background() {
	/*
	 * 属性 : 存储当前图像	
	 */
	this.PI = { 
		o: null, // 原图
		p: null, // 上一步图片
		n: null,  // 下一步图片，当前处理图片
		part: {}
	};
	/*
	 * 属性 : 存储当前窗体
	 */
	this.FORM =  {
		fMain: new FormMain(), // 主窗体
		fProcess: new FormProcess()// 处理窗体 
	};
	/*
	 * 属性 : 储存历史记录
	 */
	this.queue = new Queue();

	this.FORM.core = new Core(this.PI, this.FORM, this.queue)
	// 配置特效步骤
	this.FORM.core.speciallyConfig = speciallyConfig;

	var self = this;
	/*
	 * 注册主窗体网页加载图片成功事件
	 */
	this.FORM.fMain.oninit(function(){
	
		self.setPI(this).reload();
	});

};

Background.prototype = {

	chromeinit: function() {

		var self = this;
		//浏览器事件
		/*
		 * 注册鼠标右键图片事件
		 */
		chrome.contextMenus.create({
		 	title: "H5P",
		  	type: "normal",
		 	contexts: ["image"],
		    onclick: (function(){
			  	return function(info, tab) {
			  		//发送创建主窗体请求
			  		//带默认图片
					chrome.extension.sendMessage({ 
						cmd:'createMain', 
						src: info.srcUrl 
					});
		  		};
		  	})()
		});
		/*
		 * 注册图标点击事件
		 */
		chrome.browserAction.onClicked.addListener(function(tab) {
			//发送创建主窗体请求
			//不带默认图片
			chrome.extension.sendMessage({cmd:'createMain'});
		});
		/*
		 * 注册应用接受到请求事件
		 */
		chrome.extension.onMessage.addListener(function(request, sender, callback) {
			for(var obj in self.FORM){ 
				var form = self.FORM[obj];
				if(form.execCmd) form.execCmd(request);
			};
		});
		/*
		 * 注册窗体关闭事件
		 */
		chrome.windows.onRemoved.addListener(function(winId) {
			
			if(winId == self.FORM.fMain.getId()) {

				self.FORM.fMain.dispose(winId);

			}else if(winId == self.FORM.fProcess.getId()) {
				// 关闭处理窗体，刷新主窗体
				self.FORM.fMain.reload();
				self.FORM.fProcess.dispose(winId);
			};

		});
	
		return this;
	},

	clearQueue: function() {
		this.queue.clear();
		return this;
	},
	setPI: function(img){
		// 设置当前处理图片
		this.PI.o = new Canvas(new Adapter(img).get());
		this.PI.p = new Canvas(new Adapter(img).get());
		this.PI.n = new Canvas(new Adapter(img).get());
		this.queue.clear();
		return this;
	},

	setState: function(state) {
		if(this.FORM.fProcess) {
			this.FORM.fProcess.setState(state);
		}
		return this;
	},

	getState: function() {

		return this.FORM.fProcess.getState();
	},

	reload: function() {
		if(this.FORM.fMain) {
			this.FORM.fMain.reload();
		}
		if(this.FORM.fProcess) {
			this.FORM.fProcess.reload();
		}
		return this;
	},

	
	// 局部处理时候用到的API

	setPenType: function(type) {

		this.PI.part.penType = type;
		return this;
	},

	getPenType: function() {

		return this.PI.part.penType;
	},

	setPenSize: function(size) {

		this.PI.part.penSize = size;
		return this;
	},

	getPenSize: function() {

		return parseInt(this.PI.part.penSize, 10);
	},
	// 记录操作
	setTransparent: function(canvas) {

		this.PI.part.transparent = new Canvas(canvas);
		return this;
	}
};


var bgp = new Background();

bgp.chromeinit();