import { mergeOptions } from '../shared/utils';

export const initGlobalAPI = function(Vue) {
    // 整合所有全局相关内容
    Vue.options = {};
    
    Vue.mixin = function(mixin) {
        // 将属性合并到Vue.options上
        this.options = mergeOptions(this.options, mixin);
        return this;
    };
};