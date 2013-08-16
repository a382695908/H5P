Process.prototype.state = function() {

	var data = this.data,
		update = this.update.bind(this),
		draw = this.draw.bind(this),
		drawPart = this.drawPart.bind(this),
		OpenFile = this.OpenFile(),
		Medio = this.Medio(),
	    windowScreenWidth = window.screen.width;

	function resizeLoad() {
		var handle;
		$(window).resize(function() {
			clearTimeout(handle);
			handle = setTimeout(function() {
				data.bgp.FORM.fProcess.reload();
			}, 100);
		});
	};
// 注册笔刷事件
function showPen(changeColor) {

	var $pen = $('#pen'),
	    down = false,
	    nextElement = document.getElementById('next'),
	    nextCanvas = new data.bg.Canvas(nextElement);

	var penRatio = (function() {
			var	size = data.bgp.PI.part.img.getSize();
			return {
				w: size.width / window.innerWidth,
				h: size.height / window.innerHeight
			};
		})();

	$(document).mousemove(function(e) {

		var left = e.pageX - $pen.width() / 2,
			top = e.pageY - $pen.height() / 2;

		$pen.css({ left: left, top: top });
		
		if(down) {
			swapPoints(e.pageX, e.pageY);
		}

	}).mouseleave(function() {
		// 隐藏画笔
		$pen.hide();
		

	}).mouseenter(function() {
		// 设置画笔大小
		setPenSize();
		// 显示画笔
		$pen.show();
	
	}).mousedown(function(e) {
		
		down = true;

		swapPoints(e.pageX, e.pageY);

	}).mouseup(function() {
		// 设置透明层记录
		data.bgp.setTransparent(nextElement);
		down = false;
	});

	function setPenSize() {

		var penSize = data.bgp.getPenSize(),
			width = penSize / penRatio.w,
			height = penSize / penRatio.h,
			radius = width > height ? width / 2 : height / 2;

		$pen.css({
			width: width,
			height: height,
			borderRadius: radius
		});
	}

	var	brushData = data.bgp.PI.n.getImageDataAll().data;

	function swapPoints(px, py) {
		
		px = Math.round(px * penRatio.w);
		py = Math.round(py * penRatio.h);

		var size = data.bgp.PI.part.img.getSize(),
		 	width = data.bgp.getPenSize(),
			halfWidth = Math.floor(width / 2);
		
		var p1 = {
			x : px - halfWidth,
			y : py - halfWidth
		},
		p5 = {
			x : px,
			y : py 
		};

		var points = [], i, j, x, y, r, o, index;
		// 获取像素点坐标
		for (i = 0; i < width; i++) {
			x = p1.x + i;
			if(x <= 0 || x > size.width) continue;
			for (j = 0; j < width; j++) {
				y = p1.y + j;
				if(y < 0 || y > size.height) continue;
				r = Math.sqrt(Math.pow(x - p5.x,2) + Math.pow(y - p5.y,2));
				if(r <= halfWidth){
					if(r >= halfWidth * 0.8) {
						o = 0.8;
					}else {
						o = 1;
					}
					index = ((y - 1) * size.width + (x - 1)) * 4;
					if(index > 0) {
						points.push({x: x, y: y, o: o,index: index});
					}
				}
			};
		};

		// 判断画笔类型进行绘制
		if(data.bgp.getPenType() == 'brush') {
			
			if(changeColor) {
				nextCanvas.change(points, 
					brushData, 
					data.bg.Color.toRGBA(data.bgp.PI.part.color));
			}else {
				nextCanvas.show(points, brushData);
			}
		}else {
			nextCanvas.hide(points);
		}
	};
	// 注册窗体大小调整事件
	resizeLoad();
};
return {

		file: function() {
			
			var file = new OpenFile().onload(function() {
				var img = this[0];
				// 设置当前处理图片
				data.bgp.setPI(img).setState('image').reload();
			});

			// 获取打开文件按钮
			$('#file').show().click(file.load.bind(file));
			// 将窗体更新到顶部
			// update(300, 100, windowScreenWidth / 2 - 150, 0);
		},
		image: function() {
			
			var pi = data.bgp.PI,
			    prev = pi.p.get(),
			    next = pi.n.get();

			update(next.width, next.height, 
				Math.floor(windowScreenWidth / 2 - next.width / 2), 0);

			draw(prev, next);
		},
		medio: function() {

			var isReady = false,
			    medio = new Medio('next'),
			    btn1 = $('#medioBtn1'),
	 			btn2 = $('#medioBtn2'),
	 			btn3 = $('#medioBtn3'),
	 			btn4 = $('#medioBtn4'),
	 			$medio = $('#medio'),
	 			$medioBtn = $('#medioBtn');

	 		btn1.click(function(){
				medio.pause();
				btn1.hide();
				btn2.hide();
				btn3.show();
				btn4.show();
			});

			btn2.click(function(){
				// 设置窗体状态为关闭模式
				data.bgp.setState('close').reload();
			});

			btn3.click(function(){

				var canvas = document.getElementById('prev');
				
				data.bgp.setPI(canvas).setState('image').reload();
			});

			btn4.click(function(){
				medio.play();
				btn1.show();
				btn2.show();
				btn3.hide();
				btn4.hide();
			});
			// 注册将图像流绘制到画布事件
			medio.ondraw(function() {
				var canvas = this;
				if(!isReady) {
					update(canvas.width, canvas.height, 
							Math.floor(windowScreenWidth / 2 - canvas.width / 2), 0);
					$medioBtn.show();
					$medio.hide();
					isReady = true;
				}
				draw(canvas);
			});

			medio.play();

			$medio.show();

			// 将窗体更新到顶部
			// update(300, 100, windowScreenWidth / 2 - 150, 0);
		},
part: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get();

	// 显示画笔
	showPen();
	// 绘制到页面上
	drawPart(img, transparent);
},
partChange: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get();
		
	// 显示画笔
	showPen(true);
	// 绘制到页面上
	drawPart(img, transparent);
},
seal: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get(),
		tuya = data.bgp.tuya,
		$sucai = $('#sucai'),
		nextElement = document.getElementById('next'),
		context = nextElement.getContext('2d'),
		sucai,
		down;
	// 素材画笔
	function showSucai(sucaiSize) {

		var sucaiRatio = (function() {
			var	size = data.bgp.PI.part.img.getSize();
			return {
				w: size.width / window.innerWidth,
				h: size.height / window.innerHeight
			};
		})();

		$(document).mousemove(function(e) {

			var left = e.pageX - $sucai.width() / 2,
				top = e.pageY - $sucai.height() / 2;
	
			$sucai.css({ left: left, top: top });
			
			if(down) {
				if(tuya.random) {
					randomColor();
				}
				drawImage(e.pageX, e.pageY);
			}
	
		}).mouseleave(function() {
			
			$sucai.hide();

		}).mouseenter(function() {

			setSucaiSize();

			$sucai.show().css({ opacity: tuya.opacity / 100 });
		
		}).mousedown(function(e) {
			
			down = true;

			drawImage(e.pageX, e.pageY);

		}).mouseup(function() {
			if(tuya.random) {
				randomColor();
			}
			down = false;
			// 设置透明层记录
			data.bgp.setTransparent(nextElement);
		});

		function setSucaiSize() {

			var width = sucaiSize.width / sucaiRatio.w,
				height = sucaiSize.height / sucaiRatio.h;

			$sucai.css({
				width: width,
				height: height
			});	
		}

		function drawImage(x, y) {
			
			var radius = Math.floor(sucaiSize.width / 2),
				x = x * sucaiRatio.w - radius,
				y = y * sucaiRatio.h - radius,
				size = sucai.getSize();

			context.globalAlpha = tuya.opacity / 100;

			context.drawImage( 
				sucai.get(), 
				x < 0 ? -x : 0, 
				y < 0 ? -y : 0,
				x < 0 ? size.width + x : size.width,
				y < 0 ? size.height + y : size.height,
				x < 0 ? 0 : x, 
				y < 0 ? 0 : y,
				x < 0 ? size.width + x : size.width,
				y < 0 ? size.height + y : size.height
			);

			context.globalAlpha = 1;
		}

		function randomColor() {
			var str = '0123456789abcdef',
				count = 6,
				color = '',
				random;
			while(count--) {
				random = Math.floor(Math.random() * 100) / 15;
				color += str.charAt(random);
			};	

			sucai.changeColor(color);
			tuya.refreshColor(color);
		};

		// 注册窗体大小调整事件
		resizeLoad();
	};
	// 取色笔
	if(tuya.getColor) {

		$(document).mousedown(function(e) {

			var canvas = data.bgp.PI.part.img.clone().draw(data.bgp.PI.part.transparent.get()),
				bitmap = canvas.getImageDataAll().data;
				size = canvas.getSize(),
				x = e.pageX,
				y = e.pageY,
				index = ((y - 1) * size.width + (x - 1)) * 4;

			var color = data.bg.Color.toHEX(new data.bg.Color(
					bitmap[index],
					bitmap[index + 1],
					bitmap[index + 2]
				));

			tuya.refreshColor(color);
		});

	}else {

		if(tuya.type == 'brush') {
	
			sucai = new data.bg.Canvas($sucai.get(0));
	
			new data.bg.LoadImage().onload(function() {
	
				var penSize = tuya.bsize / 100,
					width = this.width,
					height = this.height,
					size = new data.bg.Size(width * penSize, height * penSize);
	
				sucai.setSize(size).draw(this).changeColor(tuya.color);
	
				showSucai(size);
	
			}).load(tuya.seal);
		}else {
			// 清除所有
			if(tuya.clear) {
				tuya.clear = false;
				transparent = data.bgp.PI.p.clone().transparent().get();
				data.bgp.setTransparent(transparent);
			};
			
			showPen();
		}
	}

	// 绘制到页面上
	draw(img, transparent);
},
cut: function() {
	
	var next = data.bgp.PI.n.get();
	// 获取缩放比例
	var cutRatio = (function() {
			var	size = data.bgp.PI.n.getSize();
			return {
				w: size.width / (window.innerWidth * 0.96),
				h: size.height / (window.innerHeight * 0.96)
			};
		})();
	// 绘制半透明图片函数
	function drawImage(id) {
		
		var canvas = document.getElementById(id),
	 		context = canvas.getContext('2d');

	 	canvas.width = next.width;
		canvas.height = next.height;
		canvas.style.opacity = 0.5;
		// canvas.className = 'cut-img';
		context.drawImage(next, 0, 0);

		return canvas;
	};

	var canvas = drawImage('next'),
		cut = data.bgp.cut,
		img = new Image;
	// 添加裁剪层图片
	img.className = 'cut-img';
	img.src = canvas.toDataURL();
	img.setAttribute('draggable','false');
	// 获取裁剪位子
	var t = cut.top, 
		r = cut.right, 
		b = cut.bottom, 
		l = cut.left, 
		w, h, size;
	// 初始化裁剪对象
	if(t == 0 && r == 0 && b == 0 && l ==0 ) {
		size = data.bgp.PI.n.getSize();

		w = Math.floor(size.width / 4);
		h = Math.floor(size.height / 4);

		t = h;
		r = w + cut.width;
		b = h + cut.height;
		l = w;

		cut.setPosition(t, r, b, l);
	};

	function Clip(t, r, b, l, cut) {
		this.setData(Math.floor(t / cutRatio.h), Math.floor(r / cutRatio.w),
					 Math.floor(b / cutRatio.h), Math.floor(l / cutRatio.w));

		this.cut = cut;
		this.clip = $('#clip');
		this.img = $(img);
	};

	Clip.prototype = {

		init: function() {
			var width = this.r - this.l,
				height = this.b - this.t,
				left = this.l - 1,
				top = this.t - 1;

			$('#processContent').append(this.img).addClass('clip-screen');
			if(cut.isLock) {
				$('.clip-w,.clip-e,.clip-n,.clip-s').hide();
			}
			// 初始化裁剪框
			this.position(width, height, left, top)
				.clipImage(this.t, this.r, this.b, this.l).addEvent();
			
			return this;
		},
		setData: function(t, r, b, l) {
			this.t = t;
			this.b = b;
			this.r = r;
			this.l = l;
			cut.setPosition(Math.floor(t * cutRatio.h), 
							Math.floor(r * cutRatio.w), 
							Math.floor(b * cutRatio.h), 
							Math.floor(l * cutRatio.w));
			return this;
		},

		clipImage: function(t, r, b, l) {
			
			this.img.css({
				clip: 'rect('+ t +'px '+ r +'px '+ b +'px '+ l +'px)'
			});
	
			return this;
		},

		position: function(width, height, left, top) {

			this.clip.show().css({
				width: width,
				height: height,
				left: left,
				top: top
			});
			cut.setSize(Math.floor(width * cutRatio.w), Math.floor(height * cutRatio.h));
			return this;
		},

		addEvent: function() {
			var self = this,
				target, downPoint, changeData,
				bottom, right, left, top,
				maxLeft, maxTop, minBottom, minRight,
				maxBottom = Math.floor(window.innerHeight * 0.96),
				maxRight = Math.floor(window.innerWidth * 0.96),
				minLeft = 0, 
				minTop = 0,
				minWidth = 1,
				minHeight = 1;
				// size = data.bgp.PI.n.getSize(),
				// ratio = size.width / size.height;
				
			$(document).mousemove(function(e) {
				
				var movePoint, diffPoint, isMove;

				if(target && target.nodeName.toLowerCase() == 'div') {
					
					movePoint = new data.bg.Point(e.pageX, e.pageY);
					diffPoint = movePoint.sub(downPoint);

					// if(cut.isLock) {
					// 	diffPoint = diffPoint.ratio(ratio);
					// }

					switch(target.className) {
						case 'clip-content':
							top = self.t + diffPoint.y;
							bottom = self.b + diffPoint.y;
							left = self.l + diffPoint.x;
							right = self.r + diffPoint.x;
							isMove = true;
							break;
						case 'clip-resize clip-nw':
							top = self.t + diffPoint.y;
							bottom = self.b;
							left = self.l + diffPoint.x;
							right = self.r;
							break;
						case 'clip-resize clip-ne':
							top = self.t + diffPoint.y;
							bottom = self.b;
							left = self.l;
							right = self.r + diffPoint.x;
							break;
						case 'clip-resize clip-sw':
							top = self.t;
							bottom = self.b + diffPoint.y;
							left = self.l + diffPoint.x;
							right = self.r;
							break;
						case 'clip-resize clip-se':
							top = self.t;
							bottom = self.b + diffPoint.y;
							left = self.l;
							right = self.r + diffPoint.x;
							break;
						case 'clip-resize clip-w':
							top = self.t;
							bottom = self.b;
							left = self.l + diffPoint.x;
							right = self.r;
							break;
						case 'clip-resize clip-e':
							top = self.t;
							bottom = self.b;
							left = self.l;
							right = self.r + diffPoint.x;
							break;
						case 'clip-resize clip-n':
							top = self.t + diffPoint.y;
							bottom = self.b;
							left = self.l;
							right = self.r;
							break;
						case 'clip-resize clip-s':
							top = self.t;
							bottom = self.b + diffPoint.y;
							left = self.l;
							right = self.r;
							break;
					}

					if(isMove) {
						left = left < minLeft ? minLeft : left > maxLeft ? maxLeft : left;
						top = top < minTop ? minTop : top > maxTop ? maxTop : top;
						bottom = bottom < minBottom ? minBottom : bottom > maxBottom ? maxBottom : bottom;
						right = right < minRight ? minRight : right > maxRight ? maxRight : right;
					}else {
						left = left < minLeft ? minLeft : left > (self.r - minWidth) ? (self.r - minWidth) : left;
						top = top < minTop ? minTop : top > (self.b - minHeight) ? (self.b - minHeight) : top;
						bottom = bottom < (self.t + minHeight) ? (self.t + minHeight) : bottom > maxBottom ? maxBottom : bottom;
						right = right < (self.l + minWidth) ? (self.l + minWidth) : right > maxRight ? maxRight : right;
					}

					self.position(right - left, bottom - top, left - 1, top - 1).clipImage(top, right, bottom, left);
					
					changeData = true;
				}
			
			}).mousedown(function(e) {
				
 				minRight = self.r - self.l;
				minBottom = self.b - self.t;
 				maxLeft = maxRight - minRight;
 				maxTop =  maxBottom - minBottom;

				target = e.target;
				changeData = false;
				downPoint = new data.bg.Point(e.pageX, e.pageY);

			}).mouseup(function() {
				
				target = null;
				if(changeData){
					self.setData(top, right, bottom, left);
					top = right = bottom = left = null;
				}
			});

			$('.clip-content').dblclick(function() {
				cut.clip();
			});
			return this;
		}
	};

	// 创建页面创建对象
	var clipPen = new Clip(t, r, b, l, cut);

	clipPen.init();

	// 注册窗体大小调整事件
	resizeLoad();
},
pencil: function() {

	var img = data.bgp.PI.part.img.get(),
		transparent = data.bgp.PI.part.transparent.get(),
		pencil = data.bgp.pencil,
		nextElement = document.getElementById('next'),
		context = nextElement.getContext('2d'),
		down, downPoint;
	// 素材画笔
	function showpencil() {

		var pencilRatio = (function() {
			var	size = data.bgp.PI.part.img.getSize();
			return {
				w: size.width / window.innerWidth,
				h: size.height / window.innerHeight
			};
		})();

		$(document).mousemove(function(e) {

			if (down) {
				var movePoint = new data.bg.Point(Math.floor(e.pageX * pencilRatio.w), Math.floor(e.pageY * pencilRatio.h));
				context.strokeStyle = '#' + pencil.color;
				context.moveTo(downPoint.x, downPoint.y);
				context.lineTo(movePoint.x, movePoint.y);
				context.stroke();
				downPoint = downPoint.reset(movePoint);
			}
	
		}).mousedown(function(e) {
			
			down = true;
			downPoint = new data.bg.Point(Math.floor(e.pageX * pencilRatio.w), Math.floor(e.pageY * pencilRatio.h));

		}).mouseup(function() {

			down = false;
			// 设置透明层记录
			data.bgp.setTransparent(nextElement);
		});

		// 注册窗体大小调整事件
		resizeLoad();
	};

	if(pencil.type == 'brush') {
	
		showpencil();
	}else {
		// 清除所有
		if(pencil.clear) {
			pencil.clear = false;
			transparent = data.bgp.PI.p.clone().get();
			data.bgp.setTransparent(transparent);
		};
		
		showPen();
	}

	// 绘制到页面上
	draw(img, transparent);
},
		close: function() {
			window.close();
		}
	};
}