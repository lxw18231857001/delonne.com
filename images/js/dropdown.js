var cssdropdown = {
    disappeardelay: 250,
    disablemenuclick: false,
    enableswipe: 1,
    enableiframeshim: 1,
    dropmenuobj: null,
    ie: document.all,
    firefox: document.getElementById && !document.all,
    swipetimer: undefined,
    bottomclip: 0,

    getposOffset: function(what, offsettype) {
        var totaloffset = (offsettype == "left") ? what.offsetLeft: what.offsetTop;
        var parentEl = what.offsetParent;
        while (parentEl != null) {
            totaloffset = (offsettype == "left") ? totaloffset + parentEl.offsetLeft: totaloffset + parentEl.offsetTop;
            parentEl = parentEl.offsetParent;
        }
        return totaloffset;
    },

    swipeeffect: function() {
        if (this.bottomclip < parseInt(this.dropmenuobj.offsetHeight)) {
            this.bottomclip += 10 + (this.bottomclip / 10);
            this.dropmenuobj.style.clip = "rect(0 auto " + this.bottomclip + "px 0)";
        } else return;
        this.swipetimer = setTimeout("cssdropdown.swipeeffect()", 10);
    },
    //隐藏或者显示二级菜单
    showhide: function(obj, e) {
        if (this.ie || this.firefox) this.dropmenuobj.style.left = this.dropmenuobj.style.top = "-500px";
        if (e.type == "click" && obj.visibility == hidden || e.type == "mouseover") {
            if (this.enableswipe == 1) {
                if (typeof this.swipetimer != "undefined") clearTimeout(this.swipetimer);
                obj.clip = "rect(0 auto 0 0)";
                this.bottomclip = 0;
                this.swipeeffect();
            }
            obj.visibility = "visible";
        } else if (e.type == "click") obj.visibility = "hidden";
    },

    iecompattest: function() {
        return (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement: document.body;
    },

    clearbrowseredge: function(obj, whichedge) {
        var edgeoffset = 0;
        if (whichedge == "rightedge") {
            var windowedge = this.ie && !window.opera ? this.iecompattest().scrollLeft + this.iecompattest().clientWidth - 15 : window.pageXOffset + window.innerWidth - 15;
            this.dropmenuobj.contentmeasure = this.dropmenuobj.offsetWidth;
            if (windowedge - this.dropmenuobj.x < this.dropmenuobj.contentmeasure) edgeoffset = this.dropmenuobj.contentmeasure - obj.offsetWidth;
        } else {
            var topedge = this.ie && !window.opera ? this.iecompattest().scrollTop: window.pageYOffset;
            var windowedge = this.ie && !window.opera ? this.iecompattest().scrollTop + this.iecompattest().clientHeight - 15 : window.pageYOffset + window.innerHeight - 18;
            this.dropmenuobj.contentmeasure = this.dropmenuobj.offsetHeight;
            if (windowedge - this.dropmenuobj.y < this.dropmenuobj.contentmeasure) {
                edgeoffset = this.dropmenuobj.contentmeasure + obj.offsetHeight;
                if ((this.dropmenuobj.y - topedge) < this.dropmenuobj.contentmeasure) edgeoffset = this.dropmenuobj.y + obj.offsetHeight - topedge;
            }
        }
        return edgeoffset;
    },
    //鼠标移动到一级菜单上执行
    dropit: function(obj, e, dropmenuID) {
        //隐藏上次显示的二级菜单
        if (this.dropmenuobj != null) this.dropmenuobj.style.visibility = "hidden";
        this.clearhidemenu();
        if (this.ie || this.firefox) {
            var me = this;
            //一级菜单鼠标离开事件
            obj.onmouseout = function() {
                cssdropdown.delayhidemenu();
            };
            //一级菜单鼠标点击事件
            obj.onclick = function() {
                return ! cssdropdown.disablemenuclick
            };
            if (!dropmenuID) {
                return;
            }
            this.dropmenuobj = document.getElementById(dropmenuID);
            if (!this.dropmenuobj) return;
            //为二级菜单绑定鼠标移动到事件
            this.dropmenuobj.onmouseover = function() {
                //移除从一级菜单离开时触发的方法，防止误执行
                cssdropdown.clearhidemenu();
            }
            //为二级菜单绑定鼠标离开事件
            this.dropmenuobj.onmouseout = function(e) {
                cssdropdown.dynamichide(e);
            }
            //为二级菜单绑定鼠标点击事件
            this.dropmenuobj.onclick = function() {
                cssdropdown.delayhidemenu();
            }
            this.showhide(this.dropmenuobj.style, e);
            //调整二级菜单位置，以免位置错乱
            this.dropmenuobj.x = this.getposOffset(obj, "left");
            this.dropmenuobj.y = this.getposOffset(obj, "top");
            this.dropmenuobj.style.left = this.dropmenuobj.x - this.clearbrowseredge(obj, "rightedge") + "px";
            this.dropmenuobj.style.top = this.dropmenuobj.y - this.clearbrowseredge(obj, "bottomedge") + obj.offsetHeight + 1 + "px";
            this.positionshim();
        }
    },

    positionshim: function() {
        if (this.enableiframeshim && typeof this.shimobject != "undefined") {
            if (this.dropmenuobj.style.visibility == "visible") {
                this.shimobject.style.width = this.dropmenuobj.offsetWidth + "px";
                this.shimobject.style.height = this.dropmenuobj.offsetHeight + "px";
                this.shimobject.style.left = this.dropmenuobj.style.left;
                this.shimobject.style.top = this.dropmenuobj.style.top;
            }
            this.shimobject.style.display = (this.dropmenuobj.style.visibility == "visible") ? "block": "none";
        }
    },

    hideshim: function() {
        if (this.enableiframeshim && typeof this.shimobject != "undefined") this.shimobject.style.display = 'none';
    },

    contains_firefox: function(a, b) {
        while (b.parentNode) if ((b = b.parentNode) == a) return true;
        return false;
    },
    //隐藏二级菜单，兼容性处理
    dynamichide: function(e) {
        var evtobj = window.event ? window.event: e;
        //确认是鼠标离开事件，避免误触发
        if (this.ie && !this.dropmenuobj.contains(evtobj.toElement)) this.delayhidemenu();
        else if (this.firefox && e.currentTarget != evtobj.relatedTarget && !this.contains_firefox(evtobj.currentTarget, evtobj.relatedTarget)) this.delayhidemenu();
    },
    //鼠标点击菜单，或者离开菜单时执行
    delayhidemenu: function() {
        this.delayhide = setTimeout(function() {
            cssdropdown.dropmenuobj.style.visibility = 'hidden';
            cssdropdown.hideshim();
            cssdropdown.showAlways();
        },
        this.disappeardelay);
    },
    //移除定时方法
    clearhidemenu: function() {
        if (this.delayhide != "undefined") clearTimeout(this.delayhide);
    },
    //显示默认被选中的一级菜单
    showAlways: function() {
        if (this.always) {
            this.always.onmouseover({
                type: "mouseover"
            });
        }
    },
    //初始化
    startchrome: function() {
        for (var ids = 0; ids < arguments.length; ids++) {
            var menuitems = document.getElementById(arguments[ids]).getElementsByTagName("a");
            for (var i = 0; i < menuitems.length; i++) {
                var relvalue = menuitems[i].getAttribute("rel");
                //绑定鼠标移动到事件
                menuitems[i].onmouseover = function(e) {
                    var event = typeof e != "undefined" ? e: window.event;
                    cssdropdown.dropit(this, event, this.getAttribute("rel"));
                };
                //显示默认被选中的一级菜单
                if (!this.always && menuitems[i].parentNode.getAttribute("class") == "navselect") {
                    this.always = menuitems[i];
                    this.showAlways();
                }
            }
        }
        if (window.createPopup && !window.XmlHttpRequest) {
            document.write('<IFRAME id="iframeshim"  src="" style="display: none; left: 0; top: 0; z-index: 90; position: absolute; filter: progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)" frameBorder="0" scrolling="no"></IFRAME>');
            this.shimobject = document.getElementById("iframeshim");
        }
    }

}