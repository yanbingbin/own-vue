import { mergeOptions } from '../shared/utils';

export const initExtend = function(Vue) {
    let cid = 0;
    // 创建一个子类，继承Vue,返回子类
    Vue.extend = function(extendOptions) {
        
        const Sub = function VueComponent(options) {
            this._init(options);
        };
        Sub.cid = cid++;
        Sub.prototype = Object.create(this.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(
            this.options,
            extendOptions
        );
        return Sub;
    };
};