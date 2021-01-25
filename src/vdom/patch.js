

export const patch = function(oldVnode, vnode) {
    // 判断更新还是渲染
    const isRealElement = oldVnode.nodeType;

    if (isRealElement) {
        const oldElm = oldVnode; // div id=app
        const parentElm = oldElm.parentNode; // body

        let el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling);
        parentElm.removeChild(oldElm);
    }
    console.log('oldVnode: ', oldVnode);
    console.log('vnode: ', vnode);
    // 递归创建真实节点，替换老节点

};

// 根据虚拟节点创建真实节点
function createElm(vnode) { 
    let { tag, children, key, data, text } = vnode;

    if (typeof tag === 'string') { // 标签
        vnode.el = document.createElement(tag);
        updateProperties(vnode);
        children.forEach(child => { 
            return vnode.el.appendChild(createElm(child)); // 递归创建子节点，将子节点插入父节点中
        });
    } else { // 文本
        // 虚拟dom映射真实dom,方便后续更新操作
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}

// 更新属性
function updateProperties(vnode) {
    let newProps = vnode.data; // 获取当前虚拟节点的属性
    let el = vnode.el; // 当前真实节点
    for (let key in newProps) { // 将属性挂载到真实节点上
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName];
            } 
        } else if (key === 'class') {
            el.className = newProps.class;
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}