import createMatcher from './create-matcher';
import HashHistory from './history/hash';
import HTML5History from './history/html5';
import install from './install';

class VueRouter{
    constructor(options) {
        // 匹配器，传入路径，拿到对应的记录，内部提供两个方法
        // match: 匹配规则
        // addRoutes: 动态添加路由
        this.matcher = createMatcher(options.routes || []); 
        this.mode = options.mode || 'hash';

        switch (mode) {
            case 'history':
                this.history = new HTML5History(this);
                break;
            case 'hash':
                this.history = new HashHistory(this);
                break;
            default:
        }
    }

    init(app) {
        const history = this.history;
        const setupListeners = () => {
            history.setupListener(); // 监听路径变化
        };
        history.transitionTo( // 父类提供跳转方法
            history.getCurrentLocation(), // 子类实现不同的获取路径的方法
            setupListeners
        );
        history.listen((route) => {
            app._route = route; // 修改的是 vue 实例的，这样才能触发视图更新
        });
    }

    push(location) {
        window.location.hash = location;
    }

    match(location) {
        return this.matcher.match(location);
    }
}

VueRouter.install = install;