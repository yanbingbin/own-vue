import { isObject, isReservedTag } from '../shared/utils';

export const createElement = function(vm, tag, data = {}, ...children) {
    // 如果tag是组件 应该渲染一个组件的vnode
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined);
    } else {
        const Ctor = vm.$options.components[tag];
        return createComponent(vm, tag, data, data.key, children, Ctor);
    }
};
function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
        Ctor = vm.$options._base.extend(Ctor);
    }
    data.hook = {
        init(vnode) {
            const child = vnode.componentInstance = new Ctor({ _isComponent: true }); // 之后创建真实节点会用到
            child.$mount(); // 组件挂载
        }
    };
    return vnode(vm, `vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, { Ctor, children });
}

export const createTextNode = function(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
}; 

function vnode(vm, tag, data, key, children, text, componentOptions) {
    return {
        vm,
        tag,
        data,
        key,
        children,
        text,
        componentOptions
    };
}
