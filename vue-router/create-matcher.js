import createRouteMap from './create-route-map';
import { createRoute } from './history/base';

export const createMatcher = function(routes) {
    // pathList: ['/', '/a', '/a/b', '/a/c']
    // pathMap: {'/': {对应的组件}, '/a': {}, '/a/b': {}, '/a/c': {}}
    let { pathList, pathMap } = createRouteMap(routes);

    function match(location) { // 通过用户输入的路径，获取对应的匹配记录
        let record = pathMap[location];
        return createRoute(record, {
            path: location
        });
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