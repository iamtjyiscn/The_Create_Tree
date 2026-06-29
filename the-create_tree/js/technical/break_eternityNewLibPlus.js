// 依赖库：打破永恒 https://github.com/Patashu/break_eternity.js
// 增强库：break_eternityNewLibPlus.js - 提供中缀表达式计算功能


/**
 * 
 是先AI框架，在自己改的

这个库就是把"114+154-1919*810"转"new Decimal('114').add(new Decimal('514')).sub(new Decimal('1919').mul(new Decimal('810')))"的* 
 
 */
//检测googology数字的正则表达式
//01000000a7的正则表达式，感觉很好用
Decimal.Reg=/^(PN)?[\/\-\+]*(Infinity|NaN|(P+|P\^\d+ )?(10(\^+|\{([1-9]\d*|!)(,([1-9]\d*|!))?(,[1-9]\d*)?\})|\(10(\^+|\{([1-9]\d*|!)(,([1-9]\d*|!))?(,[1-9]\d*)?\})\)\^[1-9]\d*\x20*)*((\d+(\.\d*)?|\d*\.\d+)?([Ee][-\+]*))*(0|\d+(\.\d*)?|\d*\.\d+))$/;
/*
// 为Decimal类添加后缀表达式求值函数
Decimal.postfixeval = function (code) {
    var stack = new Array;
    for (const tokens of code) {
        const token=tokens[1];
        if (tokens[0] == "fun" || tokens[0] == 'tok') {
            // 处理阶乘（单目运算符）
            if (token == '!') {
                let val = stack.pop();
                if (!val) throw new Error("阶乘运算符缺少操作数");
                stack.push(val.factorial());
            }
            // 处理函数调用（单目运算符）
            else if (this.isKnownFunction(token)) {
                let val = stack.pop();
                if (!val) throw new Error(`函数 ${token} 缺少参数`);
                stack.push(this.callFunction(token, val));
            }
            // 处理双目运算符
            else {
                let b = stack.pop();
                let a = stack.pop();
                if (a === undefined || b === undefined) {
                    throw new Error(`运算符 ${token} 缺少足够的操作数`);
                }
                switch (token) {
                    case '+':
                    case 'add':
                        stack.push(a.add(b));
                        break;
                    case '*':
                    case 'mul':
                    case 'times':
                    case 'multiply':
                        stack.push(a.mul(b));
                        break;
                    case '-':
                    case 'sub':
                        stack.push(a.sub(b));
                        break;
                    case '/':
                    case 'div':
                        stack.push(a.div(b));
                        break;
                    case '^':
                    case 'pow':
                        stack.push(a.pow(b));
                        break;
                    case '^^':
                    case 'tetrate':
                        stack.push(a.tetrate(b));
                        break;
                    default:
                        throw new Error(`未知运算符: ${token}`);
                }
            }
        }
        else if (tokens[1] instanceof Decimal) {
            stack.push(token);
        } else {
            // 尝试将数字转换为Decimal
            stack.push(new Decimal(token));
        }
    }
    if (stack.length !== 1) {
        throw new Error("表达式不完整或格式错误");
    }

    return stack.pop();
};
*/
// 中缀表达式转后缀表达式（逆波兰表示法）
Decimal.infixToPostfix = function (infix) {
    // 移除首尾空格并在末尾添加哨兵空格，便于分词
    infix = infix.trim() + ' ';

    // 定义运算符优先级（数值越大，优先级越高）
    const precedence = {
        '<':0,'>':0,'<=':0,'>=':0,
        '+': 1, '-': 1,
        '*': 2, '/': 2,
        '^': 3,
        '^^': 4,
        '!': 100, // 阶乘为后置单目运算符，优先级最高
    };

    // 已知支持的函数列表（可扩展）
    //const knownFunctions = ['sqrt', 'log', 'ln', 'exp', 'abs', 'pow', ]; 

    // 辅助函数：判断是否为已知函数名
    const isKnownFunction = token => Decimal.prototype[token]

    // 辅助函数：判断是否为字母（用于识别函数名或变量）
    const isAlpha = str => /^[a-z\.\[\]]+$/i.test(str);

    // &zwnj;**补全部分：增强型分词函数（支持最长匹配）**&zwnj;
    const tokens = [];
    let current = '';
    let i = 0;

    function pushMayNum(current){
      //const maybeNum = new Decimal(current);
        if (Decimal.Reg.test(current)) {
            tokens.push(["num",current]);
        } else if (isKnownFunction(current)) {
            tokens.push(["fun",current]); // 作为函数名存入
        } else if (!/[^\.\[\]\w]/.test(current)) {
            //可能是一个变量
            tokens.push(["val",current]);
        }else{
            console.log("咋回事啊，从表达式中识别到了",current)
        }
    }

    while (i < infix.length) {
        const char = infix[i];

        // 跳过空格
        if (char === ' ') {
            pushMayNum(current);
            current = '';
            i++;
            continue;
        }

        // &zwnj;**补全部分：最长匹配原则识别多字符运算符**&zwnj;
        // 检查从当前位置开始，是否能匹配已知的多字符运算符（如'^^'）
        const multiCharOps = ['<=','>=','^^'];
        let matchedOp = null;
        for (const op of multiCharOps) {
            if (infix.startsWith(op, i)) {
                matchedOp = op;
                break;
            }
        }

        if (matchedOp) {
            tokens.push(['tok',matchedOp]);
            if (current) {
                pushMayNum(current);
                current = '';
            }
            i += matchedOp.length; // 跳过已匹配的字符
            continue;
        }

        // 处理字母（函数名或变量）
        if (isAlpha(char)) {
            current += char;
            i++;
            continue;
        }

        // 处理数字和小数点
        if (/[\d\.]/.test(char)) {
            current += char;
            i++;
            continue;
        }

        // 处理单个字符的运算符或括号
        // 先将累积的数字或字母作为token存入
        if (current) {
            pushMayNum(current)
            current = '';
        }

        // 处理逗号（函数参数分隔符）
        if (char === ',') {
            tokens.push(['tok',',']);
            i++;
            continue;
        }

        // 其他单字符运算符或括号
        tokens.push(['tok',char]);
        i++;
    }

    // 处理最后一个累积的token
    if (current) {
        pushMayNum(current);
    }

    // 转换主逻辑：调度场算法
    const output = [];
    const stack = [];

    tokens.forEach(tokens => {
        const token=tokens[1];
        if (token==''||token==' ')return;
        // 1. 如果是数字，直接输出
        if (tokens[0]=="num"||tokens[0]=="val") {
            output.push(tokens);
            return;
        }

        // 2. 如果是已知函数名，压入栈
        if (isKnownFunction(token)) {
            stack.push(tokens);
            return;
        }

        // 3. 如果是逗号（参数分隔符）
        if (token === ',') {
            // 弹出栈顶元素直到遇到左括号 '('
            while (stack.length && stack[stack.length - 1][1] !== '(') {
                output.push(stack.pop());
            }
            if (!stack.length) {
                throw new Error("参数分隔符逗号位置错误或括号不匹配");
            }
            return; // 逗号不进入输出队列
        }

        // 4. 如果是左括号 '('，压入栈
        if (token === '(') {
            stack.push(tokens);
            return;
        }

        // 5. 如果是右括号 ')' 
        if (token === ')') {
            // 弹出栈顶元素并输出，直到遇到左括号 '('
            while (stack.length && stack[stack.length - 1][1] !== '(') {
                output.push(stack.pop());
            }
            // 弹出左括号 '('
            if (stack.length) {
                stack.pop();
            } else {
                throw new Error("括号不匹配：缺少左括号");
            }
            // 如果栈顶现在是函数名，将其弹出并输出
            if (stack.length && isKnownFunction(stack[stack.length - 1][1])) {
                output.push(stack.pop());
            }
            return;
        }

        // 6. 如果是阶乘 '!' （右结合单目运算符，直接输出）
        if (token === '!') {
            output.push(tokens);
            return;
        }

        // 7. 如果是其他运算符（双目运算符）
        // 获取当前运算符的优先级
        const currPrec = precedence[token] || 0;

        // 当栈非空，且栈顶不是左括号，且栈顶运算符优先级 >= 当前运算符优先级时
        while (stack.length &&
            stack[stack.length - 1] !== '(' &&
            (stack[stack.length - 1]?precedence[stack[stack.length - 1][1]] : 0) >= currPrec) {
            output.push(stack.pop());
        }
        // 当前运算符压入栈
        stack.push(tokens);
    });

    // 8. 遍历结束后，将栈中所有剩余运算符弹出并输出
    while (stack.length) {
        const op = stack.pop();
        if (op === '(') {
            throw new Error("括号不匹配：缺少右括号");
        }
        output.push(op);
    }

    return output;
};
/*
// 中缀表达式计算入口函数
Decimal.eval = function (code) {
    try {
        const postfix = this.infixToPostfix(code);
        return this.postfixeval(postfix);
    } catch (error) {
        console.error("表达式计算错误:", error.message, "表达式:", code);
        throw error; // 可以选择重新抛出或返回一个错误值，如 Decimal.dNaN
    }
};*/

