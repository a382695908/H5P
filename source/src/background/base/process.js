/*
 * worker的processFn枚举
 */
var workerProcess = {

	filter: function() {
		
		var H5P = function () {
			if(!(this instanceof H5P))
				return new H5P();
		};
		
		H5P.prototype.base = function(data) {
			var baseLayer   = data.baseLayer;
			var baseData    = baseLayer.data;
			var baseLength  = baseData.length;
		
			var brightness  = data.brightness / 100 + 1;
			var contrast    = data.contrast / 100 + 1;
		
			var meanGray = 127.5;
		
			for (var i = 0; i < baseLength; i+=4) {
				baseData[i] = (((baseData[i] - meanGray) * contrast) + meanGray) * brightness;
				baseData[i + 1] = (((baseData[i + 1] - meanGray) * contrast) + meanGray) * brightness;
				baseData[i + 2] = (((baseData[i + 2] - meanGray) * contrast) + meanGray) * brightness;
			};
			return baseLayer;
		};
		
		H5P.prototype.balance = function(cyan, magenta, yellow, mode) {
			var 
		       cyan_ren      = [0,0,0]
		     , magenta_green = [0,0,0]
		     , yellow_blue   = [0,0,0];
		
		  	cyan_ren[mode]      = cyan;
		  	magenta_green[mode] = magenta;
		  	yellow_blue[mode]   = yellow;
		
		  		var highlights_add = new Array(256)
		   	  , midtones_add   = new Array(256)
		   	  , shadows_add    = new Array(256)
		   	  , highlights_sub = new Array(256)
		   	  , midtones_sub   = new Array(256)
		   	  , shadows_sub    = new Array(256);
			
		  		var pow;
		  		for (var i = 0; i < 256; i++) {
		   	    pow = Math.pow((i - 127) / 127,2);
		   	    highlights_add[i] = shadows_sub[255 - i] = (1.075 - 1 / ( i / 16 + 1));
		   	    midtones_add[i]   = midtones_sub[i]      = 0.667 * (1 - pow);
		   	    shadows_add[i]    = highlights_sub[i]    = 0.667 * (1 - pow);
		  		};
		  
		
		  	var cyan_ren_transfer      = []
		  	  , magenta_green_transfer = []
		  	  , yellow_blue_transfer   = [];
		
		  	var r_lookup = new Uint8ClampedArray(256)
		  	  , g_lookup = new Uint8ClampedArray(256)
		  	  , b_lookup = new Uint8ClampedArray(256);
		
		  	cyan_ren_transfer[0] = cyan_ren[0] > 0 ? shadows_add    : shadows_sub;
		  	cyan_ren_transfer[1] = cyan_ren[1] > 0 ? midtones_add   : midtones_sub;
		  	cyan_ren_transfer[2] = cyan_ren[2] > 0 ? highlights_add : highlights_sub;
		
		  	magenta_green_transfer[0] = magenta_green[0] > 0 ? shadows_add    : shadows_sub;
		  	magenta_green_transfer[1] = magenta_green[1] > 0 ? midtones_add   : midtones_sub;
		  	magenta_green_transfer[2] = magenta_green[2] > 0 ? highlights_add : highlights_sub;
		
		  	yellow_blue_transfer[0] = yellow_blue[0] > 0 ? shadows_add    : shadows_sub;
		  	yellow_blue_transfer[1] = yellow_blue[1] > 0 ? midtones_add   : midtones_sub;
		  	yellow_blue_transfer[2] = yellow_blue[2] > 0 ? highlights_add : highlights_sub;
		
		  	var red,green,blue;
		
		  	for (var i = 0; i < 256; i++) {
		  	    red   = i;
		  	    green = i;
		  	    blue  = i;
		
		  	    red += cyan_ren[0] * cyan_ren_transfer[0][red] + cyan_ren[1] * cyan_ren_transfer[1][red] + cyan_ren[2] * cyan_ren_transfer[2][red];
		
		  	    green += magenta_green[0] * magenta_green_transfer[0][green] + magenta_green[1] * magenta_green_transfer[1][green] + magenta_green[2] * magenta_green_transfer[2][green];
		
		  	    blue += yellow_blue[0] * yellow_blue_transfer[0][blue] + yellow_blue[1] * yellow_blue_transfer[1][blue] + yellow_blue[2] * yellow_blue_transfer[2][blue];
		
		  	    r_lookup[i] = Math.round(red);
		  	    g_lookup[i] = Math.round(green);
		  	    b_lookup[i] = Math.round(blue);
		  	};
		
		  	return {
		  	    r : r_lookup,
		  	    g : g_lookup,
		  	    b : b_lookup
		  	};
		};
		
		H5P.prototype.curve = function(pt, pointCount) {
			var color  = new Uint8ClampedArray(256);
			var controlPoint = [];
		
			var m_resultPointArray = [];
			var precision = 1;
		
			for (var i = 0,length = pt[0].x; i < length; i++) {
				color[i] = pt[0].y;
			};
		
			for (var i = pt[pointCount - 1].x; i < 256; i++) {
				color[i] = pt[pointCount -1].y;
			};
		
			if(pointCount == 3){
				for (var i = 0; i < 3; i++) {
					if(i != 1){
						controlPoint.push({
							x:pt[i].x,
							y:pt[i].y
						});
					}
					else{
						controlPoint.push({
							x:(6 * pt[1].x - pt[i - 1].x - pt[i + 1].x) / 4,
							y:(6 * pt[i].y - pt[i - 1].y - pt[i + 1].y) / 4
						});
					}
				};	
			}
			else{
				var diag = [];
				var sub  = [];
				var sup  = [];
		
				for (var i = 0; i < pointCount; i++) {
					controlPoint.push({
						x:pt[i].x,
						y:pt[i].y
					});
					diag.push(4);
					sub.push(1);
					sup.push(1);
				};
		
				controlPoint[1].x = 6 * controlPoint[1].x - controlPoint[0].x;
				controlPoint[1].y = 6 * controlPoint[1].y - controlPoint[0].y;
				controlPoint[pointCount - 2].x = 6 * controlPoint[pointCount - 2].x - controlPoint[pointCount - 1].x;
				controlPoint[pointCount - 2].y = 6 * controlPoint[pointCount - 2].y - controlPoint[pointCount - 1].y;
		
				for (var i = 2,length = pointCount - 2; i < length; i++) {
					controlPoint[i].x = 6 * controlPoint[i].x;
					controlPoint[i].y = 6 * controlPoint[i].y;
				};
				//高斯消隐1到n-2行
				for (var i = 2,length = pointCount - 1; i < length; i++) {
					sub[i] = sub[i] / diag[i - 1];
					diag[i]= diag[i] - sub[i] * sup[i - 1];
					controlPoint[i].x = controlPoint[i].x - sub[i] * controlPoint[i - 1].x;
					controlPoint[i].y = controlPoint[i].y - sub[i] * controlPoint[i - 1].y;
				};
		
				controlPoint[pointCount - 2].x = controlPoint[pointCount - 2].x / diag[pointCount - 2];
				controlPoint[pointCount - 2].y = controlPoint[pointCount - 2].y / diag[pointCount - 2];
		
				for (var i = pointCount - 3; i > 0; i--) {
					controlPoint[i].x = (controlPoint[i].x - sup[i] * controlPoint[i + 1].x) / diag[i];
					controlPoint[i].y = (controlPoint[i].y - sup[i] * controlPoint[i + 1].y) / diag[i];
				};
			}
			//使用伯恩斯坦多项式绘制Bezier曲线
			for (var i = 0,length = pointCount - 1; i < length; i++) {
				var b1 = {
					x:controlPoint[i].x * 2 / 3 + controlPoint[i + 1].x / 3,
					y:controlPoint[i].y * 2 / 3 + controlPoint[i + 1].y / 3
				};
				var b2 = {
					x:controlPoint[i].x / 3 + controlPoint[i + 1].x * 2 / 3,
					y:controlPoint[i].y / 3 + controlPoint[i + 1].y * 2 /3
				};
				
				var	tt = (pt[i + 1].x - pt[i].x) / precision;
				
		
				if(tt == 0) tt = 1;
				if(tt < 0) tt = - tt;
				if(pointCount != 3) tt = tt + 1;
		
				for (var j = 0; j < tt; j++) {
					var t = j / tt;
					var v = {
						x:(1 - t) * (1 -t) * (1 -t) * pt[i].x + 3 * (1 -t) * (1 -t) * t * b1.x + 3 * (1 -t) * t * t * b2.x + t * t * t * pt[i + 1].x,
						y:(1 - t) * (1 -t) * (1 -t) * pt[i].y + 3 * (1 -t) * (1 -t) * t * b1.y + 3 * (1 -t) * t * t * b2.y + t * t * t * pt[i + 1].y
					};
					color[j] = v.y;
					m_resultPointArray.push(v);
				};
			};
			
			for (var i = 0,length = m_resultPointArray.length; i < length; i++) {
				var an = m_resultPointArray[i].y;
				if(an < 0) an = 0;
				if(an > 255) an = 255;
				color[pt[0].x + i] = an;
			};
			return color;
		};
		
		H5P.prototype.level = function(input, output) {
			var gamma = 1 / input[1];
		   var color = new Uint8ClampedArray(256);
		
		   for (var i = 0; i < 256; i++) {
		       color[i] = output[0] + Math.pow((i - input[0]) / (input[2] - input[0]),gamma) * (output[1] -output[0]);
		       if(color[i] > output[1]) color[i] = output[1];
		       else if(color[i] < output[0]) color[i] =output[0];
		   };
		   return color;
		};
		
		H5P.prototype.filters = function() {
			return {
				//线性减淡
				linearDodge : function(b,u,o){
					var temp = b + u;
					var r = temp > 255 ? 255 : temp;
					return r * o + b * (1 - o);
				},
				//线性加深
				linearBurn : function(b,u,o){
					var temp = b + u;
					var r = temp > 255 ? temp - 255 : 0;
					return r * o + b * (1 - o);
				},
				//颜色加深
				colorBurn : function(b,u,o){
					var r = b - ((255 - b) * (255 - u)) / u;
					//var r = 255 - 255 * (255 - b / u);
					return r * o + b * (1 - o);
				},
				//颜色减淡
				colorDodge : function(b,u,o){
					var r = b + (b * u) / (255 - u); 
					return r * o + b * (1 - o);
				},
				//实色混合
				haardMix : function(b,u,o){
					var r = u < (255 - b) ? 0 : 255;
					return r * o + b * (1 - o);
				},
				//正片叠底
				multiply : function(b,u,o){
					var  r = b * u / 255;
					return r * o + b * (1 - o);
				},
				//线性光
				linearLight : function(b,u,o){
					var temp = b + 2 * u - 255;
					var r = temp > 255 ? 255 : temp;
					return r * o + b * (1 - o);
				},
				//艳光
				vividLight : function(b,u,o){
					var r;
					if(u < 127.5) r = (1 - (255 - b) / (2 * u)) * 255;
		   			else  r = b / (2 * (1 - u / 255));
		   			return r * o + b * (1 - o);
				},
				//柔光
				softLight : function(b,u,o){
					var r;
					if(u < 127.5) 
						r = ((2*u-255)*(255-b)/(255*255)+1)*b;
		  			else
		      			r = (2*u-255)*(Math.sqrt(b/255)-b/255)+b;
		      		return r * o + b * (1 - o);
				},
				//点光
				pinLight : function(b,u,o){
					var r;
					if(b<(2*u-255))  r = 2*u-255;
					else if(b<2*u) r = b;
					else r=2*u;
					return r * o + b * (1 - o);
				},
				//强光
				hardLight : function(b,u,o){
					var r;
					if(u<=127.5) r=b*u/127.5;
					else r=b+(255-b)*(u-127.5) / 127.5;
					return r * o + b * (1 - o);
				},
				//差值
				difference : function (b,u,o){
					var r = b > u ? b - u : u - b;
					return r * o + b * (1 - o);
				},
				//叠加
				overlay : function(b,u,o){
					var r;
					if(b<=127.5) r=b*u / 127.5;
					else  r=255-(255-b)*(255-u) / 127.5;
					return r * o + b * (1 - o); 
				},
				//滤色
				screen : function(b,u,o){
					var r=255-(255-b)*(255-u) / 255;
					return r * o + b * (1 - o);
				},
				//变亮
				lighten : function(b,u,o){
					var  r=b>u?b:u;
					return r * o + b * (1 - o);
				},
				//变暗
				darken : function(b,u,o){
					var r=b<u?b:u;
					return r * o + b * (1 - o);
				},
				//排除
				exclusion : function(b,u,o){
					var r=b+u-(b*u) / 127.5;
					return r * o + b * (1 - o); 
				},
				//正常
				normal : function(b,u,o){
					var r = u;
					return r * o + b * (1 - o);
				}
			};
		};
		
		H5P.prototype.getRGBA = function (value, a) {
			var c,rt=[];
			for (var i = 0; i < 6; i+=2) {
			    c=value.substring(i,i+2);
			    rt.push(parseInt(c,16));
			};
			rt.push(a / 100);
			return {
				r: rt[0],
				g: rt[1],
				b: rt[2],
				a: rt[3]
			};
		};
		
		H5P.single = function(data) {
			switch(data.cmd){
				case 'base':
					return  H5P()[data.cmd](data);
				case 'balance':
					var baseLayer   = data.baseLayer;
					var baseData    = baseLayer.data;
					var baseLength  = baseData.length;
			
					var cyan = data.cyan
			 		 , magenta = data.magenta
			  		 , yellow = data.yellow
			  		 , mode = data.mode || 1;
			
					var result = H5P()[data.cmd](cyan,magenta,yellow,mode);
			
					for (var i = 0; i < baseLength; i+=4) {
						baseData[i] = result.r[baseData[i]];
						baseData[i + 1] = result.g[baseData[i + 1]];
						baseData[i + 2] = result.b[baseData[i + 2]];
					};
					return baseLayer;
			};
		};
		
		H5P.merge = function(data) {
			var baseLayer   = data.baseLayer;
			var baseData    = baseLayer.data;
			var baseLength  = baseData.length;
			
			var steps = data.step;
			var queue = [];
			
			var specially = H5P();
			specially.filter = specially.filters();
			
			for (var i = 0,length = steps.length; i < length; i++) {
				var step = steps[i];
				var cmd = step[0]
				switch(cmd){
					case 'filter':
						var filter = step[1];
						var rgb = specially.getRGBA(step[2],step[3]);
						var param = ['filter',specially.filter[filter],rgb];
						if(step[4]) param.push(true);
						queue.push(param);
					break;
					case 'level':
						var channel = step[1];
						var level = specially.level(step[2],step[3]);
						queue.push(['level',channel,level]);
					break;
					case 'balance':
						var balance = specially.balance(step[1],step[2],step[3],step[4]);
						queue.push(['balance',balance]);
					break;
					case 'curve' : 
						var channel = step[1];
						var curve = specially.curve(step[2],step[2].length);
						queue.push(['curve',channel,curve]);
					break;
					case 'copy':
						var filter = step[1];
						var opactiy = step[2] / 100; 
						var param = ['copy',specially.filter[filter],opactiy];
						if(step[3]) param.push(true);
						queue.push(param);
					break;
					case 'image':
						var filter = step[1];
						var opactiy = step[3] / 100; 
						var param = ['image',specially.filter[filter],step[2],opactiy];
						if(step[4]) param.push(true);
						queue.push(param);
					break;
					case 'keep':
						var channel = step[1];
						queue.push(['keep',channel]);
					break;
				}
			};
			
			for (var j = 0; j < baseLength; j+=4) {
				var red   = baseData[j];
				var green = baseData[j + 1];
				var blue  = baseData[j + 2];
			
			
				for (var i = 0,length = queue.length; i < length; i++) {
					var q1 = queue[i];
					var cmd = q1[0];
					switch(cmd){
						case 'keep':
							switch(q1[1]){
								case 'r' :  green = red; blue = red; break;
								case 'g' :  red = green; blue = green; break;
								case 'b' :  red = blue; green = blue; break;
							}
						break;
						case 'image':
							if(q1[2][j + 3] != 0){
								var opactiy = q1[2][j + 3] / 255 * q1[3];
								red = q1[1](red,q1[2][j],opactiy);
								green = q1[1](green,q1[2][j + 1],opactiy);
								blue = q1[1](blue,q1[2][j + 2],opactiy);
								if(q1[4]){
									red = Math.round(red);
									green = Math.round(green);
									blue = Math.round(blue);
								}
							}
						break;
						case 'filter':
							red   = q1[1](red,q1[2].r,q1[2].a);
							green = q1[1](green,q1[2].g,q1[2].a);
							blue   = q1[1](blue,q1[2].b,q1[2].a);
							if(q1[3]){
								red = Math.round(red);
								green = Math.round(green);
								blue = Math.round(blue);
							}
						break;
						case 'balance':
							red = q1[1].r[red];
							green = q1[1].g[green];
							blue = q1[1].b[blue];
						break;
						case 'level':
							var channel = q1[1];
							switch(channel){
								case 'rgb':
									red   = q1[2][red];
									green = q1[2][green];
									blue  = q1[2][blue]; 
								break;
								case 'r':
									red   = q1[2][red];
								break;
								case 'g':
									green = q1[2][green];
								break;
								case 'b':
									blue  = q1[2][blue]; 
								break;
							}
						break;
						case 'curve':
							var channel = q1[1];
							switch(channel){
								case 'rgb':
									red = q1[2][red];
									green = q1[2][green];
									blue  = q1[2][blue]; 
								break;
								case 'r':
									red   = q1[2][red];
								break;
								case 'g':
									green = q1[2][green];
								break;
								case 'b':
									blue  = q1[2][blue]; 
								break;
							}
						break;
						case 'copy':
							red = q1[1](red,red,q1[2]);
							green = q1[1](green,green,q1[2]);
							blue = q1[1](blue,blue,q1[2]);
							if(q1[3]){
								red = Math.round(red);
								green = Math.round(green);
								blue = Math.round(blue);
							}
						break;
			
					}
				};
			
				baseData[j] = red;
				baseData[j + 1] = green;
				baseData[j + 2] = blue;
			};
			return baseLayer;
		};
		
		onmessage =function(e) {
		
			var time = new Date().getTime();
			var data = e.data;
		
			var baseLayer = H5P[data.type](data);
			var map       = data.map;
		
			postMessage({
				baseLayer : baseLayer,
				map   : map,
				// index : index,
				time  : new Date().getTime() - time
			});
		}
	},

	part: function() {
		var H5P = function (){
			if(!(this instanceof H5P))
				return new H5P();
		};
		
		H5P.prototype.blur = function(data){
			var baseLayer   = data.baseLayer;
			var pixes       = baseLayer.data;
		
			var width   = data.baseWidth;
			var height  = data.baseHeight;
		
			var radius  = data.radius;
			var sigma   = data.sigma;
		
			var gaussMatrix = [],
		      gaussSum = 0,
		      x, y,
		      r, g, b, a,
		      i, j, k, len;
		
		   radius = Math.floor(radius) || 13;
		   sigma = sigma || radius / 3;
		   
		   a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
		   b = -1 / (2 * sigma * sigma);
		   //生成高斯矩阵
		   for (i = 0, x = -radius; x <= radius; x++, i++){
		       g = a * Math.exp(b * x * x);
		       gaussMatrix[i] = g;
		       gaussSum += g;
		   
		   }
		   for (i = 0, len = gaussMatrix.length; i < len; i++) {
		       gaussMatrix[i] /= gaussSum;
		   }
		   //x 方向一维高斯运算
		   for (y = 0; y < height; y++) {
		       for (x = 0; x < width; x++) {
		           r = g = b = a = 0;
		           gaussSum = 0;
		           for(j = -radius; j <= radius; j++){
		               k = x + j;
		               if(k >= 0 && k < width){//确保 k 没超出 x 的范围
		                   i = (y * width + k) * 4;
		                   r += pixes[i] * gaussMatrix[j + radius];
		                   g += pixes[i + 1] * gaussMatrix[j + radius];
		                   b += pixes[i + 2] * gaussMatrix[j + radius];
		                   gaussSum += gaussMatrix[j + radius];
		               }
		           }
		           i = (y * width + x) * 4;
		           pixes[i] = r / gaussSum;
		           pixes[i + 1] = g / gaussSum;
		           pixes[i + 2] = b / gaussSum;
		       }
		   }
		   //y 方向一维高斯运算
		   for (x = 0; x < width; x++) {
		       for (y = 0; y < height; y++) {
		           r = g = b = a = 0;
		           gaussSum = 0;
		           for(j = -radius; j <= radius; j++){
		               k = y + j;
		               if(k >= 0 && k < height){//确保 k 没超出 y 的范围
		                   i = (k * width + x) * 4;
		                   r += pixes[i] * gaussMatrix[j + radius];
		                   g += pixes[i + 1] * gaussMatrix[j + radius];
		                   b += pixes[i + 2] * gaussMatrix[j + radius];
		                   gaussSum += gaussMatrix[j + radius];
		               }
		           }
		           i = (y * width + x) * 4;
		           pixes[i] = r / gaussSum;
		           pixes[i + 1] = g / gaussSum;
		           pixes[i + 2] = b / gaussSum;
		       }
		   }
			return baseLayer;
		};
		
		H5P.prototype.sharp = function(data){
		    var width   = data.baseWidth;
		    var height  = data.baseHeight;
		
		    var baseLayer   = data.baseLayer;
		    var data        = baseLayer.data;
		
		    var radius = data.radius;
		
		    var lamta = radius|| 2.5;
		
		    for(var i = 0,n = data.length;i < n;i += 4){
		        var ii = i / 4;
		        var row = parseInt(ii / width);
		        var col = ii % width;
		        if(row == 0 || col == 0) continue;
		
		        var A = ((row - 1) *  width + (col - 1)) * 4;
		        var B = ((row - 1) * width + col) * 4;
		        var E = (ii - 1) * 4;
		
		        for(var j = 0;j < 3;j ++){
		            var delta = data[i + j] - (data[B + j] + data[E + j] + data[A + j]) / 3;
		            data[i + j] += delta * lamta;
		        }
		    }
		    return baseLayer;
		};
		
		H5P.prototype.mosaic = function(data){
		    var radius = data.radius || 22;
		
		    var width   = data.baseWidth;
		    var height  = data.baseHeight;
		
		    var baseLayer   = data.baseLayer;
		    var data        = baseLayer.data;
		  
		    var n  = Math.floor(width / radius)
		      , nn = Math.ceil(width / radius)
		      , modn = width % radius;
		
		    var m  = Math.floor(height / radius)
		      , mm = Math.ceil(height / radius)
		      , modm = height % radius;
		
		    var core = function (x,y,n,m) {
		        var sum = [0,0,0];
		        for (var i = 0; i < n; i++) {
		          for (var j = 0; j < m; j++) {
		                var index = ((y * radius + i) * width + x * radius + j) * 4;
		                sum[0] += data[index];
		                sum[1] += data[index + 1];
		                sum[2] += data[index + 2];
		          };
		        };
		        for (var i = 0; i < n; i++) {
		          for (var j = 0; j < m; j++) {
		                var index = ((y * radius + i) * width + x * radius + j) * 4;
		                data[index] = sum[0] / (n * m);
		                data[index + 1] = sum[1] / (n * m);
		                data[index + 2] = sum[2] / (n * m);
		          };
		        };
		    };
		
		    for (var x = 0; x < n; x++) {
		        for (var y = 0; y < m; y++) {
		            //整体
		            core(x,y,radius,radius);
		            //最后一行
		            if(n != nn){
		              core(n,y,radius,modn);
		            }
		        };
		        //最后一列
		        if(m != mm){
		          core(x,m,modm,radius);
		        }
		    };  
		    //最后一格
		    if(n != nn){
		       core(n,m,modm,modn);
		    }
		    return baseLayer;
		};
		
		H5P.prototype.gray = function (data) {
		    var baseLayer   = data.baseLayer;
		    var baseData    = baseLayer.data;
		    var baseLength  = baseData.length;
		    
		    for (var i = 0; i < baseLength; i+=4) {
		      
		      var avg = (baseData[i] + baseData[i + 1] + baseData[i + 2]) / 3; 
		      baseData[i] = avg;
		      baseData[i + 1] = avg;
		      baseData[i + 2] = avg;
		    };
		    return baseLayer;
		};
		
		onmessage = function (e){
		
			var time = new Date().getTime();
			var data  = e.data;
			var map = data.map;
			var cmd = data.cmd;
			
			var baseLayer = H5P()[cmd](data);
			
			postMessage({
			  baseLayer : baseLayer,
			  map: map,
			  cmd: cmd,
			  time: new Date().getTime() - time
			});
		}
	}
};