

export const createElement = function(tag, data = {}, ...children) {
    let key = data.key;
    if (key) {
        delete data.key;
    }
    return vnode(tag, data, key, children, undefined);
};

export const createTextNode = function(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
}; 

function vnode(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    };
}
