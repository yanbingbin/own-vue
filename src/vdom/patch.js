

export const patch = function(oldVnode, vnode) {
    if (!oldVnode) { // 可能是渲染组件
        return createElm(vnode);
    } else {
        // 判断更新还是渲染
        if (oldVnode.nodeType == 1) {
            // 用vnode  来生成真实dom 替换原本的dom元素
            const parentElm = oldVnode.parentNode; // 找到他的父亲
            let elm = createElm(vnode); // 根据虚拟节点 创建元素
    
            // 在第一次渲染后 是删除掉节点，下次在使用无法获取
            parentElm.insertBefore(elm, oldVnode.nextSibling);
    
            parentElm.removeChild(oldVnode);
    
    
            return elm;
        }
    }
};

// 根据虚拟节点创建真实节点
function createElm(vnode) { 
    let { tag, children, key, data, text } = vnode;

    if (typeof tag === 'string') { // 标签
        if (createComponent(vnode)) { // 组件的话返回绑定的实例上的真实dom
            return vnode.componentInstance.$el;
        }

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

function createComponent(vnode) {
    let i = vnode.data;
    if ((i = i.hook) && (i = i.init)) {
        i(vnode); // 执行组件的init方法
    }
    if (vnode.componentInstance) {
        return true;
    }
}

// 更新属性
function updateProperties(vnode) {
    let newProps = vnode.data; // 获取当前虚拟节点的属性
    let el = vnode.el; // 当前真实节点
    for (let key in newProps) { // 将属性挂载到真实节点上
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName.trim()] = newProps.style[styleName];
            } 
        } else if (key === 'class') {
            el.className = newProps.class;
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}