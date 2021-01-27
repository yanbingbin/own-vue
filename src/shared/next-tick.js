
let callbacks = [];
let pending = false;

function flushCallBack() {
    pending = false;
    callbacks.forEach(cb => cb());
    callbacks = [];
}

export const nextTick = function(cb) {
    callbacks.push(cb);
    if (!pending) { // 等待上个nextTick开始清空
        pending = true;
        setTimeout(flushCallBack, 0); 
    }
};