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