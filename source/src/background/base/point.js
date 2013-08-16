/*
 * 坐标点类
 */
function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0;
};

Point.prototype = {

	add: function(p) {
		return new Point(
			this.x + p.x,
			this.y + p.y
		);
	},

	sub: function(p) {
		return new Point(
			this.x - p.x,
			this.y - p.y
		);
	},

	mul: function(p) {
		return new Point(
			this.x * p.x,
			this.y * p.y
		);
	},

	div: function(p) {
		return new Point(
			this.x / p.x,
		 	this.y / p.y
		);
	},

	reset: function(p) {
		return new Point(
			p.x, 
			p.y
		);
	},

	clone: function() {
		return new Point(
			this.x, 
			this.y
		);
	},

	mutableAdd: function(p) {
		this.x += p.x;
		this.y += p.y;
		return this;
	},

	mutableSub: function(p) {
		this.x -= p.x;
		this.y -= p.y;
		return this;
	},

	mutableMul: function(p) {
		this.x *= p.x;
		this.y *= p.y;
		return this;
	},

	mutableDiv: function(p) {
		this.x /= p.x;
		this.y /= p.y;
		return this;
	},

	mutableReset: function(p) {
		this.x = p.x;
		this.y = p.y;
		return this;
	},

	rotate: function(oP, deg) {
		// op  原点坐标
		// deg 旋转角度
		var nP   = this.sub(oP),
		  	hudu = (2 * Math.PI / 360) * deg,
		  	cos  = Math.cos(hudu),
		  	sin  = Math.sin(hudu);
		return new Point(  
			nP.x * cos - nP.y * sin + oP.x, 
			nP.x * sin + nP.y * cos + oP.y  
		);
	},

	round: function() {
		return new Point(
			Math.round( this.x ), 
			Math.round( this.y )
		);
	},

	ratio: function(ratio) {
		var x = Math.abs(this.x),
			y = Math.abs(this.y),
			rx = Math.round(x / ratio),
			ry = Math.round(y * ratio);
		if(x < y) {
			return new Point(this.x > 0 ? rx : -rx, this.y > 0 ? rx : -rx);
		}else{
			return new Point(this.x > 0 ? ry : -ry, this.y > 0 ? ry : -ry);
		}
	}
};