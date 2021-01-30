import { createElement, createTextNode } from './vdom/create-element';
import { nextTick } from './shared/next-tick';

export const renderMixin = function(Vue) {
    Vue.prototype._c = function() {
        return createElement(this, ...arguments);
    };
    Vue.prototype._v = function(text) {
        return createTextNode(this, text);
    };
    Vue.prototype._s = function(val) {
        return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
    };  
    Vue.prototype._render = function() {
        const vm = this;
        const { render } = vm.$options;
    
        let vnode = render.call(vm);
        return vnode;
    };
    Vue.prototype.$nextTick = function(fn) {
        return nextTick(fn, this);
    };
};