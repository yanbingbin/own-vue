import Watcher from './observer/watcher';
import { patch } from './vdom/patch';

export const lifecycleMixin = function(Vue) {
    Vue.prototype._update = function(vnode) {
        const vm = this;
        const prevVnode = vm._vnode; // 获取上次的vnode
        vm._vnode = vnode; // 保留这次的vnode
        if (!prevVnode) { // 第一次渲染没有上次的vnode，不进行diff
            vm.$el = patch(vm.$el, vnode); // 用虚拟 dom 创建真实 dom 替换 $el
        } else {
            vm.$el = patch(prevVnode, vnode); // 通过上次的虚拟dom和这次的虚拟dom对比更新
        }
    };
};

export const mountComponent = function(vm, el) {
    vm.$el = el; // 真实dom
    callHook(vm, 'beforeMount');
    // 渲染页面
    let updateComponent = function() { // 渲染、更新都调用此方法
        // vm._render() 通过解析 render 方法，渲染出虚拟 dom
        // vm._update() 通过虚拟 dom 创建真实的 dom 
        vm._update(vm._render());
    };
    // 渲染watcher 每个组件都有一个watcher
    new Watcher(vm, updateComponent, () => {}, true);
    callHook(vm, 'mounted');
};

export const callHook = function(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm);
        }
    }
};