
let callbacks = [];
let pending = false;

function flushCallBacks() {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
        copies[i]();
    }
}

export const nextTick = function(cb) {
    callbacks.push(cb);
    if (!pending) { // 等待上个nextTick开始清空，防止用户手动调用$nextTick多次触发 setTimeout
        pending = true;
        setTimeout(flushCallBacks, 0); 
    }
};