//// &zwnj;**补全部分：辅助函数 - 判断是否为已知函数**&zwnj;

Decimal.isKnownFunction = function (token) {
//    const knownFunctions = ['sqrt', 'log', 'ln', 'exp', 'abs', 'sin', 'cos', 'tan'];

//    return knownFunctions.includes(token.toLowerCase());
    if(Decimal.prototype[token])
        return Decimal.prototype[token].length+1;
    else return 0;
};


// &zwnj;**补全部分：辅助函数 - 调用已知函数**&zwnj;
Decimal.callFunction = function (funcName, value) {
    switch (funcName.toLowerCase()) {
        case 'sqrt':
            return value.sqrt();
        case 'log':
            return value.log10(); // 假设log为常用对数，可根据需要改为自然对数ln
        case 'ln':
            return value.ln();
        case 'exp':
            return value.exp();
        case 'abs':
            return value.abs();
        // 注意：break_eternity.js 库本身可能不支持三角函数，此处仅为示例
        // case 'sin': return Decimal.sin(value); // 假设有该方法
        // case 'cos': return Decimal.cos(value);
        // case 'tan': return Decimal.tan(value);
        default:
            throw new Error(`不支持的函数: ${funcName}`);
    }
};


/*



// &zwnj;**修改部分：安全的数值转换函数**&zwnj;
Decimal.fromValue = function (value) {
    // 处理非有限数值（Infinity, NaN）
    if (typeof value === 'number' && !isFinite(value)) {
        console.warn("警告：检测到非有限数值（如 Infinity/NaN）。建议使用 Decimal.dInf、Decimal.dNegInf 或 Decimal.dNaN 等常量。");
        if (value === Infinity) return Decimal.dInf;
        if (value === -Infinity) return Decimal.dNegInf;
        if (isNaN(value)) return Decimal.dNaN;
    }
    // 调用原库的 fromValue 方法
    // 注意：原 break_eternity.js 库中，Decimal 构造函数或 fromNumber 方法可能已能处理
    // 此处采用更通用的方式
    try {
        return new Decimal(value);
    } catch (e) {
        // 如果失败，尝试其他方式或返回NaN
        console.error("无法将值转换为Decimal:", value, e);
        return Decimal.dNaN;
    }
};

// 可选：为方便使用，将新增方法也绑定到 Decimal 的原型上（如果库本身允许）
// 例如：Decimal.prototype.eval = function(...) {...} 可能不合适，因为 eval 通常作为静态方法
// 但可以绑定 infixToPostfix 和 postfixeval 如果需要
// Decimal.prototype.infixToPostfix = Decimal.infixToPostfix;
// Decimal.prototype.postfixeval = Decimal.postfixeval;
*/

