/*
 * 尺寸类
 * @param w {int}
 * @param h {int}
 */
function Size(w, h) {
	this.width  = w || 0;
	this.height = h || 0;
};

Size.prototype = {
	
	add: function(s) {
	
		return new Size(this.width  + s.width, 
				        this.height + s.height);
	},
	
	sub: function(s) {
	
		return new Size(this.width  - s.width, 
				        this.height - s.height);
	},

	mul: function(s) {
	
		return new Size(this.width  * s.width, 
				        this.height * s.height);
	},

	div: function(s) {
	
		return new Size(this.width  / s.width, 
				        this.height / s.height);
	},

	resize: function(s) {
		
		return new Size(s.width,
			            s.height);
	},

	clone: function() {
	
		return new Size(this.width, this.height);
	},

	scale: function(cofe) {
	
		return new Size(this.width  * cofe,
			            this.height * cofe);
	},

	ceil: function(){

		return new Size( Math.ceil( this.width ),
						 Math.ceil( this.height ));
	},

	floor: function(){

		return new Size( Math.floor( this.width ),
						 Math.floor( this.height ));
	},

	mutableAdd: function(s) {
	
		this.width  += s.width;
		this.height += s.height;
		
		return this;
	},

	mutableSub: function(s) {
	
		this.width  -= s.width;
		this.height -= s.height;
		
		return this;
	},

	mutableMul: function(s) {
	
		this.width  *= s.width;
		this.height *= s.height;
		
		return this;
	},

	mutableDiv: function(s) {
	
		this.width  /= s.width;
		this.height /= s.height;
		
		return this;
	},

	mutableResize: function(s) {
	
		this.width  = s.width;
		this.height = s.height;
		
		return this;
	},

	mutableScale: function(coef) {
	
		this.width  *= coef;
		this.height *= coef;
		
		return this;
	}
};