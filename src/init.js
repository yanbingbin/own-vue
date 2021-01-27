import { initState } from './state';
import { compileToFunction } from './compiler/index';
import { mountComponent, callHook } from './lifecycle';
import { mergeOptions } from './shared/utils';
import { nextTick } from './shared/next-tick';


// 在原型上添加一个Init方法
export function initMixin(Vue) {
    // 初始化流程
    Vue.prototype._init = function(options) {
        // 数据的劫持
        const vm = this; // vue中使用 this.$options 指代的就是用户传递的属性
        vm.$options = mergeOptions(vm.constructor.options, options);
        // 调用生命周期钩子
        callHook(vm, 'beforeCreate');
        // 初始化状态
        initState(vm); 
        callHook(vm, 'created');

        // 如果用户传入了 el 属性,实现挂载流程，将页面渲染
        if (vm.$options.el) {
            vm.$mount(vm.$options.el);
        }

    };
    // vue模板渲染流程
    // 1. 将 template 转化成 ast 语法树 { tag: 'div', type: 1, attrs: [{ name: 'id', value: 'app' }], parent: null, children: [{ tag: 'p', type: 1, attrs: [], parent: { ... 该对象 }, children: [{ text: '{{ name }}', type: 3 }]  }] }
    // 2. 通过 ast 语法树生成 render 方法   function() { with(this){return _c('div', { id: "app",style: {"width":" 100px"," height":" 100px"} },_c('p', undefined,_v(_s(name))),_c('p', undefined,_v("{{age}}")))}}
    // 3. 通过 render 方法生成虚拟 dom 
    // 4. 通过虚拟 dom 生成 真实 dom
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
        mountComponent(vm, el);
    };

    Vue.prototype.$nextTick = nextTick;
}