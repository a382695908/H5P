function Rotate (canvas, isCut) {
	this._ISCUT = isCut;
	this._IMG   = canvas.clone();
};

Rotate.prototype = {	

	process: function(callback) {
		this._CALLBACK = callback;
		return this;
	},

	rotate : function(deg){
		//旋转参数
		var	oldSize = this._IMG.getSize().clone(),
		    canvas = document.createElement('canvas'),
		    cp = new Point(oldSize.width / 2, oldSize.height / 2),
		    hudu = (2 * Math.PI / 360) * deg,
		    drawcanvas = document.createElement('canvas');

		drawcanvas.width  = oldSize.width;
		drawcanvas.height = oldSize.height;
		drawcanvas.getContext('2d').drawImage(this._IMG.get(), 0, 0 );

		//图片4角坐标
		var p1 = new Point(0, 0).rotate(cp, deg).round(),
		  	p2 = new Point(oldSize.width, 0).rotate(cp, deg).round(),
 		  	p3 = new Point(0, oldSize.height).rotate(cp, deg).round(),
 		  	p4 = new Point(oldSize.width, oldSize.height).rotate(cp, deg).round();
 		
		//旋转前后大小
		var newSize ;
	
		if( deg > 0 && deg <= 90 ){
			newSize = new Size( Math.ceil( p2.x - p3.x ), Math.ceil( p4.y - p1.y ) );
		}else if( deg > 90 && deg <= 180 ){
			newSize = new Size( Math.ceil( p1.x - p4.x ), Math.ceil( p2.y - p3.y ) );
		}else if( deg > 180 && deg <= 270 ){
			newSize = new Size( Math.ceil( p3.x - p2.x ), Math.ceil( p1.y  - p4.y) );
		}else{
			newSize = new Size( Math.ceil( p4.x - p1.x ), Math.ceil( p3.y  - p2.y) );
		}
	
		//记录旋转后图片
		var layer = document.createElement('canvas'),
		    layerContext = layer.getContext('2d');
	
		layer.width = newSize.width;
		layer.height = newSize.height;
	
		if( deg > 0 && deg <= 90 ) layerContext.translate(p1.x - p3.x, 0);
		else if( deg > 90 && deg <= 180 ) layerContext.translate(newSize.width, p1.y - p3.y);
		else if( deg > 180 && deg <= 270 ) layerContext.translate(p1.x - p2.x , newSize.height);
		else layerContext.translate(0 , p1.y - p2.y);
	
		layerContext.rotate(hudu);
		layerContext.drawImage(drawcanvas, 0, 0);
		
		if(this._ISCUT){
			//获取裁剪图片
			var widthRate = newSize.width / oldSize.width,
				heightRate = newSize.height / oldSize.height,
				rate = Math.max( widthRate, heightRate ),
				adaptiveScale = 1 / rate,
				drawSize = oldSize.scale( adaptiveScale ).floor(),
				diffSize = newSize.sub( drawSize ).scale( 0.5 ).ceil();
		
			if( deg == 90 || deg == 270 ){
				drawSize = newSize.clone();
				diffSize = new Size(0, 0); 
			}
		
			canvas.width = drawSize.width;
			canvas.height = drawSize.height;
			canvas.getContext('2d').drawImage(layer, diffSize.width, diffSize.height, drawSize.width, drawSize.height,
								  0, 0, drawSize.width, drawSize.height);
			// canvas.width = layer.width;
	
			// canvas.height = layer.height;
		
			// canvas.getContext('2d').drawImage( layer, 0, 0 );
			// canvas.getContext('2d').clearRect( diffSize.width, diffSize.height, drawSize.width, drawSize.height);

		}else{
			
			canvas.width = layer.width;
			canvas.height = layer.height;
			canvas.getContext('2d').drawImage(layer, 0, 0);
		};

		if( typeof this._CALLBACK == 'function') this._CALLBACK.bind(canvas)();
		return this;
	},

	draw : function(horizonta){
		
		var clone = this._IMG.clone(),
			canvas = clone.get(),
   		 	context = clone.getContext(),
   		 	size = clone.getSize(),
   		 	width = size.width,
   		 	height= size.height,
   		 	img = this._IMG.get();

   		if(horizonta){
   		 	// 水平翻转
   			for (var i = 0; i <= width; i++) {
   			     context.drawImage(img,i,0,1,height, width - i - 1,0,1,height);
   			};
   		}else{
   			// 垂直翻转
   			for (var i = 0; i <= height; i++) {
    		    context.drawImage(img,0,i,width,1, 0,height - i - 1,width,1);
    		};
   		};
   	 
   		if( typeof this._CALLBACK == 'function') this._CALLBACK.bind(canvas)();
   		return this;
	}
};