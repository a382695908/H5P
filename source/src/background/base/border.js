function Border(canvas, args){
	this._CANVAS = canvas;
	this._ARGS = args;
};

Border.prototype = {

	process: function( callback ){
		this._CALLBACK = callback;
		return this;
	},
	single: function (img){

		var args = this._ARGS,
		    canvas = this._CANVAS,
		    newW = canvas.width  + args.AS.l + args.AS.r,
		    newH = canvas.height + args.AS.t + args.AS.b,
			layer = document.createElement('canvas'),
		    layerContext = layer.getContext('2d'),
		    i,
		    length,
		    cut,
		    ft,
		    fb,
		    fl,
		    fr,
		    fragment;
	
		layer.width = newW;
		layer.height = newH;
	
		function cutFn(img) {
			return function (x, y, w, h){
	
				var fragment = document.createElement('canvas'),
				    fragmentContext = fragment.getContext('2d');
	
				fragment.width = w;
				fragment.height = h;
				fragmentContext.drawImage(img, x, y, w, h, 0, 0, w, h);
	
				return fragment;
			}
		};
		//绘制原图
		layerContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
								args.AS.l, args.AS.t, canvas.width, canvas.height);
	
		cut = cutFn(img);
	
		if(args.RP.x != 0) {
			//绘制上下空隙
			ft = cut(args.LT.w, 0, args.RP.x, args.LT.h);
			fb = cut(args.LT.w, img.height - args.RB.h, args.RP.x, args.RB.h);
	
			for (i = args.LT.w, length = newW - args.RB.w; i < length; i += args.RP.x) {
				layerContext.drawImage(ft, 0, 0, ft.width, ft.height,
										   i, 0, ft.width, ft.height);
				layerContext.drawImage(fb, 0, 0, fb.width, fb.height,
						                   i, newH - args.RB.h, fb.width, fb.height);	
			};
		};
	
		if(args.RP.y != 0){
			//绘制左右空隙
			fl = cut(0, args.LT.h, args.LT.w, args.RP.y);
			fr = cut(img.width - args.RB.w, args.LT.h, args.RB.w, args.RP.y);
		
			for (i = args.LT.h, length = newH - args.RB.h; i < length; i += args.RP.y) {
				
				layerContext.drawImage(fl, 0, 0, fl.width, fl.height,
										   0, i, fl.width, fl.height);
				layerContext.drawImage(fr, 0, 0, fr.width, fr.height,
						                   newW - args.RB.w, i, fr.width, fr.height);	
			};
		};
	
		//绘制右上角
		fragment = cut(img.width - args.RB.w, 0, args.RB.w, args.LT.h);
		layerContext.drawImage( fragment, 0, 0, fragment.width, fragment.height,
								newW - args.RB.w, 0, fragment.width, fragment.height);
		//绘制左下角
		fragment = cut(0, img.height - args.RB.h, args.LT.w, args.RB.h);
		layerContext.drawImage( fragment, 0, 0, fragment.width, fragment.height,
								0, newH - args.RB.h, fragment.width, fragment.height);
		//绘制左上角
		fragment = cut(0, 0, args.LT.w, args.LT.h);
		layerContext.drawImage( fragment, 0, 0, fragment.width, fragment.height,
								0, 0, fragment.width, fragment.height);
		//绘制右下角
		fragment = cut(img.width - args.RB.w, img.height - args.RB.h, args.RB.w, args.RB.h);
	
		layerContext.drawImage( fragment, 0, 0, fragment.width, fragment.height,
								newW - args.RB.w, newH - args.RB.h, fragment.width, fragment.height);
	
		if(typeof this._CALLBACK == 'function') this._CALLBACK.bind(layer)();
	},
	more: function (imgList){

		var args = this._ARGS,
		    canvas = this._CANVAS,
		    layer = document.createElement('canvas'),
		    layerContext = layer.getContext('2d');

		layer.width  = canvas.width + args[1] + args[3];
		layer.height = canvas.height + args[0] + args[2];

		layerContext.drawImage(canvas, 0, 0, canvas.width, canvas.height,
							args[3], args[0], canvas.width, canvas.height);

		for (var i = imgList[ 8 ].height; i < canvas.height - imgList [ 2 ].height; i += imgList[ 5 ].height) {
			layerContext.drawImage(imgList[ 5 ], 0, 0, imgList[ 5 ].width, imgList[ 5 ].height,
								0, i, imgList[ 5 ].width, imgList[ 5 ].height);
			layerContext.drawImage(imgList[ 3 ], 0, 0, imgList[ 3 ].width, imgList[ 3 ].height,
								canvas.width - imgList[ 3 ].width, i, imgList[ 3 ].width, imgList[ 3 ].height);	
		};

		for (var i = imgList[ 8 ].width; i < canvas.width - imgList[ 6 ].width; i += imgList[ 7 ].width) {
			layerContext.drawImage(imgList[ 1 ], 0, 0, imgList[ 1 ].width, imgList[ 1 ].height,
								i, canvas.height - imgList[ 1 ].height, imgList[ 1 ].width, imgList[ 1 ].height);
			layerContext.drawImage(imgList[ 7 ], 0, 0, imgList[ 7 ].width, imgList[ 7 ].height,
								i, 0, imgList[ 7 ].width, imgList[ 7 ].height);	
		};
		layerContext.drawImage(imgList[ 8 ], 0, 0, imgList[ 8 ].width, imgList[ 8 ].height,
								0, 0, imgList[ 8 ].width, imgList[ 8 ].height );
		layerContext.drawImage(imgList[ 6 ], 0, 0, imgList[ 6 ].width, imgList[ 6 ].height,
								canvas.width - imgList[ 6 ].width, 0, imgList[ 6 ].width, imgList[ 6 ].height);
		layerContext.drawImage(imgList[ 2 ], 0, 0, imgList[ 2 ].width, imgList[ 2 ].height,
								0, canvas.height - imgList[ 2 ].height, imgList[ 2 ].width, imgList[ 2 ].height);
		layerContext.drawImage(imgList[ 0 ], 0, 0, imgList[ 0 ].width, imgList[ 0 ].height,
										canvas.width - imgList[ 0 ].width, canvas.height - imgList[ 0 ].height, imgList[ 0 ].width, imgList[ 0 ].height);
		if(typeof this._CALLBACK == 'function') this._CALLBACK.bind(layer)();
	},
	draw: function(img){

		var args = this._ARGS,
		    canvas = this._CANVAS,
		    layer = document.createElement('canvas'),
		    layerContext = layer.getContext('2d'),
		    imageData,
		    data,
		    lc;

		layer.width = img.width;
		layer.height = img.height;
		layerContext.drawImage(img, 0, 0);

		if(args) {
			imageData = layerContext.getImageData(0, 0, img.width, img.height);
			data = imageData.data;

			for (var i = 0, length = data.length; i < length; i += 4) {
				if(data[i + 3] != 0) {
					data[i] = args.r;
					data[i + 1] = args.g;
					data[i + 2] = args.b;
				};
			};

			layerContext.putImageData(imageData, 0, 0, 0, 0, img.width, img.height);
		};

		lc = document.createElement('canvas');
		lc.width = canvas.width;
		lc.height= canvas.height;
		lc.getContext('2d').drawImage( canvas, 0, 0);
		lc.getContext('2d').drawImage( layer, 0, 0, layer.width, layer.height,
											  0, 0, lc.width, lc.height);
		if( typeof this._CALLBACK == 'function') this._CALLBACK.bind(lc)();
	}
	// onProcess: function (img){

	// 	var self = this,
	// 		args = this._ARGS,
	// 		canvas = this._CANVAS,
	// 		map = Map.get(canvas),
	// 		count = map.length,
	// 	    worker = [];
	
	// 	var workerProcess = function() {
	
	// 		return workerWrap(function() {
	
	// 			function screen(b, u, o){
	// 				var r=255-(255-b)*(255-u) / 255;
	// 				return r * o + b * (1 - o);
	// 			};
	
	// 			onmessage = function (e){
	// 				var t = new Date().getTime(),
	// 					dataList = e.data,
	// 					imageData = dataList.imageData,
	// 					data = imageData.data,
	// 					layer = dataList.layerData,
	// 					i, length, o;
	
	// 				for (i = 0, length = data.length; i < length; i += 4 ) {
	// 					o = layer[i + 3] / 255;
	// 					data[i] = screen (data[i], layer[i], o);
	// 					data[i + 1] = screen (data[i + 1], layer[i + 1], o);
	// 					data[i + 2] = screen (data[i + 2], layer[i + 2], o);
	// 				};
	
	// 				postMessage({
	// 					map: dataList.map,
	// 					imageData: imageData,
	// 					time: new Date().getTime() - t
	// 				});
	// 			};
	
	// 		});
	// 	};
		
	// 	var lc = document.createElement('canvas'),
	// 	  	lcContext = lc.getContext('2d'),
	// 	  	rCount = 0;

	// 	lc.width = canvas.width;
	// 	lc.height= canvas.height;
	// 	lcContext.drawImage(canvas, 0, 0);

	// 	while(count--){
	
	// 		var w = workerProcess();
	
	// 		w.onmessage = function(e) {
	// 			var dataList = e.data;
	// 			var imageData = dataList.imageData;
	// 			var map = dataList.map;
	// 			lcContext.putImageData(imageData,map.left,
	// 											map.top,0,0,
	// 											map.width,
	// 											map.height);
	// 			this.onmessage = null;
	// 			this.terminate();
	// 			// console.log(dataList.time);
	// 			rCount ++;
	// 			if(rCount == worker.length) {
	// 				if( typeof self._CALLBACK == 'function') self._CALLBACK.bind(lc)();
	// 			}
	// 		};

	// 		worker.push(w);
	// 	};

	// 	var layer = document.createElement('canvas'),
	//  	 	layerContext = layer.getContext('2d'),
	//  	 	count = map.length,
	//  	 	w, m;

	//     layer.width  = canvas.width;
	//     layer.height = canvas.height;
	//     layerContext.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

	// 	while(count--) {

	// 		w = worker[count];
	// 		m = map[count];

	// 		w.postMessage({ 
	// 			map: m,
	// 			imageData: lcContext.getImageData(m.left, m.top, m.width, m.height),
	// 			layerData: layerContext.getImageData(m.left, m.top, m.width, m.height).data
	// 		});
	// 	};
	// }

};