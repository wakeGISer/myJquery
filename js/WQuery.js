/*
 WQuery  模仿jquery 实现部分功能
 */

(function (window, undefined) {
    var ducument = window.document,
        location = window.location;

    var WQuery = function (selector) {
            return new WQuery.fn.init(selector);
        },
        rootWQuery = document,
        context,
        match = function (selector, parent) {
            var aResult = /^#(\w+)$/.exec(selector);
            if (aResult) {
                this[0] = document.getElementById(aResult[1]);
                this.length = 1;
                return this;
            } else {
                // 如果不是id，当做标签获得元素
                // 默认在parent下面获得这个元素，该对象为jk对象
                var l, arr = [];
                if (parent === "document" || !parent) {

                    arr = document.getElementsByTagName(selector);

                } else {
                    // 如果是jk对象		这里有个Bug，如果parent中对象有父子关系
                    if (l = parent.length) {
                        for (var i = 0; i < l; i++) {
                            var dom = parent[i]; // 获得dom对象
                            // 在里面获得子元素
                            arr[arr.length] = dom.getElementsByTagName(selector);
                        }

                        arr = arr.concat.apply([], arr); // 展开数组
                    }
                }

                // 将数组加到this中
                this.length = this.length || 0;
                for (var i = 0; i < arr.length; i++) {
                    this[this.length++] = arr[i];
                }
                return this
                // 如果也不是WQuery对象，直接返回this，表示没有得到元素
            }
        },
        getElementsByClass = function (oParent, className) {
            var clsName = className.substring(1);
            var oResult = [];
            var allElems = oParent.getElementsByTagName('*');
            for (var i = 0; i < allElems.length; i++) {
                if (allElems[i].className == clsName) {
                    oResult.push(allElems[i]);
                }
            }
            return oResult;
        },
        getStyle = function (obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return getComputedStyle(obj, false)[attr];
            }
        },
        addEvent = function (elem, eventName, fn) {
            if (window.attachEvent) {
                elem.attachEvent('on' + eventName, function () {
                    if (false == fn.call(elem, window.event)) {
                        window.event.cancelBubble = false;
                        return false;
                    }
                }); // IE only capture
            } else if (window.addEventListener) {
                elem.addEventListener(eventName, function (event) {
                    if (false == fn.call(elem, event)) {
                        event.cancelBubble = false;
                        return false;
                    }
                }, false); // false--- bubble
            }
        };


    WQuery.fn = WQuery.prototype = {
        constructor: WQuery,

        //定义初始化函数
        init: function (selector) {

            //过滤掉  $('')  $(null) $(undefined)
            if (!selector) {
                return this;
            }

            //如果传入的是DOM 对象
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this;
            }

            // 如果传入的是一个函数，就为onload加载事件
            if (typeof selector === "function") {
                var oldFunc = window.onload;
                if (typeof oldFunc === "function") { //如果当前window.onload 上已经绑定了事件，则进行相应的处理之后
                    window.onload = function () {
                        oldFunc();
                        selector();
                    };
                } else {
                    window.onload = selector;
                }
                return this;
            }

            //如果传入的是字符串，先处理是否是html标签，再处理选择器 #id
            if (typeof selector === 'string') {
                if (false) {

                } else {
                    return match.call(this, selector);
                }
            }
        },

        //遍历 WQuery 对象上下文中的匹配元素，为为每一个匹配元素上下文执行一个函数，返回false将停止遍历
        each: function (callback) {
            var l;
            if (l = this.length) {
                for (var i = 0; i < l; i++) {
                    if (callback.call(this[i], i, this[i]) === "false") {
                        break;
                    }
                }
            }
        },

        bind: function (eventName, fn) {
            this.each(function (index, elem) {
                addEvent(elem, eventName, fn);
            });
            return this;
        },

        click: function (fn) {
            this.bind('click', fn);
            return this;
        },

        show: function () {
            this.each(function (index, elem) {
                elem.style.display = 'block';
            })
            return this;
        },

        hide: function () {
            this.each(function (index, elem) {
                elem.style.display = 'none';
            })
            return this;
        },

        hover: function (overfn, outfn) {
            this.each(function (index, elem) {
                addEvent(elem, 'mouseover', overfn);
                addEvent(elem, 'mouseout', outfn);
            });
            return this;
        },

        css: function (attr, value) {

            if (arguments.length == 2) {
                this.each(function (index, elem) {
                    elem.style[attr] = value;
                })

            } else {
                var i;
                if (typeof attr == 'string') {
                    return getStyle(this[0], attr);
                } else {
                    this.each(function (index, elem) {
                        for (var k in attr) {
                            elem.style[k] = attr[k];
                        }
                    })
                }
            }
            return this;
        },

        attr: function (key, value) {
            if (arguments[0].length == 2) {
                this.each(function (index, elem) {
                    elem[key] = value;
                })
            } else {
                var i;
                if (typeof key == 'string') {
                    return this[0][key];
                } else {
                    this.each(function (index, elem) {
                        for (var k in key) {
                            elem[k] = key[k];
                        }
                    })
                }
            }
            return this;
        },

        toggle: function () {
            var _arg = arguments;

            this.each(function (index, elem) {
                addToggle(elem);
            });

            function addToggle(obj) {
                var count = 0;
                addEvent(obj, 'click', function () {
                    _arg[count++ % _arg.length].call(obj);
                })
            }

            return this;
        },

        eq: function () {
            return $(this[arguments[0]]);
        },

        find: function (selector) {
            var aResult = [];
            this.each(function (index, elem) {
                switch (selector.charAt(0)) {
                    case '#':
                        aResult.push(elem.getElementById(selector.substring(1)));
                        break;
                    case '.':
                        aResult.concat(getElementsByClass(elem, selector.substring(1)));
                        break;
                    default:
                        var htmlCollection = elem.getElementsByTagName(selector);
                        for (var i = 0; i < htmlCollection.length; i++) {
                            aResult.push(htmlCollection[i]);
                        }
                        break;
                }
            })
            for (var i = 0; i < this.length; i++) {
                this[i] = aResult[i]
            }
            return this;
        },

        index: function () {
            var children = this[0].parentNode.children;
            for (var i = 0; i < children.length; i++) {
                if (children[i] === this[0]) {
                    return i;
                }
            }
        },

    };

    WQuery.fn.init.prototype = WQuery.prototype;

    //-------------------工具方法-----------------------------
    WQuery.isArray = function (obj) {
        return obj instanceof Array;
    }

    WQuery.isFunction = function (obj) {
        return typeof obj === 'function';
    }
    WQuery.extend = function (obj) {
        for (var item in obj) {
            if (obj.hasOwnProperty(item)) {
                WQuery.prototype[item] = obj[item];
            }
        }
    }

    WQuery.isObject = function (obj) {

        return true; //先搁置 2016-11-20
    }

    WQuery.map = function (aOld, fn) {
        var i,
            len,
            tempObj,
            aNew;
        if (WQuery.isArray(aOld)) {
            len = aOld.length;
            for (i = 0; i < len; i++) {
                tempObj = fn.call(aOld[i], i, aOld[i]);
                if (tempObj) {
                    aNew[aNew.length] = tempObj;
                }
            }
            return aNew.concat.apply([], aNew);
        }
    }

    WQuery.each = function (obj, fn) {
        var res,
            item,
            i,
            len;
        if (WQuery.isArray(obj)) {
            var len = obj.length;
            for (i = 0; i < len; i++) {
                res = fn.call(obj[i], i, obj[i]);
                if (res === false) {
                    break;
                }
            }
        } else {
            // 对象遍历
            for (item in obj) {
                if (fn.call(obj[item], item, obj[item]) === false) {
                    break;
                }
            }
        }
        return obj;
    }

    //-------------扩展方法-----------------------
    WQuery.extend({

        //注意：所有指定的属性必须用骆驼形式，比如用marginLeft代替margin-left.
        animate: function (oTarget, iType, fnCallBack, fnDuring) {

            var i = 0;
            var Wake_MOVE_TYPE = {
                BUFFER: 1,
                FLEX: 2
            };
            var currentType;
            switch (iType) {
                case undefined:
                    currentType = Wake_MOVE_TYPE.BUFFER;
                    break;
                default:
                    currentType = Wake_MOVE_TYPE[iType];
                    break;
            }


            for (i = 0; i < this.length; i++) {
                startMove.call(this[i], oTarget, currentType, fnCallBack, fnDuring);
            }

            function css(obj, attr, value) {
                if (arguments.length == 2)
                    return parseFloat(obj.currentStyle ? obj.currentStyle[attr] : document.defaultView.getComputedStyle(obj, false)[attr]);
                else if (arguments.length == 3)
                    switch (attr) {
                        case 'width':
                        case 'height':
                        case 'paddingLeft':
                        case 'paddingTop':
                        case 'paddingRight':
                        case 'paddingBottom':
                            value = Math.max(value, 0);
                        case 'left':
                        case 'top':
                        case 'marginLeft':
                        case 'marginTop':
                        case 'marginRight':
                        case 'marginBottom':
                            obj.style[attr] = value + 'px';
                            break;
                        case 'opacity':
                            obj.style.filter = "alpha(opacity:" + value * 100 + ")";
                            obj.style.opacity = value;
                            break;
                        default:
                            obj.style[attr] = value;
                    }

                return function (attr_in, value_in) {
                    css(obj, attr_in, value_in)
                };
            };

            function startMove(json, type, fnCall, fnDuring) {
                var fnMove = null;
                var This = this;
                if (this.timer) { //有开就有关
                    clearInterval(this.timer);
                }

                switch (type) {
                    //缓冲运动
                    case Wake_MOVE_TYPE.BUFFER:
                        fnMove = moveBuffer;
                        break;
                    //曲线运动
                    case Wake_MOVE_TYPE.FLEX:
                        fnMove = moveFlex;
                        break;
                }
                this.timer = setInterval(function () {
                    fnMove.call(This, oTarget, fnCallBack, fnDuring);
                }, 30)
            };

            function moveBuffer(oTarget, fnCallBack, fnDuring) {
                var bStop = true;
                var attr = '';
                var speed = 0;
                var cur = 0;
                var obj = this;

                for (attr in oTarget) {
                    cur = css(obj, attr);
                    if (parseFloat(oTarget[attr]) != cur) {
                        bStop = false;

                        speed = (parseFloat(oTarget[attr]) - cur) / 5;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

                        css(obj, attr, cur + speed);
                    }
                }

                if (fnDuring)fnDuring.call(obj);

                if (bStop) {
                    clearInterval(obj.timer);
                    obj.timer = null;

                    if (fnCallBack)fnCallBack.call(obj);
                }
            };

            function moveFlex(oTarget, fnCallBack, fnDuring) {
                var bStop = true;
                var attr = '';
                var speed = 0;
                var cur = 0;
                var obj = this;

                for (attr in oTarget) {
                    if (!obj.oSpeed)obj.oSpeed = {};
                    if (!obj.oSpeed[attr])obj.oSpeed[attr] = 0;
                    cur = css(obj, attr);
                    if (Math.abs(parseFloat(oTarget[attr]) - cur) > 1 || Math.abs(obj.oSpeed[attr]) > 1) {
                        bStop = false;
                        // 目标值与当前值一直在减小，当越界时，此时差值为负，当前speed为正，然后减小当前speed
                        // 知道当前speed为负
                        obj.oSpeed[attr] += (parseFloat(oTarget[attr]) - cur) / 5;
                        obj.oSpeed[attr] *= 0.8;
                        var maxSpeed = 65;
                        if (Math.abs(obj.oSpeed[attr]) > maxSpeed) {
                            obj.oSpeed[attr] = obj.oSpeed[attr] > 0 ? maxSpeed : -maxSpeed;
                        }

                        css(obj, attr, cur + obj.oSpeed[attr]);
                    } else {
                        css(obj, attr, parseFloat(oTarget[attr]));
                    }
                }

                if (fnDuring)fnDuring.call(obj);

                if (bStop) {
                    clearInterval(obj.timer);
                    obj.timer = null;
                    if (fnCallBack)fnCallBack.call(obj);
                }
            };
        },
        drag: function () {
            var i = 0;

            for (i = 0; i < this.elems.length; i++) {
                drag(this.elems[i]);
            }

            function drag(oDiv) {
                oDiv.onmousedown = function (ev) {
                    var oEvent = ev || event;
                    var disX = oEvent.clientX - oDiv.offsetLeft;
                    var disY = oEvent.clientY - oDiv.offsetTop;

                    document.onmousemove = function (ev) {
                        var oEvent = ev || event;
                        oEvent.preventDefault();
                        oDiv.style.left = oEvent.clientX - disX + 'px';
                        oDiv.style.top = oEvent.clientY - disY + 'px';
                    };

                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        },
        getDistTime: function (oTarget, oSouce) {
            var argLength = arguments.length;
            var dateReg = /(\d{4})-(\d{2})-(\d{2}) ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])/;
            switch (argLength) {
                case 1:
                    var oTargetArray = dateReg.exec(oTarget);
                    var oEndTime = new Date();
                    var oNowTime = new Date();
                    oEndTime.setFullYear(oTargetArray[1]);
                    oEndTime.setMonth(oTargetArray[2] - 1);
                    oEndTime.setDate(oTargetArray[3]);
                    oEndTime.setHours(oTargetArray[4]);
                    oEndTime.setMinutes(oTargetArray[5]);
                    oEndTime.setMilliseconds(oTargetArray[6]);
                    var iRemain = (oEndTime.getTime() - oNowTime.getTime()) / 1000;
                    var iDay = parseInt(iRemain / (60 * 60 * 24));
                    iRemain %= (60 * 60 * 24);
                    var iHours = parseInt(iRemain / (60 * 60));
                    iRemain %= (60 * 60);
                    var iMinutes = parseInt(iRemain / 60);
                    iRemain %= 60;
                    var iSeconds = iRemain;

                    return iDay + '天' + iHours + '小时' + iMinutes + '分钟' + iSeconds + '秒';

                    break;
                case 2:
                    break;
                default:
                    break;
            }

        }
    })

    window.$ = WQuery;
})(window)







