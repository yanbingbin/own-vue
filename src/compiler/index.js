import { parseHTML } from './parse-html';
import { generate } from './generate';

// ast 语法树 用对象描述原生语法  
// 虚拟dom 用对象描述dom节点
export const compileToFunction = function (template) {
    // 解析html字符串，生成ast语法树
    const root = parseHTML(template); // root: { tag: 'div', type: 1, attrs: [{ name: 'id', value: 'app' }], parent: null, children: [{ tag: 'p', type: 1, attrs: [], parent: { ... 该对象 }, children: [{ text: '{{ name }}', type: 3 }]  }] }
    // 将ast语法树生成最终的render函数，字符串拼接
    const code = generate(root);
    // _c('div', { id: 'app' }, _c('p', undefined, _v('hello' + _s(name))), _v('hello'));
    const render = `with(this){return ${code}}`;
    const renderFn = new Function(render);
    return renderFn;
};