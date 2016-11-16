function getElementsByClass(oParent, className) {
    var clsName = className.subString(1);
    var oResult = [];
    var allElems = oParent.getElementsByTagName('*');
    for (var i = 0; i < allElems.length; i++) {
        if (allElems[i].className == clsName) {
            oResult.push(allElems[i]);
        }
    }
    return oResult;
}

function addEvent(elem, eventName, fn) {
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
}

function getStyle(obj, attr) {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}


function WQuery() {
    this.elems = [];

    switch (typeof arguments[0]) {
        case 'string':
            switch (arguments[0].charAt(0)) {
                case '#':
                    this.elems.push(document.getElementById(arguments[0]));
                    break;
                case '.':
                    this.elems.push(getElementsByClass(document, arguments[0]));
                    break;
                default:
                    var tempArray = document.getElementsByTagName(arguments[0]);
                    for (var i = 0; i < tempArray.length; i++) {
                        this.elems.push(tempArray[i]);
                    }
                    break;
            }
            break;
        case 'function':
            window.onload = arguments[0];
            break;
        case 'object':
            if (arguments[0] instanceof Array) {
                this.elems = this.elems.concat(arguments[0]);
            } else if (arguments[0] instanceof HTMLElement) {
                this.elems.push(arguments[0]);
            } else if (arguments[0] instanceof HTMLCollection) {
                for (item in arguments[0]) {
                    this.elems.push(arguments[0][item]);
                }
            }
            break;

    }

    this[0] = this.elems;
}

WQuery.prototype = {
    constructor: WQuery,

    click: function (fn) {
        for (var i = 0; i < this.elems.length; i++) {
            addEvent(this.elems[i], 'click', fn)
        }
        return this;
    },

    show: function () {
        for (var i = 0; i < this.elems.length; i++) {
            this.elems[i].style.display = 'block';
        }
        return this;
    },

    hide: function () {
        for (var i = 0; i < this.elems.length; i++) {
            this.elems[i].style.display = 'none';
        }
        return this;
    },

    hover: function (overfn, outfn) {
        for (var i = 0; i < this.elems.length; i++) {
            addEvent(this.elems[i], 'mouseover', overfn);
            addEvent(this.elems[i], 'mouseout', outfn);
        }
        return this;
    },

    css: function (attr, value) {

        if (arguments.length == 2) {
            var i;
            for ( i = 0; i < this.elems.length; i++) {
                this.elems[i].style[attr] = value;
            }

        } else {
            var i;
            if (typeof attr == 'string') {
                return getStyle(this.elems[0], attr);
            } else {
                for ( i = 0; i < this.elems.length; i++) {
                    for (k in attr) {
                        this.elems[i].style[k] = attr[k];
                    }
                }
            }
        }
        return this;
    },

    attr: function (key, value) {
        if (arguments[0].length == 2) {
            var i;
            for ( i = 0; i < this.elems.length; i++) {
                this.elems[i][key] = value;
            }
        } else {
            var i ;
            if (typeof key == 'string') {
                return this.elems[0][key];
            } else {
                for ( i = 0; i < this.elems.length; i++) {
                    for (k in key) {
                        this.elems[i][k] = key[k];
                    }
                }
            }
        }
        return this;
    },

    toggle: function () {
        var _arg = arguments;

        for (var i = 0; i < this.elems.length; i++) {
            addToggle(this.elems[i]);
        }

        function addToggle(obj) {
            var count = 0;
            addEvent(obj, 'click', function () {
                _arg[count++ % _arg.length].call(obj);
            })
        }

        return this;
    },

    eq: function () {
        return $(this.elems[arguments[0]]);
    },

    find: function () {
        var oResult = [];
        for (var i = 0; i < this.elems.length; i++) {
            switch (arguments[0].charAt(0)) {
                case '#':
                    oResult.push(this.elems[i].getElementById(arguments[0].subString(1)));
                    break;
                case '.':
                    oResult.concat(getElementsByClass(this.elems[i], arguments[0].subString(1)));
                    break;
                default:
                    var htmlCollection = this.elems[i].getElementsByTagName(arguments[0]);
                    for (var i = 0; i < htmlCollection.length; i++) {
                        oResult.push(htmlCollection[i]);
                    }
                    break;
            }
        }
        this.elems = oResult;
        return this;
    },

    index: function () {
        var children = this.elems[0].parentNode.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i] === this.elems[0]) {
                return i;
            }
        }
    },

    bind: function (eventName, fn) {
        for (var i = 0; i < this.elems.length; i++) {
            addEvent(this.elems[i], eventName, fn);
        }
        return this;
    },

    extend: function (name, fn) {
        myQuery.prototype[name] = fn;
    },

    animate: function (json) {
        var i = 0;

        for (i = 0; i < this.elements.length; i++) {
            startMove(this.elements[i], json);
        }

        function getStyle(obj, attr) {
            if (obj.currentStyle) {
                return obj.currentStyle[attr];
            } else {
                return getComputedStyle(obj, false)[attr];
            }
        }

        function startMove(obj, json, fn) {
            clearInterval(obj.timer);
            obj.timer = setInterval(function () {
                var bStop = true; //这一次运动就结束了——所有的值都到达了
                for (var attr in json) {
                    //1.取当前的值
                    var iCur = 0;

                    if (attr == 'opacity') {
                        iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
                    } else {
                        iCur = parseInt(getStyle(obj, attr));
                    }

                    //2.算速度
                    var iSpeed = (json[attr] - iCur) / 8;
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

                    //3.检测停止
                    if (iCur != json[attr]) {
                        bStop = false;
                    }

                    if (attr == 'opacity') {
                        obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
                        obj.style.opacity = (iCur + iSpeed) / 100;
                    } else {
                        obj.style[attr] = iCur + iSpeed + 'px';
                    }
                }

                if (bStop) {
                    clearInterval(obj.timer);

                    if (fn) {
                        fn();
                    }
                }
            }, 30)
        }
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

                return iDay + '天' + iHours+ '小时' + iMinutes + '分钟' + iSeconds +'秒';

                break;
            case 2:
                break;
            default:
                break;
        }

    }

};

function $(arg) {
    return new WQuery(arg);
}
