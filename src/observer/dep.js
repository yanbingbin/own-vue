let id = 0;
class Dep {
    constructor() {
        this.id = id++;
        this.subs = [];
    }
    depend() {
        Dep.target.addDep(this); // watcher 中存放 dep
    }
    notify() {
        this.subs.forEach(watcher => {
            watcher.update();
        });
    }
    addSub(watch) {
        this.subs.push(watch); // dep 中存放 watcher
    }
}

let stack = [];

export const pushTarget = function(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
};

export const popTarget = function() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
};

export default Dep;