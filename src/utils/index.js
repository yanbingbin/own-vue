// 判断参数是否是对象
export const isObject = function(data) {
    return data !== null && typeof(data) === 'object';
};

// 定义数据
export const def = function(data, key, value) {
    Object.defineProperty(data, key, { // 给每一个被观测的对象添加__ob__属性，值是 this
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