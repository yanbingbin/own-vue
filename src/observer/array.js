// 重写数组方法 push pop shift unshift reverse sort splice

const oldArrayMethods = Array.prototype;

// arrayMethods.__proto__ 指向 oldArrayMethods 也就是 Array.prototype
// 利用原型链的查找机制，value.__proto__ = arrayMethods
// 会先在 arrayMethods 上找重写的方法
export const arrayMethods = Object.create(oldArrayMethods); // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。

// 重写的方法
const methods = [
    'push',
    'pop',
    'shift',
    'unshift', 
    'reverse', 
    'sort', 
    'splice'
];

methods.forEach(method => {
    arrayMethods[method] = function(...args) {
        const result = oldArrayMethods[method].apply(this, args); // 调用原生的方法
        let inserted; // 用户插入的数据，可能还是对象
        let ob = this.__ob__;
        console.log('ob: ', ob); 
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice': 
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        if (inserted) { // 将新增属性继续观测
            ob.observerArray(inserted);
        }
        ob.dep.notify(); // 触发更新
        return result;
    };
});