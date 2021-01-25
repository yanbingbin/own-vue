import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifecycle';

function Vue(options) {
	this._init(options); // 进行 Vue 的初始化操作
}

initMixin(Vue);  // 给vue的原型添加方法
renderMixin(Vue);
lifecycleMixin(Vue);

export default Vue;