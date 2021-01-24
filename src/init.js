import { initState } from './state';
import { compileToFunction } from './compiler/index';


// 在原型上添加一个Init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function(options) {
        // 数据的劫持
        const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
        vm.$options = options;

        // 初始化状态
        initState(vm); 

        // 如果用户传入了 el 属性,实现挂载流程，将页面渲染
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }

    };

    Vue.prototype.$mount = function(el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);

        // 默认会先去查找有没有 render 方法，没有就去找 template，再没有去用 el 的内容
        // 优先级 render -> template -> el
        if (!options.render) {
            // 对模板进行编译
            let template = options.template; // 取出模板

            if (!template && el) {
                template = el.outerHTML;
            }
            const render = compileToFunction(template); // 将模板转成render
            options.render = render;
        }
    };

}