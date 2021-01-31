

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

function createKeyToOldIndex(children, beginIndex, endIndex) {
    const map = {};
    for (let i = beginIndex; i <= endIndex; ++i) {
        let key = children[i].key;
        if (key) {
            map[key] = i;
        }
    }
    return map;
}

// vue2采用双指针，头尾缩进比对
function updateChildren(parentElm, oldChildren, newChildren) {
    let oldStartIndex = 0; // 老节点头指针
    let oldStartVnode = oldChildren[0]; // 头指针对应的虚拟节点
    let oldEndIndex = oldChildren.length - 1; // 老节点尾指针
    let oldEndVnode = oldChildren[oldEndIndex]; // 尾指针对应虚拟节点

    let newStartIndex = 0;
    let newStartVnode = newChildren[0];
    let newEndIndex = newChildren.length - 1;
    let newEndVnode = newChildren[newEndIndex];

    let oldKeyToIndex; // 老节点的key所在的索引map 
    let indexInOld; // 当前移动节点在老节点的索引
    let vnodeToMove; // 当前要移动的节点

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) { // 乱序元素被移动导致的undefined需要跳过
            oldStartVnode = oldChildren[++oldStartIndex];
        } else if (!oldEndVnode) { // 乱序元素被移动导致的undefined需要跳过
            oldEndVnode = oldChildren[--oldEndIndex];
        } else if (sameVnode(oldStartVnode, newStartVnode)) { // 在尾部添加子节点，头指针后移
            patch(oldStartVnode, newStartVnode); // 复用真实DOM
            oldStartVnode = oldChildren[++oldStartIndex];
            newStartVnode = newChildren[++newStartIndex];
        } else if (sameVnode(oldEndVnode, newEndVnode)) { // 在头部添加子节点，尾指针前移
            patch(oldEndVnode, newEndVnode);
            oldEndVnode = oldChildren[--oldEndIndex]; 
            newEndVnode = newChildren[--newEndIndex];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // 头节点移动到尾部
            patch(oldStartVnode, newEndVnode);
            parentElm.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // insertBefore会将原来的元素移走
            oldStartVnode = oldChildren[++oldStartIndex];
            newEndVnode = newChildren[--newEndIndex];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // 尾节点移动到头部
            patch(oldEndVnode, newStartVnode);
            parentElm.insertBefore(oldEndVnode.el, oldStartVnode.el);
            oldEndVnode = oldChildren[--oldEndIndex];
            newStartVnode = newChildren[++newStartIndex];   
        } else { // 头与头、尾与尾，交叉头尾都不相同
            if (!oldKeyToIndex) { // 创建老节点的key对应索引的map表
                oldKeyToIndex = createKeyToOldIndex(oldChildren, oldStartIdx, oldEndIndex); 
            }
            indexInOld = oldKeyToIndex(newStartVnode.key); // 找到新节点在老节点的索引位置，利用key对比
            if (!indexInOld) { // 找不到说明是新元素,在当前老的开始节点前直接插入
                parentElm.insertBefore(createElm(newStartVnode), oldStartVnode.el);
            } else { // 找到了
                vnodeToMove = oldChildren[indexInOld]; // 拿到要移动的节点
                oldChildren[indexInOld] = undefined; // 将移动的节点的位置置为undefined，之后碰到就跳过位置
                patch(vnodeToMove, newStartVnode); // 还要对比子节点
                parentElm.insertBefore(vnodeToMove.el, oldStartVnode.el); // 将找到的节点插入到当前老的开始节点前
            }
            newStartVnode = newChildren[++newStartIndex];
        }
    }

    if (newStartIndex <= newEndIndex) { // 新的children指针头指针小于等于尾指针，说明有新的元素加入
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            const nextEl = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;
            // if (nextEl === null) { // 在末尾插入的元素
            //     parentElm.insertBefore(createElm(newChildren[i]), null);
            // } else { // 在开头插入元素
            //     parentElm.insertBefore(createElm(newChildren[i]), nextEl);
            // }
            parentElm.insertBefore(createElm(newChildren[i]), nextEl); // nextEl 是要在哪个元素前面插入, 为末尾时， null 在末尾插入，否则在尾指针的元素前面插入
        }
    }
    if (oldStartIndex <= oldEndIndex) { // 老children的头指针小于尾指针，说明有元素有剩余，需要删除
        for (let i = oldStartVnode; i <= oldEndIndex; i++) {
            let child = oldChildren[i];
            if (child) {
                parent.removeChild(child.el);
            }
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