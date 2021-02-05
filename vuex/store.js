import applyMixin from './mixin';
import { forEachValue } from './utils';
import ModuleCollection from './module/module-collection';

export class Store {
    constructor(options) {
        this._actions = {};
        this._mutations = {};
        this._wrappedGetters = {};
        this._modules = new ModuleCollection(options);
        const state = this._modules.root.state; // 根的状态
        installModule(this, state, [], this._modules.root); // 安装模块

        resetStoreVm(this, state);
    }
    commit = (type, payload) => { 
        this._mutations[type].forEach(fn => fn.call(this, payload));
    }
    dispatch = (type, payload) => {
        this._actions[type].forEach(fn => fn.call(this, payload));
    }
    // 类的属性访问器，当用户去这个实例上取state属性时，会执行这个方法
    get state() {
        return this._vm._data.$$state;
    }

}

function installModule(store, rootState, path, module) {
    const namespace = store._modules.getNamespace(path); 
    if (path.length > 0) { // 子模块，将子模块的状态定义到根模块
        const parent = path.slice(0, -1).reduce((module, current) => {
            return module[current];
        }, rootState);
        Vue.set(parent, path[path.length - 1], module.state);
    }
    module.forEachMutation((mutation, key) => { 
        const namespacedType = namespace + key; // 增加命名空间 /name/mutationName
        store._mutations[namespacedType] = store._mutations[namespacedType] || [];
        store._mutations[namespacedType].push((payload) => {
            mutation.call(store, module.state, payload);
        });
    });
    module.forEachAction((action, key) => {
        const namespacedType = namespace + key;
        store._actions[namespacedType] = store._actions[namespacedType] || [];
        store._actions[namespacedType].push((payload) => {
            action.call(store, store, payload);
        });
    });
    module.forEachGetters((getter, key) => {
        const namespacedType = namespace + key;
        store._wrappedGetters[namespacedType] = function() { // 同名getter会覆盖
            return getter(module.state);
        };
    });
    module.forEachChild((child, key) => {
        installModule(store, rootState, path.concat(key), child);
    });
}

function resetStoreVm(store, state) {
    const computed = {};
    store.getters = {};
    const wrappedGetters = store._wrappedGetters;
    forEachValue(wrappedGetters, (fn, key) => { // 发布订阅模式
        computed[key] = () => { // 将用户定义的放到computed里面
            return fn(store.state);
        };
        Object.defineProperty(store.getters, key, { // 代理属性，vue中取值其实取的是计算属性
            get: () => store._vm[key]
        });
    });
    store._vm = new Vue({ // 利用 new Vue对state收集依赖，state发生改变时视图更新
        data: {
            $$state: state // $$ 代表内部属性，不会被代理到实例上
        },
        computed // 利用计算属性实现缓存
    });
}

let Vue;

export function install(_Vue) {
    if (Vue && _Vue === Vue) {
        return;
    }
    Vue = _Vue;
    applyMixin(Vue);
}