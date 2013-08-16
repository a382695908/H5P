/*
 * 用户worker包装器
 * @param mapList {array[Map]}
 * @param processFn {workerProcess.fn1}
 */
function UserWorker(mapList, processFn) {

    var count = mapList.length;
    this.__mapList = mapList;
    this.__workList = [];

    while(count--){
    	this.__workList.push(this.__wrap__(processFn));
    };

    this.__isReady = false;
};
UserWorker.prototype = {
	
	__wrap__: function() {
	
	    var functionBodyRegx, URL, contentType, code, url;
	
	    functionBodyRegx = /function[^(]*\([^)]*\)\s*\{([\s\S]*)\}/;
	    URL = window.URL || window.webkitURL;
	    contentType = { type: "text/javascript; charset=utf-8" };
	    
	    return function(fn) {
	
	        code = fn.toString().match(functionBodyRegx)[1];
	        url = window.opera ? 
	            "data:application/javascript," + encodeURIComponent(code) :
	            URL.createObjectURL(new Blob([code], contentType));
	
	        return new Worker(url);
	    }
	}(),

	stop: function() {
	
	    this.__workList.forEach(function(worker, index) {
	    	worker.onMessage = null;
	        worker.terminate();
	    });
	
	    return this;
	},

	onmessage: function(postMsg, updateMsgFn, callback) {
		// 设置线程参数
		this.__postMsg = postMsg;
		// 回调设置更多线程参数
		this.__updateMsgFn = updateMsgFn || function(){};
		// 线程执行完毕回调
		this.__callbackFn = callback || function(){};
		// 注册了onmessage事件
		this.__isReady = true;
	    
	    return this;
	},
	
	message: function(){
	
		if(this.__isReady){
	
			var self = this,
			    callbackData = [],
			    returnCount = 0,
			    count = self.__mapList.length;
			// 遍历地图数组
			this.__mapList.forEach(function(map,index){
	
				var worker = self.__workList[ index ];
				// 设置更多参数，传入地图导航取数据
				self.__updateMsgFn.bind( self.__postMsg )( map );
				// 设置参数地图
				self.__postMsg.map = map;
				// 监听接受到线程数据函数
				worker.onmessage = function(e){
					var data = e.data,
					    map  = data.map,
					    layer = data.baseLayer;
					// 将返回结果压入数组
					callbackData.push({
						map: map,
						layer: layer
					});
					// 判断是否返回指定次数
					if((++returnCount) == count){
						// 调用onmessage中的callback
						self.__callbackFn.bind(callbackData)();
						// 删除worker线程
						self.stop();
					};
				};
				// 发送数据
				worker.postMessage(self.__postMsg);
			});
		};
	
		return this;
	}
};