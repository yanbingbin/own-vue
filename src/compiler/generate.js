
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

export const generate = function(el) {
    const children = getChildren(el);
    return `_c('${el.tag}', ${
        el.attrs.length ? genProps(el.attrs) : 'undefined'
    }${
        children ? `,${children}` : ''
    })`;
};