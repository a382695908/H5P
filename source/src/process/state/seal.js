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