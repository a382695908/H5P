/*
 * 多线程处理类
 */
function Core(PI, FORM, QUEUE){
	// 储存处理的画布，o，p，n
	this._pi = PI;
	// 储存form窗体
	this._form = FORM;
	// 线程数组
	this._worker = null;
	// 画布导航
	this._mapList = null;

	this.opacity = 1;

	this._queue = QUEUE;
};
Core.prototype = {
	/*
	 * 放弃当前处理
	 */
	_stop_: function() {
	
		if(this._worker) {
			this._worker.stop();
		};
	},
	/*
	 * 多个worker处理
	 */
	_com_: function(request, setMsgFn) {
		// 停止线程处理
		this._stop_();
		// 获取画布导航
		this._mapList = Map.get(this._pi.p.getSize());
		// 实例线程
		this._worker = new UserWorker(this._mapList, workerProcess.filter);
		
		var self = this;
		// 注册线程事件
		this._worker.onmessage(request, function(map) {
			// 增加baselayer参数
			this['baseLayer'] = self._pi.p.getImageData(map);
			// 增加更多参数
			if(setMsgFn){
				setMsgFn.bind(this)(map);
			};
		}, function() {
			// 获取全部线程数据回调
			var count = this.length,
				map,
				layer;
			// 填充处理数据
			while(count--){
				map = this[count].map;
				layer = this[count].layer;
			
				self._pi.n.putImageData( map, layer );
			};
			// 刷新处理窗体页面
			self._form.fProcess.reload();
		}).message();
	},
	/*
	 * 单个worker处理
	 */
	_partCom_: function(request) {
		var self = this;

		this._stop_();
		this._mapList = Map.get(this._pi.p.getSize(), true);
		this._worker = new UserWorker(this._mapList, workerProcess.part);

		this._worker.onmessage(request, function(map) {

			var imageData = self._pi.p.getImageData(map);

			this['baseLayer'] = imageData;
			this['baseWidth'] = imageData.width;
			this['baseHeight'] = imageData.height;
		}, function() {

			var count = this.length,
				map,
				layer;

			// 设置局部处理数据图
			self._pi.part.img = self._pi.n.clone();

			while(count--) {
				map = this[count].map;
				layer = this[count].layer;

				self._pi.part.img.putImageData(map, layer);
			}
			// 刷新处理窗体页面
			self._form.fProcess.reload();
		}).message();
	},
	/*
	 * 开启多个worker,最多3个
	 */
	__moreWorkerProcess__: function(request) {

		var self = this;

		var processType = {
			// 基础调整
			base: function() {
				self._com_(request);
			},
			// 色彩调整
			balance: function() {
				self._com_(request);
			},
			// 特效处理
			specially: function() {
				var	// 特效对应步骤
					confing = self.speciallyConfig,
					// 读取特效配置
					sp = confing[request.config];
				// 删除无用confing参数
				delete request.config;
				// 添加特效步骤
				request.step = sp[0];
				// 判断是否含有特效图片
				if(sp[1]){
					// 加载特效图片
					new LoadImage().onload(function(){
			
						var imgs = this;
						// 处理
						self._com_(request, function(map){
							// 设置更多处理参数
							for (var i = 0, length = imgs.length; i < length; i++) {
								// 创建与处理图片一样大小的层
								var canvas = new Layer(self._pi.p.getSize()).get();
								// 绘制读取层对应的map数据用于特效处理
								this.step[sp[1][0][i]][2] = new Canvas(canvas).draw(imgs[i]).getImageData(map).data;
							};
						});
			
					}).load(sp[1][1]);
		
				}else{
					// 无图片直接处理
					self._com_(request);
				}
			}
		};
		request.cmd = request.process;
		delete request.process;
		processType[request.cmd]();
	},
	/*
	 * 开启一个worker
	 */
	__singleWorkerProcess__: function(request) {

		var self = this;

		var processType = {
			//虚化
			blur: function() {
				self._partCom_(request);
			},
			// 马赛克
			mosaic: function() {
				self._partCom_(request);
			},
			// 灰度处理
			gray: function() {
				self._partCom_(request);
			}
		};
		request.cmd = request.process;
		delete request.process;
		processType[request.cmd]();
	},
	/*
	 * 普通按钮功能
	 */
	__button__: function(request) {
		
		var self = this;
		// 按钮类型
		var type = {
			// 确定
			ok: function() {
				self._pi.p = self._pi.n.clone();
				self._form.fProcess.reload();
				self._push_(self._pi.p.clone());
			},
			// 取消
			cancel: function() {
				self._pi.n = self._pi.p.clone();
				self._form.fProcess.reload();
			},
			// 带有透明度的确定
			opacityOk: function() {
				// 克隆上一张图片
				var  prevClone = self._pi.p.clone();
				// 绘制指定透明度
				prevClone.draw(self._pi.n.get(), self.opacity);
				// 保存图片
				self._pi.p = prevClone;
				self._pi.n = prevClone.clone();
				self._form.fProcess.reload();
				self._push_(self._pi.p.clone());
			},
			// 局部处理确定按钮
			partOk: function() {
				self._pi.p = self._pi.part.img.draw(self._pi.part.transparent.get());
				self._pi.n = self._pi.p.clone();
				self._push_(self._pi.p.clone());
				self._pi.part = {};
			},
			// 裁剪确定
			clipOk: function() {
				var arg = request.arg;
				self._pi.p = self._pi.p.clip(self._pi.n.get(), 
						new Size(arg[0], arg[1]), 
						new Point(arg[2], arg[3]));
				self._pi.n = self._pi.p.clone();
				self._push_(self._pi.p.clone());
				self._form.fProcess.reload();
			}
		};
		// 执行请求
		type[request.type]();
	},
	/*
	 * 拖动按钮功能
	 */
	__scroll__: function(request) {

		var self = this;
		// 按钮类型
		var type = {
			// 处理透明度
			opacity: function() {
				self.opacity = request.opacity;
				self._form.fProcess.reload();
			}
		};
		// 执行请求
		type[request.type]();
	},
	/*
	 * 历史纪录
	 */
	_push_: function(item) {
		if(this._queue.count() == 0) {
			this._queue.push(this._pi.o);
		}
		this._queue.push(item);
	},
	/*
	 * 边框
	 */
	__border__: function(request) {

		var self = this;

		var type = {
			// 炫彩边框
			xuancai: function() {
				new LoadImage().onload(function(){
					var imgs = this;
					// 处理
					self._com_({
						type: 'merge',
						step: [['image', 'screen', null, 100]]
					}, function(map) {
						// 创建与处理图片一样大小的层
						var canvas = new Layer(self._pi.p.getSize()).get();
						// 绘制读取层对应的map数据用于特效处理
						this.step[0][2] = new Canvas(canvas).draw(imgs).getImageData(map).data;
					});
				}).load(request.src);
			},
			// 简单边框
			jiandan: function() {
				var self = this,
				    arg = request.arg;

				var processCmd = {

					more: function() {
						var src = [],
							count = 9,
							i = 0;

						while((i++) < 9) {
							request.src.more = request.src.more.replace(/\{img\}/, arg.img);
							src.push(request.src.more.replace(/\{index\}/, i));
						};
					
						self._process(src, arg.arg, function(border, imgs) {
							border.more(imgs);
						});
					},

					single: function() {
						var src = request.src.single.replace(/\{img\}/, arg.img);

						self._process(src, arg.arg, function(border, img) {
							border.single(img);
						});
					},

					
				};

				processCmd[arg.cmd]();
			},
			// 纹理边框
			wenli: function() {

				var arg = request.arg,
					src = request.src.replace(/\{img\}/, arg.img);

				this._process(src, arg.arg ? Color.toRGBA(arg.arg) : null, function(border, img) {
					border.draw(img);
				});
			},

			_process: function(src, arg, fn) {
				// 加载图片资源
				new LoadImage().onload(function(){
					// 绘制边框
					var border = new Border(self._pi.p.clone().get(), arg).process(function() {
						// 绘制到下一张图片上
						self._pi.n.setSize(this).draw(this);
						// 刷新处理窗体页面
						self._form.fProcess.reload();
					});
					// 回调绘制边框
					fn(border, this);
				}).load(src);
			}
		};

		type[request.type]();
	},
	/*
	 * 旋转
	 */
	__rotate__: function(request) {

		var self = this;

		var processRotate = {
			
			rotate: function(fn) {
				
				var deg = request.deg,
					that = this;

				new Rotate(self._pi.p.clone(), 1).process(function(){

					// 绘制到下一张图片上
					self._pi.n.setSize(this).draw(this);
					// 进行水平垂直绘制
					fn.bind(that)();

				}).rotate(deg);
			},

			draw: function(horizonta) {

				new Rotate(self._pi.n.clone(), 1).process(function(){
					// 绘制到下一张图片上
					self._pi.n.setSize(this).draw(this);
					// 刷新处理窗体页面
					self._form.fProcess.reload();

				}).draw(horizonta)
			}
		};

		processRotate.rotate(function() {
			
			var horizonta = request.arg.horizonta,
				vertical = request.arg.vertical;

			if(horizonta && vertical) {
				new Rotate(self._pi.n.clone(), 1).process(function(){
					// 绘制到下一张图片上
					self._pi.n.setSize(this).draw(this);
					// 进行水平垂直绘制
					self._form.fProcess.reload();
				}).rotate(180);
			}else if(horizonta) {
				this.draw(true);
			}else if(vertical) {
				this.draw(false);
			}else{
				self._form.fProcess.reload();
			}
		});
	},
	/*
	 * 修改尺寸
	 */
	__changeSize__: function(request) {

		this._pi.n.setSize(new Size(request.width, request.height))
			.draw(this._pi.p.get());
		this._form.fProcess.reload();
	},

	// 公开api命令入口
	execCmd: function(request) {
		var fn = this['__'+request.cmd+'__'];
		if(fn) fn.bind(this)(request);
	}
};
