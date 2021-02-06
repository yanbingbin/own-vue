import applyMixin from './mixin';
import { forEachValue } from './utils';
import ModuleCollection from './module/module-collection';

export class Store {
    constructor(options) {
        this._actions = {};
        this._mutations = {};
        this._wrappedGetters = {};
        this._subscribers = [];
        this._modules = new ModuleCollection(options); // 收集模块转成树形结构
        this.strict = options.strict; // 严格模式
        this._committing = false; // 同步的watcher
        const state = this._modules.root.state; // 根的状态
        installModule(this, state, [], this._modules.root); // 安装模块
        resetStoreVM(this, state); // 将状态放到vue实例
        options.plugins.forEach(plugin => plugin(this)); // 执行插件
    }
    _withCommit(fn) {
        const committing = this._committing;
        this._committing = true; // 在函数调用前 表示_committing为true
        fn();
        this._committing = committing;
    }
    subscribe(fn) { // 订阅
        this._subscribers.push(fn);
    }
    replaceState(state) { // 用最新的状态进行替换，例如持久化插件，可用本地local的state使用该方法更新state,处理刷新state丢失
        this._withCommit(() => {
            this._vm._data.$$state = newState;
        });
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
    registerModule(path, rawModule) {
        if (typeof path == 'string') path = [path];
        this._modules.register(path, rawModule); // 模块注册
        installModule(this, this.state, path, this._modules.get(path)); // 安装模块，动态新增状态
        resetStoreVM(this, this.state); // 重新定义getters
    }
}

function installModule(store, rootState, path, module) {
    const namespace = store._modules.getNamespace(path); 
    if (path.length > 0) { // 子模块，将子模块的状态定义到根模块
        const parent = path.slice(0, -1).reduce((module, current) => {
            return module[current];
        }, rootState);
        store._withCommit(() => {
            Vue.set(parent, path[path.length - 1], module.state);
        });
    }
    module.forEachMutation((mutation, key) => { 
        const namespacedType = namespace + key; // 增加命名空间 /name/mutationName
        store._mutations[namespacedType] = store._mutations[namespacedType] || [];
        store._mutations[namespacedType].push((payload) => { 
            this._withCommit(() => {
                mutation.call(store, getState(store, path), payload); // 更改状态
            });
            store._subscribers.forEach(sub => sub({ mutation, type }, store, state)); // 调用订阅事件
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
            return getter(getState(store, path));
        };
    });
    module.forEachChild((child, key) => { 
        installModule(store, rootState, path.concat(key), child); // 递归注册子模块
    });
}

function resetStoreVM(store, state) {
    const oldVm = store.vm;
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
    if (store.strict) { // 严格模式下只能通过mutation修改状态，否则进行报错提示
        store._vm.$watch(() => store._vm._data.$$state, () => { // 只要状态一变化会立即执行,在状态变化后同步执行
            console.assert(store._committing, '在mutation之外更改了状态'); // 如果断言为false，则将一个错误消息写入控制台。如果断言是 true，没有任何反应。
        }, { deep: true, sync: true });
    }
    if (oldVm) {
        Vue.nextTick(() => oldVm.$destory());
    }
}

function getState(store, path) {
    return path.reduce((newState, current) => {
        return newState[current];
    }, store.state);
}

let Vue;

export function install(_Vue) {
    if (Vue && _Vue === Vue) {
        return;
    }
    Vue = _Vue;
    applyMixin(Vue);
}