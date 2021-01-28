import { ASSET_TYPES } from '../shared/constants';
import { mergeOptions } from '../shared/utils';

export const initExtend = function(Vue) {
    Vue.extend = function(extendOptions) {
        const Sub = function VueComponent(options) {
            this._init(options);
        };
        Sub.prototype = Object.create(this.prototype);
        Sub.prototype.constructor = Sub;
        Sub.options = mergeOptions(
            this.options,
            extendOptions
        );
        return Sub;
    };
};