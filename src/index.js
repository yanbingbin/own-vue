import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifecycle';
import { initGlobalAPI } from './global-api/index';

function Vue(options) {
	this._init(options); // 进行 Vue 的初始化操作
}
initMixin(Vue);  // 给vue的原型添加方法 _init $mount
renderMixin(Vue); // _render $nextTick _c _v _s
lifecycleMixin(Vue); // _update 生命周期
initGlobalAPI(Vue); // mixin extend 全局api处理

export default Vue;