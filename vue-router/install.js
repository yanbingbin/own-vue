import RouterLink from './components/router-link';
import RouterView from './components/router-view';

export let _Vue;

export default install = function(Vue) {
    if (install.installed && _Vue === Vue) return; // 已安装过
    install.installed = true;
    _Vue = Vue;

    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) { // 如果有router属性说明是根实例
                this._routerRoot = this; // 将根实例挂载在_routerRoot属性上
                this._router = this.$options.router; // 将当前router实例挂载在_router上
                this._router.init(this); // 初始化路由,这里的this指向的是根实例
                // 路径变化都会更改 current属性,我们将 current 变成响应式的， 
                // defineReactive的Dep此时会拿到当前渲染组件的watcher，这样当改变 _route 的时候，视图就会更新
                Vue.util.defineReactive(this, '_route', this._router.history.current);
            } else { // 利用Vue的渲染机制，父组件渲染后会渲染子组件，所以子组件可以通过$parent拿到父组件上的根实例
                // 保证所有子组件都拥有_routerRoot 属性，指向根实例
                // 保证所有组件都可以通过 this._routerRoot._router 拿到用户传递进来的路由实例对象
                this._routerRoot = this.$parent && this.$parent._routerRoot;
                
            }
        }
    });

    Vue.component('RouterView', View);
    Vue.component('RouterLink', Link);
};