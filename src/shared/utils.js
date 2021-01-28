import { LIFECYCLE_HOOKS } from './constants';

// 判断参数是否是对象
export const isObject = function(data) {
    return data !== null && typeof(data) === 'object';
};

// 定义数据
export const def = function(data, key, value) {
    // 给每一个被观测的对象添加__ob__属性，值是 this，设置为不可枚举，不可遍历，遍历再次遍历 __ob__
    Object.defineProperty(data, key, { 
        enumerable: false,
        configurable: false, 
        value
    });
};

// 代理数据
export const proxy = function(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newVal) {
            vm[source][key] = newVal;
        }
    });
};

let strats = {}; // 合并策略



function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        }   
        return [childVal];
    } 
    return parentVal;
}

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook;
});

// 组件合并策略
function mergeAssets(parentVal, childVal) {
    const res = Object.create(parentVal);
    if (childVal) {
        for (let key in childVal) {
            res[key] = childVal[key];
        }
    }
    return res;
}
strats.components = mergeAssets;

// 合并对象
export const mergeOptions = function(parent, child) {
    const options = {};

    for (let key in parent) {
        mergeField(key);
    }
    for (let key in child) {
        if (!Object.prototype.hasOwnProperty.call(parent, key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        if (strats[key]) { // 对生命周期采用合并策略合并
            options[key] = strats[key](parent[key], child[key]);
        } else {
            if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
                options[key] = {
                    ...parent[key],
                    ...child[key]
                };
            } else if (child[key] == null) {
                options[key] = parent[key];
            } else {
                options[key] = child[key];
            }
        }
    }

    return options;
}; 
