import { parseHTML } from './parse-html';

function genProps(attrs) { // 处理属性，拼接成字符串
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            // style="width: 100px; height: 100px" => { style: { width: '100px' , height: '100px' } }
            let obj = {};
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}: ${JSON.stringify(attr.value)},`;
    }
    return `{ ${str.slice(0, -1)} }`; // 去除多余的,
}

function generate(el) {
    let code = `_c('${el.tag}', ${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    })`;
    console.log('code: ', code);
}
// ast 语法树 用对象描述原生语法  
// 虚拟dom 用对象描述dom节点
export const compileToFunction = function (template) {
    // 解析html字符串，生成ast语法树
    let root = parseHTML(template); // root: { tag: 'div', type: 1, attrs: [{ name: 'id', value: 'app' }], parent: null, children: [{ tag: 'p', type: 1, attrs: [], parent: { ... 该对象 }, children: [{ text: '{{ name }}', type: 3 }]  }] }
    // 将ast语法树生成最终的render函数，字符串拼接
    let code = generate(root);
    // _c('div', { id: 'app' }, _c('p', undefined, _v('hello' + _s(name))), _v('hello'));

    return function render() {

    };
};