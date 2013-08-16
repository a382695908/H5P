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