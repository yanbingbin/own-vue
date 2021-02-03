export default {
    name: 'RouterView',
    functional: true, // 标记是函数式组件，可以降低消耗，不走extend，没有this、生命周期
    render(h, { parent, data }) { // parent: 当前父组件  data: 组件上的一些标识
        // 组件渲染是从外到内，先渲染父组件,如果发现父组件中存在<router-view>在去渲染对应的子组件,直到所有组件渲染完成。 
        // 渲染是通过render函数的h方法进行渲染
        let route = parent.$route;
        let depth = 0;
        data.routeView = true; // 标识路由属性

        while (parent) { // 组件被渲染时，通过向上查找父组件是否存在routerView来确定组件的深度
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++;
            }
            parent = parent.$parent;
        }

        let record = route.matched[depth];
        if (!record) { // 找不到匹配的记录
            return h();
        }
        return h(record.component, data); // 渲染找到的组件
    }
};