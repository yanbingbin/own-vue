import { nextTick } from '../shared/next-tick';

let queue = [];
let watcherIds = new Set();

function flushSchedularQueue() {
    queue.forEach(watcher => watcher.run());
    queue = []; // 清除数据方便下一次使用
    watcherIds.clear();
}

export const queueWatcher = function(watcher) {
    const id = watcher.id;
    if (!watcherIds.has(id)) {
        queue.push(watcher);
        watcherIds.add(id);
        // Vue.nextTick方法优先级 : promise => mutationObserve => setImmediate => setTimeout
        nextTick(flushSchedularQueue); 
    }
};