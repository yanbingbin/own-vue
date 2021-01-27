// dep 和 watcher 多对多的关系
// 一个 dep 可以存放多个 watcher 
// 一个 watcher 也可以存放多个 dep

import { pushTarget, popTarget } from './dep';

let id = 0;
class Watcher {
    constructor(vm, exprOrFn, callback, options) {
        this.vm = vm;
        this.exprOrFn = exprOrFn;
        if (typeof exprOrFn == 'function') {
            this.getter = exprOrFn; // 渲染函数
        }
        this.callback = callback;
        this.options = options;
        this.id = id++;
        this.deps = [];
        this.depsId = new Set();
        this.get(); // 执行渲染 watcher
    }
    get() {
        pushTarget(this); // Dep.target保存当前 watcher
        this.getter(); // 渲染页面
        popTarget(); 
    }
    update() {
        queueWatcher(this);
    }
    run() {
        this.get();
    }
    addDep(dep) {
        const id = dep.id;
        if (!this.depsId.has(id)) { // 保证一个 watcher 不重复存放 dep
            this.depsId.add(id);
            this.deps.push(dep);
            dep.addSub(this); // dep 存放 watcher
        }
    }
}

let queue = [];
let watcherIds = new Set();

function queueWatcher(watcher) {
    const id = watcher.id;
    if (!watcherIds.has(id)) {
        queue.push(watcher);
        watcherIds.add(id);
        setTimeout(() => {
            queue.forEach(watcher => watcher.run());
            queue = [];
            watcherIds.clear();
        }, 0);
    }
}

export default Watcher;