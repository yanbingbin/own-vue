import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifecycle';
import { initGlobalAPI } from './initGlobalAPI/index';

function Vue(options) {
	this._init(options); // 进行 Vue 的初始化操作
}

initMixin(Vue);  // 给vue的原型添加方法
renderMixin(Vue); // 渲染
lifecycleMixin(Vue); // 生命周期
initGlobalAPI(Vue); // 全局数据处理

export default Vue;