Decimal.metaConstructor=x=>`new Decimal("${x}")`;

/**
 * 将中缀表达式字符串转换为 break_ternity.js 的链式调用字符串。
 * //例如：输入 "2 + 3 * 4"，输出 "new Decimal(2).add(new Decimal(3).mul(4))"。
 * @param {string} infix - 中缀表达式字符串，例如 "114 + 514 * 1919 ^ 810"
 * @returns {string} - 可执行的链式调用字符串
 */
Decimal.infixToChainString = function (infix,valMap=x=>x) {
    // 复用已有的中缀转后缀函数
    const postfixTokens = this.infixToPostfix(infix);
    const stack = []; // 这个栈里存放的是字符串片段

    for (const tokens of postfixTokens) {
        const token=tokens[1];
        if (tokens[0]=="num") {
            // 如果是数字，将其包装为 new Decimal(...)
            //new Decimal(...)太慢了，还是用Decimal.fromComponents_noNormalize吧
            //算了，我还是用metaconstructor吧？ 
            stack.push(this.metaConstructor(token));
        }else if(tokens[0]=="val"){
            stack.push(valMap(token));
        } else if (typeof token === 'string') {
            
            
            // 处理运算符和函数
            if (token === '!') {
                // 阶乘是单目运算符
                const operand = stack.pop();
                if (!operand) throw new Error("阶乘运算符缺少操作数");
                stack.push(`${operand}.factorial()`);
            } else if (this.isKnownFunction(token)==1) {
                // 函数调用，例如 sqrt, log
                const operand = stack.pop();
                if (!operand) throw new Error(`函数 ${token} 缺少参数`);
                // 将函数名映射到对应的方法名，例如 'sqrt' -> 'sqrt()', 'log' -> 'log10()'
                const methodName = this._getChainMethodNameForFunction(token);
                stack.push(`${operand}.${methodName}()`);
            } else {
                // 处理双目运算符：+, -, *, /, ^,^^
                const b = stack.pop();
                const a = stack.pop();
                if (!a || !b) throw new Error(`运算符 ${token} 缺少足够的操作数`);

                const methodName = this._getChainMethodNameForOperator(token);
                // 关键：将运算构建成链式调用。注意操作数 b 可能已经是一个复杂的链式字符串。
                stack.push(`${a}.${methodName}(${b})`);
            }
        } else {
            // 理论上不会进入这里，因为 infixToPostfix 的输出是确定的
            throw new Error(`无法处理的 token 类型: ${token}`);
        }
    }

    if (stack.length !== 1) {
        throw new Error("表达式转换失败：栈中剩余元素不为1。");
    }

    return stack.pop();
};

/**
 * 辅助函数：将中缀运算符映射为链式调用的方法名。
 * @private
 */
Decimal._getChainMethodNameForOperator = function (op) {
    const opMap = {
        '<':'lt',
        '>':'gt',
        '<=':'lte',
        '>=':'gte',
        '+': 'add',
        '-': 'sub',
        '*': 'mul',
        '/': 'div',
        '^': 'pow',
        '^^': 'tetrate',
    };
    const method = opMap[op]?opMap[op]:Decimal[op]?op:undefined;
    if (!method) throw new Error(`不支持转换为链式调用的运算符: ${op}`);
    return method;
};

/**
 * 辅助函数：将已知函数名映射为链式调用的方法名。
 * @private
 */
Decimal._getChainMethodNameForFunction = function (funcName) {
    const method = funcName.toLowerCase();
    if (!Decimal.prototype[method]) throw new Error(`不支持转换为链式调用的函数: ${funcName}`);
    return method;
};



//这个文件有点史，等我有运气找个好的提示词让AI重构一下。