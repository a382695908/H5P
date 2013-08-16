
(function() {
	
	var C=document.fullScreenEnabled||document.webkitFullscreenEnabled||document.mozFullScreenEnabled||document.msFullScreenEnabled;
	
	if(C){
	    $(document).dblclick(function(){
	        var i=document.documentElement,
	        u=document.requestFullscreen||document.webkitFullscreenElement||document.mozFullScreenElement||document.msFullScreenElement;
	
	        if(u){
	            var M=document.cancelFullScreen||document.webkitCancelFullScreen||document.mozCancelFullScreen||document.msCancelFullScreen;
	
	            if(M){
	                M.call(document);
	            }
	        }else{
	            var N=i.requestFullScreen||i.webkitRequestFullScreen||i.mozRequestFullScreen||i.msRequestFullScreen;
	
	            if(N){
	                N.call(i);
	            }
	        }
	        return false;
	    });
	};
})()