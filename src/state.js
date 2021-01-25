import { observe } from './observer/index';
import { isObject, proxy } from './utils/index';

export const initState = function(vm) {
    const options = vm.$options;

    // vue 的数据来源 属性 方法 数据 计算属性 watch

    if (options.props) {
        initProps(vm);
    }
    if (options.methods) {
        initMethod(vm);
    }
    if (options.data) {
        initData(vm);
    }
    if (options.computed) {
        initComputed(vm);
    }
    if (options.watch) {
        initWatch(vm);
    }
};
function initProps() {}
function initMethod() {}


function initData(vm) {
    // 数据初始化
    let data = vm.$options.data; // 用户传递的data
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;

    // 取值代理，可以直接通过 vm.属性名取值
    for (let key in data) {
        proxy(vm, '_data', key);
    }

    // 对象劫持 用户改变数据 通知视图刷新页面
    if (isObject(data)) {
        observe(data);
    }
}
function initComputed() {}
function initWatch() {}