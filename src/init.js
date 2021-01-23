import { initState } from './state';


// 在原型上添加一个Init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function(options) {
        // 数据的劫持
        const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
        vm.$options = options;

        // 初始化状态
        initState(vm); 
    };

}