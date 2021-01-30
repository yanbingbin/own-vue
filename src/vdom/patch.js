

export const patch = function(oldVnode, vnode) {
    if (!oldVnode) { // 空挂载，渲染组件
        return createElm(vnode);
    } else {
        const isRealElement = oldVnode.nodeType; // 是否是真实元素
        if (isRealElement){
            // 用vnode  来生成真实dom 替换原本的dom元素
            const parentElm = oldVnode.parentNode; // 找到他的父亲
            let elm = createElm(vnode); // 根据虚拟节点 创建元素
    
            parentElm.insertBefore(elm, oldVnode.nextSibling); // 在老节点的前面添加新生成的元素
            parentElm.removeChild(oldVnode); // 移除老节点
    
            return elm;
        } else { // 虚拟节点进行对比
            if (oldVnode.tag !== vnode.tag) { // 标签不一致，直接将老节点完全替换
                oldVnode.el.parentNode.replaceChild(createElm(vnode));
            }
            if (!oldVnode.tag && oldVnode.text !== vnode.text) { // 文本节点
                oldVnode.textContent = vnode.text;
            }   
            vnode.el = oldVnode.el; // 标签相同时，复用老节点，对比属性
            updateProperties(vnode, oldVnode.data); // 更新属性
            // 对比子节点
            let oldChildren = oldVnode.children || [];
            let newChildren = vnode.children || [];

            if (newChildren.length && oldChildren.length) { // 新、老节点都有子节点
                updateChildren(vnode.el, oldChildren, newChildren); // 对比更新el
            } else if (newChildren.length) { // 只有新节点有子节点
                for (let i = 0; i < newChildren.length; i++) {
                    vnode.el.appendChild(createElm(newChildren[i]));
                }
            } else if (oldChildren.length) { // 只有老节点有子节点
                vnode.el.innerHTML = ''; // 
            }

        }
    }
};

function sameVnode(oldVnode, newVnode) { // 如果tag相同且key相同，则认为是同一个节点，复用该节点
    return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key);
}

// vue2采用双指针，头尾缩进比对
function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0;
    let oldStartVnode = oldChildren[0];
    let oldEndIndex = oldChildren.length - 1;
    let oldEndVnode = oldChildren[oldEndIndex];

    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (sameVnode(oldStartVnode, newStartVnode)) { // 优化向后添加子节点
            patch(oldStartVnode, newStartVnode); // 复用真实DOM
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex];
            newEndVnode = newChildren[--newEndIndex];
        }
    }

    if (newStartIndex <= newEndIndex) { // 将新添加的子节点插入
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            parent.appendChild(createElm(newChildren[i]));
        }
    }
}

// 根据虚拟节点创建真实节点
export function createElm(vnode) { 
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
function updateProperties(vnode, oldProps = {}) {
    let newProps = vnode.data || {}; // 获取当前虚拟节点的属性
    let el = vnode.el; // 当前真实节点

    // 对比样式
    const newStyle = newProps.style || {};
    const oldStyle = oldProps.style || {};

    for (const key in oldStyle) { // 将新节点上没有的样式删除，此时vnode.el是老节点的，所以需要处理之前的节点样式及属性
        if (!newStyle[key]) {
            el.style[key] = ''; 
        }
    }

    for (const key in oldProps) { // 清除多余属性
        if (!newProps[key]) {
            el.removeAttribute(key);
        }
    }

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