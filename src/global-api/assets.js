
import { ASSET_TYPES } from '../shared/constants';

export const initAssetRegisters = function(Vue) {
    ASSET_TYPES.forEach(type => {
        Vue[type] = function(id, definition) {
            if (!definition) {
                return this.options[`${type}s`][id];
            }
            if (type === 'component') {
                // 注册全局组件
                // 使用extend方法，将对象变成构造函数
                // 子组件可能也有一个VueChild.component()，避免使用同一个extend使用this.options._base调用对应的Vue
                definition = this.options._base.extend(definition);
                this.options['components'][id] = definition;
            } else if (type === 'directive') {
                definition = { bind: definition, update: definition };
            } else if (type === 'filter') {
                //
            }
            this.options[`${type}s`][id] = definition;
            return definition;
        };
    });
};