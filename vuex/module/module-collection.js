import { forEachValue } from '../utils';
import Module from './module';

export default class ModuleCollection {
    constructor(rawRootModule) {
        // 注册模块
        this.register([], rawRootModule);
    }

    register(path, rawModule) {
        const newModule = new Module(rawModule);
        if (path.length === 0) {
            this.root = newModule;
        } else {
            const parent = this.get(path.slice(0, -1));
            parent.addChild([path[path.length - 1]], newModule);
        }
        if (rootModule.modules) { // 如果有modules,说明有子模块
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register([...path, moduleName], module);
            });
        }
    }

    get(path) {
        return path.reduce((module, key) => {
            return module.getChild(key);
        }, this.root);
    }

    getNamespace(path) {
        let module = this.root;
        return path.reduce((namespace, key) => {
            module = module.getChild(key);
            return namespace + (module.namespaced ? key + '/' : '');
        }, '');
    } 
}