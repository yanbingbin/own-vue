import { forEachValue } from '../utils';
export default class Module {
    constructor(rawModule) {
        this._rawModule = rawModule;
        this._children = {};
        this.state = rawModule.state;
    }
    getChild(key) {
        return this._children[key];
    }
    addChild(key, module) {
        this._children[key] = module;
    }
    removeChild(key) {
        delete this._children[key];
    }
    forEachMutation(fn) {
        if (this._rawModule.mutations) {
            forEachValue(this._rawModule.mutations, fn);
        }
    }
    forEachActions(fn) {
        if (this._rawModule.actions) {
            forEachValue(this._rawModule.actions, fn);
        }
    }
    forEachGetter(fn) {
        if (this._rawModule.getters) {
            forEachValue(this._rawModule.getters, fn);
        }
    }
    forEachChild(fn) {
        forEachValue(this._children, fn);
    }
}