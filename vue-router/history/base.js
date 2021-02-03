
export class History {
    constructor(router) {
        this.router = router;
        // 根据记录和路径返回对象，用于router-view的匹配
        this.current = createRoute(null, {
            path: '/'
        }); // { path: '/', matched: [] }
        this.cb = null;
    }
    transitionTo(location, onComplete) {
        // 获取当前路径匹配对应的记录，当路径变化时获取对应的记录，根据记录里面的组件渲染页面
        let route = this.router.match(location);
        if (location === route.path && route.matched.length === this.current.matched.length) { // 相同的路径不过渡
            return;
        }
        const queue = this.router.beforeHooks;
        const iterator = (hook, next) => {
            hook(route, this.current, () => { // from to next
                next();
            });
        };
        runQueue(queue, iterator, () => { // 路径变化，执行钩子函数
            this.updateRoute(route); // 更新当前的记录
            onComplete && onComplete();
        });
    }
    updateRoute(route) {
        this.current = route;
        this.cb && this.cb(route); // 更新current后 更新_route属性 触发视图更新
    }
    listen(cb) {
        this.cb = cb; // 注册函数
    }
}

export function createRoute(record, location) {
    const matched = [];
    if (record) {
        while (record) {
            matched.unshift(record); // 递归将当前记录的父亲记录放到前面
            record = record.parent;
        }
    }
    return {
        ...location,
        matched
    };
}

function runQueue(queue, iterator, cb) {
    function next(index) {
        if (index >= queue.length) {
            cb();
        } else {
            const hook = queue[index];
            iterator(hook, () => {
                next(index + 1);
            });
        }
    }
    next(0);
}