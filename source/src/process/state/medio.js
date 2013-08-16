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