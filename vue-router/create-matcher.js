import createRouteMap from './create-route-map';

export const createMatcher = function(routes) {
    // pathList: ['/', '/a', '/a/b', '/a/c']
    // pathMap: {'/': {对应的组件}, '/a': {}, '/a/b': {}, '/a/c': {}}
    let { pathList, pathMap } = createRouteMap(routes);

    function match() {

    }
    function addRoutes(routes) { // 动态添加路由
        // 将新增的路由追加到pathList pathMap
        createRouteMap(routes, pathList, pathMap);
    }

    return {
        match,
        addRoutes
    };
};