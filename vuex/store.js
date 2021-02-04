import applyMixin from './mixin';
import { forEachValue } from './utils';

export class Store {
    constructor(options) {
        let state = options.state;
        this.getters = {};
        const computed = {};
        forEachValue(options.getters, (fn, key) => {
            computed[key] = () => { // 将属性放到computed里面
                return fn(this.state);
            };
            Object.defineProperty(this.getters, key, {
                get: () => this._vm[key] // 取的是computed的属性
            });
        });
        this._vm = new Vue({ // 利用 new Vue对state收集依赖，state发生改变时视图更新
            data: { // $$ 代表内部属性，不会被代理到实例上
                $$state: state
            },
            computed // 利用计算属性实现缓存
        });
    }
    // 类的属性访问器，当用户去这个实例上取state属性时，会执行这个方法
    get state() {
        return this._vm._data.$$state;
    }
}

let Vue;

export function install(_Vue) {
    if (Vue && _Vue === Vue) {
        return;
    }
    Vue = _Vue;
    applyMixin(Vue);
}