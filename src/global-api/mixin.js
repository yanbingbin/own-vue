import { mergeOptions } from '../shared/utils';

export const initMixin = function(Vue) {
    Vue.mixin = function(mixin) {
        // 将属性合并到Vue.options上
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
};
    
