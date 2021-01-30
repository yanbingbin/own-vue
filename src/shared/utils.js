import { LIFECYCLE_HOOKS } from './constants';

// 判断参数是否是对象
export const isObject = function(data) {
    return data !== null && typeof(data) === 'object';
};

// 定义数据
export const def = function(data, key, value) {
    // 给每一个被观测的对象添加__ob__属性，值是 this，设置为不可枚举，不可遍历，遍历再次遍历 __ob__
    Object.defineProperty(data, key, { 
        enumerable: false,
        configurable: false, 
        value
    });
};

// 代理数据
export const proxy = function(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newVal) {
            vm[source][key] = newVal;
        }
    });
};

let strats = {}; // 合并策略



function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal);
        }   
        return [childVal];
    } 
    return parentVal;
}

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook;
});

// 组件合并策略
function mergeAssets(parentVal, childVal) {
    const res = Object.create(parentVal);
    if (childVal) {
        for (let key in childVal) {
            res[key] = childVal[key];
        }
    }
    return res;
}
strats.components = mergeAssets;

// 合并对象
export const mergeOptions = function(parent, child) {
    const options = {};

    for (let key in parent) {
        mergeField(key);
    }
    for (let key in child) {
        if (!Object.prototype.hasOwnProperty.call(parent, key)) {
            mergeField(key);
        }
    }

    function mergeField(key) {
        if (strats[key]) { // 对生命周期采用合并策略合并
            options[key] = strats[key](parent[key], child[key]);
        } else {
            if (typeof parent[key] === 'object' && typeof child[key] === 'object') {
                options[key] = {
                    ...parent[key],
                    ...child[key]
                };
            } else if (child[key] == null) {
                options[key] = parent[key];
            } else {
                options[key] = child[key];
            }
        }
    }

    return options;
}; 

function makeMap(str) {
    const map = {};
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return key => map[key];
}

export const isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
);

export const isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
);

export const isReservedTag = function(tag) {
    return isHTMLTag(tag) || isSVG(tag);
};