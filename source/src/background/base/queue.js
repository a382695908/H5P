/*
 * 历史记录队列
 */
function Queue() {

	this._queue = [];
	this._flag = 0;
};

Queue.prototype = {

	push: function(obj) {
		//在指定的地方插入，清除后面元素
		if(this._flag != this._queue.length) {
			this._queue = this._queue.slice(0, this._flag);
		}
		this._queue.push(obj);
		this._flag++;
		return this;
	},

	canRevoke: function() {

		if(this._flag - 1 == 0) {
			return false;
		}
		return true;
	},

	revoke: function() {

		if(!this.canRevoke()) return null;
		
		return {
			data: this._queue[(--this._flag) - 1],
			revoke: this.canRevoke()
		}
	},

	canRedo: function() {

		if(this._flag == this._queue.length) {
			return false;
		}
		return true;
	},

	redo: function() {

		if(!this.canRedo()) return null;

		return {
			data: this._queue[(++this._flag) - 1],
			redo: this.canRedo
		}
	},

	count: function() {

		return this._flag;
	},

	clear: function() {
		this._queue.length = 0;
		this._flag = 0;
	}
};