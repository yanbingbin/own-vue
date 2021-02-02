export function createRouteMap(routes, oldPathList, oldPathMap) {
    let pathList = oldPathList || [];
    let pathMap = oldPathMap || {};
    routes.forEach(route => {
        addRouteRecord(route, pathList, pathMap);
    });

    return {
        pathList,
        pathMap
    };
}

// 将当前路由存储到pathList pathMap中
function addRouteRecord(route, pathList, pathMap, parent) {
    let path = parent ? `${parent.path}/${route.path}` : route.path; // 子路由信息增加前缀
    let record = { // 根据当前路由产生一个记录
        path,
        component: route.component,
        parent // 之后createRoute需要通过这个不断递归找父亲拿到对应的record
    };
    if (!pathMap[path]) { // 避免重复路由覆盖
        pathList.push(path);
        pathMap[path] = record;
    }
    if (route.children) { // 递归扁平化子路由记录
        route.children.forEach(child => {
            addRouteRecord(child, pathList, pathMap, route); // 标记父亲
        });
    }
}