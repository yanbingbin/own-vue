
import { initMixin } from './mixin';
import { initExtend } from './extend';
import { initAssetRegisters } from './assets';
import { ASSET_TYPES } from '../shared/constants';

export const initGlobalAPI = function(Vue) {
    // 整合所有全局相关内容
    Vue.options = Object.create(null);

    // 初始化全局 组件 指令 过滤器
    ASSET_TYPES.forEach(type => {
        Vue.options[type + 's'] = Object.create(null);
    });

    Vue.options._base = Vue; // _base 标识Vue的构造函数

    initMixin(Vue);
    initExtend(Vue);
    // 注册API方法
    initAssetRegisters(Vue);
};