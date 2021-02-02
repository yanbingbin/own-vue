import History from './base';

export default class HashHistory extends History {
    constructor(router) {
        super(router);
        this.router = router;
        ensureSlash(); // 打开网站如果没有hash，默认应该添加#/
    }

    getCurrentLocation() {
        return getHash(); 
    }

    setupListener() {
        window.addEventListener('hashchange', () => {
            this.transitionTo(getHash());
        });
    }
}

function getHash() {
    return window.location.hash.slice(1); // 需要截去#号
}

function ensureSlash() { 
    if (window.location.hash) {
        return;
    }
    window.location.hash = '/';
}