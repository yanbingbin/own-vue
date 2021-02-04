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
}