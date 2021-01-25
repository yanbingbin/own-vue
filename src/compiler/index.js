import { parseHTML } from './parse-html';

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

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

function getChildren(el) { // 生成子节点
    const children = el.children;
    if (children) {
        return `${children.map(c => gen(c)).join(',')}`;
    } 
    return false;
}

function gen(node) {
    if (node.type === 1) { // 标签节点
        return generate(node);
    } else { // 文本节点
        let text = node.text;
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`;
        }
        let lastIndex = defaultTagRE.lastIndex = 0;
        let tokens = [];
        let match, index;

        while ((match = defaultTagRE.exec(text))) {
            index = match.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push(`_s(${match[1].trim()})`);
            lastIndex = index + match[0].length;
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }
            return `_v(${tokens.join('+')})`;
        }
    }
}

function generate(el) {
    const children = getChildren(el);
    return `_c('${el.tag}', ${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${
        children ? `,${children}` : ''
    })`;
}
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