const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function start(tagName, attrs) {
    console.log('开始标签: ', tagName);

}

function chars(text) {
    console.log('文本是: ', text);
}

function end(tagName) {

}

function parseHTML(html) {
    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
            // 如果当前索引为0，肯定是一个标签
            let startTagMatch = parseStartTag(); // 获取匹配结果 tagName attrs
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue; // 开始标签匹配完毕后，继续下一次匹配
            }
            // 匹配结束标签
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1]);
                continue;
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text);
        }
    }

    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        let start = html.match(startTagOpen);
        if (start) { // 解析开始标签
            const match = {
                tagName: start[1],
                attrs: []
            };
            advance(start[0].length); // 将标签删除
            let end, attr;
            // 对属性进行解析
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length); // 将属性去除
                match.attrs.push({ 
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] 
                });
            }
            if (end) { // 去掉开始标签的>
                advance(end[0].length); // 将属性去除
                return match;
            }
        }
    }
}

// ast 语法树 用对象描述原生语法  
// 虚拟dom 用对象描述dom节点
export const compileToFunction = function (template) {
    let root = parseHTML(template);
    return function render() {

    };
};