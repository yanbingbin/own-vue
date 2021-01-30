const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

const ELEMENT_TYPE = 1;
const TEXT_TYPE = 3;

export const parseHTML = function(html) {

    let root = null; // ast语法树的根节点
    let stack = [];

    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        };
    }

    function start(tagName, attrs) {
        // 遇到开始标签，创建一个ast元素
        let element = createASTElement(tagName, attrs);
        let parent = stack[stack.length - 1];
        if (!root) {
            root = element;
        }
        if (parent) {
            element.parent = parent;
            parent.children.push(element);
        }
        stack.push(element); // 将开始标签放入栈中
    }

    function chars(text) {
        text = text.replace(/\s/g, '');
        let parent = stack[stack.length - 1];
        if (text) {
            parent.children.push({
                text,
                type: TEXT_TYPE
            });
        }
    }

    function end() {
        let element = stack.pop();
        let parent = stack[stack.length - 1];
        if (parent) {
            element.parent = parent; // 绑定父子关系
            parent.children.push(element);
        }
    }

    while (html) {
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
            // 如果当前索引为0，肯定是一个标签
            let startTagMatch = parseStartTag(); // 获取匹配结果 tagName attrs
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs); // 解析开始标签
                continue; // 开始标签匹配完毕后，继续下一次匹配
            }
            // 匹配结束标签
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(); // 解析结束标签
                continue;
            }
        }
        let text;
        if (textEnd >= 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            advance(text.length);
            chars(text); // 解析文本标签
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
                    value: attr[3]
                });
            }
            if (end) { // 去掉开始标签的>
                advance(end[0].length); // 将属性去除
                return match;
            }
        }
    }
    return root;
};
