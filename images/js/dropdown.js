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
    //���ػ�����ʾ�����˵�
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
    //����ƶ���һ���˵���ִ��
    dropit: function(obj, e, dropmenuID) {
        //�����ϴ���ʾ�Ķ����˵�
        if (this.dropmenuobj != null) this.dropmenuobj.style.visibility = "hidden";
        this.clearhidemenu();
        if (this.ie || this.firefox) {
            var me = this;
            //һ���˵�����뿪�¼�
            obj.onmouseout = function() {
                cssdropdown.delayhidemenu();
            };
            //һ���˵�������¼�
            obj.onclick = function() {
                return ! cssdropdown.disablemenuclick
            };
            if (!dropmenuID) {
                return;
            }
            this.dropmenuobj = document.getElementById(dropmenuID);
            if (!this.dropmenuobj) return;
            //Ϊ�����˵�������ƶ����¼�
            this.dropmenuobj.onmouseover = function() {
                //�Ƴ���һ���˵��뿪ʱ�����ķ�������ֹ��ִ��
                cssdropdown.clearhidemenu();
            }
            //Ϊ�����˵�������뿪�¼�
            this.dropmenuobj.onmouseout = function(e) {
                cssdropdown.dynamichide(e);
            }
            //Ϊ�����˵���������¼�
            this.dropmenuobj.onclick = function() {
                cssdropdown.delayhidemenu();
            }
            this.showhide(this.dropmenuobj.style, e);
            //���������˵�λ�ã�����λ�ô���
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
    //���ض����˵��������Դ���
    dynamichide: function(e) {
        var evtobj = window.event ? window.event: e;
        //ȷ��������뿪�¼��������󴥷�
        if (this.ie && !this.dropmenuobj.contains(evtobj.toElement)) this.delayhidemenu();
        else if (this.firefox && e.currentTarget != evtobj.relatedTarget && !this.contains_firefox(evtobj.currentTarget, evtobj.relatedTarget)) this.delayhidemenu();
    },
    //������˵��������뿪�˵�ʱִ��
    delayhidemenu: function() {
        this.delayhide = setTimeout(function() {
            cssdropdown.dropmenuobj.style.visibility = 'hidden';
            cssdropdown.hideshim();
            cssdropdown.showAlways();
        },
        this.disappeardelay);
    },
    //�Ƴ���ʱ����
    clearhidemenu: function() {
        if (this.delayhide != "undefined") clearTimeout(this.delayhide);
    },
    //��ʾĬ�ϱ�ѡ�е�һ���˵�
    showAlways: function() {
        if (this.always) {
            this.always.onmouseover({
                type: "mouseover"
            });
        }
    },
    //��ʼ��
    startchrome: function() {
        for (var ids = 0; ids < arguments.length; ids++) {
            var menuitems = document.getElementById(arguments[ids]).getElementsByTagName("a");
            for (var i = 0; i < menuitems.length; i++) {
                var relvalue = menuitems[i].getAttribute("rel");
                //������ƶ����¼�
                menuitems[i].onmouseover = function(e) {
                    var event = typeof e != "undefined" ? e: window.event;
                    cssdropdown.dropit(this, event, this.getAttribute("rel"));
                };
                //��ʾĬ�ϱ�ѡ�е�һ���˵�
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