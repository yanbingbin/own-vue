import createMatcher from './create-matcher';
import install from './install';

class VueRouter{
    constructor(options) {
        // 匹配器，传入路径，拿到对应的记录，内部提供两个方法
        // match: 匹配规则
        // addRoutes: 动态添加路由
        this.matcher = createMatcher(options.routes || []); 
    }

    init(app) {

    }
}

VueRouter.install = install;