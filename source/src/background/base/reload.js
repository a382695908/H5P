/*
 * 刷新指定窗体类
 */
function Reload(form) {

	this.__form = form;
};
Reload.prototype.reload = function (callback){
	// 获取窗体ID
	var formId = this.__form.getId();

	if(formId){
		// 刷新指定窗体页面
		chrome.extension.getViews({ windowId : formId })[0].location.reload();
	};

	if(callback) callback.bind(this)();

	return this;
};