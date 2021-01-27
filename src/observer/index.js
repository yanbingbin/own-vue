import { isObject, def } from '../shared/utils';
import { arrayMethods } from './array';
import Dep from './dep';

class Observer{
    constructor(value) {
        this.dep = new Dep(); // 数组使用
        def(value, '__ob__', this); // 给每一个被观测的对象添加__ob__属性，值是 this
        if (Array.isArray(value)) {
            // 通过__proto__修改数组的原型指向，使用重写方法拦截,数组不对索引观测，会导致性能问题
            value.__proto__ = arrayMethods; 
            // 如果数组内的元素时对象，去观测
            this.observerArray(value);
        } else {
            this.walk(value);
        }
    }
    observerArray(value) {
        for (let i = 0; i < value.length; i++) {
            observe(value[i]);
        }
    }
    walk(data) {
        let keys = Object.keys(data);
        keys.forEach(key => {
            let value = data[key];
            defineReactive(data, key, value); // 定义响应式数据
        });
    }
}

function defineReactive(data, key, value) {
    let dep = new Dep(); // 对象使用，数组拿不到
    let childOb = observe(value); // 递归深度检测，传入的value可能是数组
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function() {
            // 收集依赖，每个属性都有自己的watcher
            if (Dep.target) {
                dep.depend(); // 双向依赖，让watcher保存dep，并且让dep 保存watcher
                if (childOb) { // 为了收集数组的依赖
                    childOb.dep.depend(); // 重复依赖会自动去掉 Set
                    if (Array.isArray) { // 数组内部还是数组,需要递归收集数组依赖
                        dependArray(value);
                    }
                }
            }
            return value;
        },
        set: function(newVal) {
            if (value === newVal) return;
            value = newVal;
            observe(value); // 赋值为对象，继续劫持
            dep.notify(); // 通知依赖的 watcher 更新
        }
    });
}

function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i];
        current.__ob__ && current.__ob__.dep.depend();
        if (Array.isArray(current)) { // 递归收集子元素为数组的依赖
            dependArray(current);
        }
    }
}

// 核心使用 Object.defineProperty 监察数据
export const observe = function(data) {
    if (!isObject(data)) {
        return;
    }

    return new Observer(data); // 观察数据
};