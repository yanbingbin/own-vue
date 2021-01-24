import { isObject, def } from '../utils/index';
import { arrayMethods } from './array';

class Observer{
    constructor(value) {
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
    observe(value); // 递归深度检测
    Object.defineProperty(data, key, {
        get: function() {
            return value;
        },
        set: function(newVal) {
            if (value === newVal) return;
            value = newVal;
            observe(value); // 赋值为对象，继续劫持
        }
    });
}

// 核心使用 Object.defineProperty 监察数据
export const observe = function(data) {
    if (!isObject(data)) {
        return;
    }

    return new Observer(data); // 观察数据
};