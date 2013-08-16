function Color(r, g, b, a){
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
};
//16进制转rgba
Color.toRGBA = function(value, a){
	
	var c, rt=[],i = 0;

	while(i < 6){
		c = value.substring(i, i + 2);
	    rt.push(parseInt(c, 16));
	    i += 2;
	}
	
	a = a || 100;
	rt.push(a / 100);

	return new Color(rt[0], rt[1], rt[2], rt[3]);
};
//rgba转16进制
Color.toHEX = function(color){

	var parse = function(n){

		n = Number(n).toString(16);

		if(n.length == 1){
			n = '0' + n;
		}
		return n;
	};

	return [
		parse(color.r),
		parse(color.g),
		parse(color.b)
	].join('');
}