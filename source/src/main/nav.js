// 一、二级的菜单导航
require(['jquery', 'data'], function($, data) {

	//功能列表事件
	var c = 'current',
	    $t = $('.list1-content-t'),
	    $c = $('.list1-content-c'),
	    $tList = $('.list1 .title'),
	    $cList = $('.list1-content'),
	    $list1 = $('#list1'),
	    $list2 = $('#list2'),
	    $currentImage = $('#currentImage'),
	    $tab = $('#tab');
	// 一级菜单
	$list1.delegate('.title', 'click', function() {

		if(!data.canClick) {
			return false;
		}
		// 无处理图片不可以展开
		if(!data.bgp.PI.o) {
			return false;
		}
		var $this = $(this);
		
		if($this.hasClass(c)){
			$this.removeClass(c).next().hide();
		}else{
			$tList.removeClass(c);
			$cList.hide();
			$this.addClass(c).next().show();
		};

		$t.removeClass(c);
		$c.hide();

		if(!data.bgp.getState()) {
			$currentImage.click();
		}
	});
	// 二级菜单
	$list1.delegate('.list1-content-t', 'click', function() {

		if(!data.canClick) {
			return false;
		}

		var $this = $(this),
			part = $this.attr('cmd') == 'part' ? true : false;
			
		if($this.hasClass(c)){
			$this.removeClass(c).next().hide();
			if(part) {
				data.canClick = true;
			}
		}else{
			$t.removeClass(c);
			$c.hide();
			$this.addClass(c).next().show();
			if(part) {
				data.canClick = false;
			}
		};
	});

	$tab.delegate('span', 'click', function() {
		
		if(!data.bgp.PI.o) return false;

		var $this = $(this),
			cmd = $this.attr('cmd');

		$list1.hide();
		$list2.hide();
		$(cmd).show();
		$tab.find('span').removeClass('current');
		$this.addClass('current');

	});
	var saveFile = function(data, filename){
	    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
	    save_link.href = data;
	    save_link.download = filename;
	   
	    var event = document.createEvent('MouseEvents');
	    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	    save_link.dispatchEvent(event);
	};
	// 保存到本地
	$('#save').click(function() {
		var image = data.bgp.PI.n.get().toDataURL("image/png").replace("image/png", "image/octet-stream"); 
		var filename = 'H5P'+ new Date().getTime() +'.png';
		saveFile(image, filename);
	});

});