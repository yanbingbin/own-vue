import Watcher from './observer/watcher';
import { patch } from './vdom/patch';

export const lifecycleMixin = function(Vue) {
    Vue.prototype._update = function(vnode) {
        console.log('vnode: ', vnode);
        const vm = this;
        vm.$el = patch(vm.$el, vnode); // 用虚拟 dom 创建真实 dom 替换 $el
    };
};

export const mountComponent = function(vm, el) {
    vm.$el = el; // 真实dom

    // 渲染页面
    let updateComponent = function() { // 渲染、更新都调用此方法
        // vm._render() 通过解析 render 方法，渲染出虚拟 dom
        // vm._update() 通过虚拟 dom 创建真实的 dom 
        vm._update(vm._render());
    };
    // 渲染watcher 每个组件都有一个watcher
    new Watcher(vm, updateComponent, () => {}, true);
};