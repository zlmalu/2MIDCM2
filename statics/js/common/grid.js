!
    function ($) {
        "use strict";
        $.jgrid = $.jgrid || {};
        $.extend($.jgrid, {
            version: "4.6.0",
            htmlDecode: function (e) {
                return e && ("&nbsp;" === e || "&#160;" === e || 1 === e.length && 160 === e.charCodeAt(0)) ? "" : e ? String(e).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&") : e
            },
            htmlEncode: function (e) {
                return e ? String(e).replace(/&/g, "&amp;").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : e
            },
            format: function (e) {
                var t = $.makeArray(arguments).slice(1);
                null == e && (e = "");
                return e.replace(/\{(\d+)\}/g, function (e, i) {
                    return t[i]
                })
            },
            msie: "Microsoft Internet Explorer" === navigator.appName,
            msiever: function () {
                var e = -1,
                    t = navigator.userAgent,
                    i = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
                null != i.exec(t) && (e = parseFloat(RegExp.$1));
                return e
            },
            getCellIndex: function (e) {
                var t = $(e);
                if (t.is("tr")) return -1;
                t = (t.is("td") || t.is("th") ? t : t.closest("td,th"))[0];
                return $.jgrid.msie ? $.inArray(t, t.parentNode.cells) : t.cellIndex
            },
            stripHtml: function (e) {
                e = String(e);
                var t = /<("[^"]*"|'[^']*'|[^'">])*>/gi;
                if (e) {
                    e = e.replace(t, "");
                    return e && "&nbsp;" !== e && "&#160;" !== e ? e.replace(/\"/g, "'") : ""
                }
                return e
            },
            stripPref: function (e, t) {
                var i = $.type(e);
                if ("string" === i || "number" === i) {
                    e = String(e);
                    t = "" !== e ? String(t).replace(String(e), "") : t
                }
                return t
            },
            parse: function (jsonString) {
                var js = jsonString;
                "while(1);" === js.substr(0, 9) && (js = js.substr(9));
                "/*" === js.substr(0, 2) && (js = js.substr(2, js.length - 4));
                js || (js = "{}");
                return $.jgrid.useJSON === !0 && "object" == typeof JSON && "function" == typeof JSON.parse ? JSON.parse(js) : eval("(" + js + ")")
            },
            parseDate: function (e, t, i, r) {
                var a, s, n, o = /\\.|[dDjlNSwzWFmMntLoYyaABgGhHisueIOPTZcrU]/g,
                    l = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
                    d = /[^-+\dA-Z]/g,
                    c = new RegExp("^/Date\\((([-+])?[0-9]+)(([-+])([0-9]{2})([0-9]{2}))?\\)/$"),
                    u = "string" == typeof t ? t.match(c) : null,
                    p = function (e, t) {
                        e = String(e);
                        t = parseInt(t, 10) || 2;
                        for (; e.length < t;) e = "0" + e;
                        return e
                    },
                    h = {
                        m: 1,
                        d: 1,
                        y: 1970,
                        h: 0,
                        i: 0,
                        s: 0,
                        u: 0
                    },
                    f = 0,
                    g = function (e, t) {
                        0 === e ? 12 === t && (t = 0) : 12 !== t && (t += 12);
                        return t
                    };
                void 0 === r && (r = $.jgrid.formatter.date);
                void 0 === r.parseRe && (r.parseRe = /[#%\\\/:_;.,\t\s-]/);
                r.masks.hasOwnProperty(e) && (e = r.masks[e]);
                if (t && null != t) if (isNaN(t - 0) || "u" !== String(e).toLowerCase()) if (t.constructor === Date) f = t;
                else if (null !== u) {
                    f = new Date(parseInt(u[1], 10));
                    if (u[3]) {
                        var m = 60 * Number(u[5]) + Number(u[6]);
                        m *= "-" === u[4] ? 1 : -1;
                        m -= f.getTimezoneOffset();
                        f.setTime(Number(Number(f) + 60 * m * 1e3))
                    }
                } else {
                    var m = 0;
                    "ISO8601Long" === r.srcformat && "Z" === t.charAt(t.length - 1) && (m -= (new Date).getTimezoneOffset());
                    t = String(t).replace(/\T/g, "#").replace(/\t/, "%").split(r.parseRe);
                    e = e.replace(/\T/g, "#").replace(/\t/, "%").split(r.parseRe);
                    for (s = 0, n = e.length; n > s; s++) {
                        if ("M" === e[s]) {
                            a = $.inArray(t[s], r.monthNames);
                            if (-1 !== a && 12 > a) {
                                t[s] = a + 1;
                                h.m = t[s]
                            }
                        }
                        if ("F" === e[s]) {
                            a = $.inArray(t[s], r.monthNames, 12);
                            if (-1 !== a && a > 11) {
                                t[s] = a + 1 - 12;
                                h.m = t[s]
                            }
                        }
                        if ("a" === e[s]) {
                            a = $.inArray(t[s], r.AmPm);
                            if (-1 !== a && 2 > a && t[s] === r.AmPm[a]) {
                                t[s] = a;
                                h.h = g(t[s], h.h)
                            }
                        }
                        if ("A" === e[s]) {
                            a = $.inArray(t[s], r.AmPm);
                            if (-1 !== a && a > 1 && t[s] === r.AmPm[a]) {
                                t[s] = a - 2;
                                h.h = g(t[s], h.h)
                            }
                        }
                        "g" === e[s] && (h.h = parseInt(t[s], 10));
                        void 0 !== t[s] && (h[e[s].toLowerCase()] = parseInt(t[s], 10))
                    }
                    h.f && (h.m = h.f);
                    if (0 === h.m && 0 === h.y && 0 === h.d) return "&#160;";
                    h.m = parseInt(h.m, 10) - 1;
                    var v = h.y;
                    v >= 70 && 99 >= v ? h.y = 1900 + h.y : v >= 0 && 69 >= v && (h.y = 2e3 + h.y);
                    f = new Date(h.y, h.m, h.d, h.h, h.i, h.s, h.u);
                    m > 0 && f.setTime(Number(Number(f) + 60 * m * 1e3))
                } else f = new Date(1e3 * parseFloat(t));
                else f = new Date(h.y, h.m, h.d, h.h, h.i, h.s, h.u);
                if (void 0 === i) return f;
                r.masks.hasOwnProperty(i) ? i = r.masks[i] : i || (i = "Y-m-d");
                var b = f.getHours(),
                    w = f.getMinutes(),
                    y = f.getDate(),
                    C = f.getMonth() + 1,
                    N = f.getTimezoneOffset(),
                    D = f.getSeconds(),
                    k = f.getMilliseconds(),
                    _ = f.getDay(),
                    x = f.getFullYear(),
                    j = (_ + 6) % 7 + 1,
                    I = (new Date(x, C - 1, y) - new Date(x, 0, 1)) / 864e5,
                    T = {
                        d: p(y),
                        D: r.dayNames[_],
                        j: y,
                        l: r.dayNames[_ + 7],
                        N: j,
                        S: r.S(y),
                        w: _,
                        z: I,
                        W: 5 > j ? Math.floor((I + j - 1) / 7) + 1 : Math.floor((I + j - 1) / 7) || ((new Date(x - 1, 0, 1).getDay() + 6) % 7 < 4 ? 53 : 52),
                        F: r.monthNames[C - 1 + 12],
                        m: p(C),
                        M: r.monthNames[C - 1],
                        n: C,
                        t: "?",
                        L: "?",
                        o: "?",
                        Y: x,
                        y: String(x).substring(2),
                        a: 12 > b ? r.AmPm[0] : r.AmPm[1],
                        A: 12 > b ? r.AmPm[2] : r.AmPm[3],
                        B: "?",
                        g: b % 12 || 12,
                        G: b,
                        h: p(b % 12 || 12),
                        H: p(b),
                        i: p(w),
                        s: p(D),
                        u: k,
                        e: "?",
                        I: "?",
                        O: (N > 0 ? "-" : "+") + p(100 * Math.floor(Math.abs(N) / 60) + Math.abs(N) % 60, 4),
                        P: "?",
                        T: (String(f).match(l) || [""]).pop().replace(d, ""),
                        Z: "?",
                        c: "?",
                        r: "?",
                        U: Math.floor(f / 1e3)
                    };
                return i.replace(o, function (e) {
                    return T.hasOwnProperty(e) ? T[e] : e.substring(1)
                })
            },
            jqID: function (e) {
                return String(e).replace(/[!"#$%&'()*+,.\/:; <=>?@\[\\\]\^`{|}~]/g, "\\$&")
            },
            guid: 1,
            uidPref: "jqg",
            randId: function (e) {
                return (e || $.jgrid.uidPref) + $.jgrid.guid++
            },
            getAccessor: function (e, t) {
                var i, r, a, s = [];
                if ("function" == typeof t) return t(e);
                i = e[t];
                if (void 0 === i) try {
                    "string" == typeof t && (s = t.split("."));
                    a = s.length;
                    if (a) {
                        i = e;
                        for (; i && a--;) {
                            r = s.shift();
                            i = i[r]
                        }
                    }
                } catch (n) {}
                return i
            },
            getXmlData: function (e, t, i) {
                var r, a = "string" == typeof t ? t.match(/^(.*)\[(\w+)\]$/) : null;
                if ("function" == typeof t) return t(e);
                if (a && a[2]) return a[1] ? $(a[1], e).attr(a[2]) : $(e).attr(a[2]);
                r = $(t, e);
                return i ? r : r.length > 0 ? $(r).text() : void 0
            },
            cellWidth: function () {
                var e = $("<div class='ui-jqgrid' style='left:10000px'><table class='ui-jqgrid-btable' style='width:5px;'><tr class='jqgrow'><td style='width:5px;display:block;'></td></tr></table></div>"),
                    t = e.appendTo("body").find("td").width();
                e.remove();
                return Math.abs(t - 5) > .1
            },
            cell_width: !0,
            ajaxOptions: {},
            from: function (source) {
                var QueryObject = function (d, q) {
                    "string" == typeof d && (d = $.data(d));
                    var self = this,
                        _data = d,
                        _usecase = !0,
                        _trim = !1,
                        _query = q,
                        _stripNum = /[\$,%]/g,
                        _lastCommand = null,
                        _lastField = null,
                        _orDepth = 0,
                        _negate = !1,
                        _queuedOperator = "",
                        _sorting = [],
                        _useProperties = !0;
                    if ("object" != typeof d || !d.push) throw "data provides is not an array";
                    d.length > 0 && (_useProperties = "object" != typeof d[0] ? !1 : !0);
                    this._hasData = function () {
                        return null === _data ? !1 : 0 === _data.length ? !1 : !0
                    };
                    this._getStr = function (e) {
                        var t = [];
                        _trim && t.push("jQuery.trim(");
                        t.push("String(" + e + ")");
                        _trim && t.push(")");
                        _usecase || t.push(".toLowerCase()");
                        return t.join("")
                    };
                    this._strComp = function (e) {
                        return "string" == typeof e ? ".toString()" : ""
                    };
                    this._group = function (e, t) {
                        return {
                            field: e.toString(),
                            unique: t,
                            items: []
                        }
                    };
                    this._toStr = function (e) {
                        _trim && (e = $.trim(e));
                        e = e.toString().replace(/\\/g, "\\\\").replace(/\"/g, '\\"');
                        return _usecase ? e : e.toLowerCase()
                    };
                    this._funcLoop = function (e) {
                        var t = [];
                        $.each(_data, function (i, r) {
                            t.push(e(r))
                        });
                        return t
                    };
                    this._append = function (e) {
                        var t;
                        null === _query ? _query = "" : _query += "" === _queuedOperator ? " && " : _queuedOperator;
                        for (t = 0; _orDepth > t; t++) _query += "(";
                        _negate && (_query += "!");
                        _query += "(" + e + ")";
                        _negate = !1;
                        _queuedOperator = "";
                        _orDepth = 0
                    };
                    this._setCommand = function (e, t) {
                        _lastCommand = e;
                        _lastField = t
                    };
                    this._resetNegate = function () {
                        _negate = !1
                    };
                    this._repeatCommand = function (e, t) {
                        return null === _lastCommand ? self : null !== e && null !== t ? _lastCommand(e, t) : null === _lastField ? _lastCommand(e) : _useProperties ? _lastCommand(_lastField, e) : _lastCommand(e)
                    };
                    this._equals = function (e, t) {
                        return 0 === self._compare(e, t, 1)
                    };
                    this._compare = function (e, t, i) {
                        var r = Object.prototype.toString;
                        void 0 === i && (i = 1);
                        void 0 === e && (e = null);
                        void 0 === t && (t = null);
                        if (null === e && null === t) return 0;
                        if (null === e && null !== t) return 1;
                        if (null !== e && null === t) return -1;
                        if ("[object Date]" === r.call(e) && "[object Date]" === r.call(t)) return t > e ? -i : e > t ? i : 0;
                        if (!_usecase && "number" != typeof e && "number" != typeof t) {
                            e = String(e);
                            t = String(t)
                        }
                        return t > e ? -i : e > t ? i : 0
                    };
                    this._performSort = function () {
                        0 !== _sorting.length && (_data = self._doSort(_data, 0))
                    };
                    this._doSort = function (e, t) {
                        var i = _sorting[t].by,
                            r = _sorting[t].dir,
                            a = _sorting[t].type,
                            s = _sorting[t].datefmt,
                            n = _sorting[t].sfunc;
                        if (t === _sorting.length - 1) return self._getOrder(e, i, r, a, s, n);
                        t++;
                        var o, l, d, c = self._getGroup(e, i, r, a, s),
                            u = [];
                        for (o = 0; o < c.length; o++) {
                            d = self._doSort(c[o].items, t);
                            for (l = 0; l < d.length; l++) u.push(d[l])
                        }
                        return u
                    };
                    this._getOrder = function (e, t, i, r, a, s) {
                        var n, o, l, d, c = [],
                            u = [],
                            p = "a" === i ? 1 : -1;
                        void 0 === r && (r = "text");
                        d = "float" === r || "number" === r || "currency" === r || "numeric" === r ?
                            function (e) {
                                var t = parseFloat(String(e).replace(_stripNum, ""));
                                return isNaN(t) ? Number.NEGATIVE_INFINITY : t
                            } : "int" === r || "integer" === r ?
                                function (e) {
                                    return e ? parseFloat(String(e).replace(_stripNum, "")) : Number.NEGATIVE_INFINITY
                                } : "date" === r || "datetime" === r ?
                                    function (e) {
                                        return $.jgrid.parseDate(a, e).getTime()
                                    } : $.isFunction(r) ? r : function (e) {
                                        e = e ? $.trim(String(e)) : "";
                                        return _usecase ? e : e.toLowerCase()
                                    };
                        $.each(e, function (e, i) {
                            o = "" !== t ? $.jgrid.getAccessor(i, t) : i;
                            void 0 === o && (o = "");
                            o = d(o, i);
                            u.push({
                                vSort: o,
                                index: e
                            })
                        });
                        u.sort($.isFunction(s) ?
                            function (e, t) {
                                e = e.vSort;
                                t = t.vSort;
                                return s.call(this, e, t, p)
                            } : function (e, t) {
                                e = e.vSort;
                                t = t.vSort;
                                return self._compare(e, t, p)
                            });
                        l = 0;
                        for (var h = e.length; h > l;) {
                            n = u[l].index;
                            c.push(e[n]);
                            l++
                        }
                        return c
                    };
                    this._getGroup = function (e, t, i, r, a) {
                        var s, n = [],
                            o = null,
                            l = null;
                        $.each(self._getOrder(e, t, i, r, a), function (e, i) {
                            s = $.jgrid.getAccessor(i, t);
                            null == s && (s = "");
                            if (!self._equals(l, s)) {
                                l = s;
                                null !== o && n.push(o);
                                o = self._group(t, s)
                            }
                            o.items.push(i)
                        });
                        null !== o && n.push(o);
                        return n
                    };
                    this.ignoreCase = function () {
                        _usecase = !1;
                        return self
                    };
                    this.useCase = function () {
                        _usecase = !0;
                        return self
                    };
                    this.trim = function () {
                        _trim = !0;
                        return self
                    };
                    this.noTrim = function () {
                        _trim = !1;
                        return self
                    };
                    this.execute = function () {
                        var match = _query,
                            results = [];
                        if (null === match) return self;
                        $.each(_data, function () {
                            eval(match) && results.push(this)
                        });
                        _data = results;
                        return self
                    };
                    this.data = function () {
                        return _data
                    };
                    this.select = function (e) {
                        self._performSort();
                        if (!self._hasData()) return [];
                        self.execute();
                        if ($.isFunction(e)) {
                            var t = [];
                            $.each(_data, function (i, r) {
                                t.push(e(r))
                            });
                            return t
                        }
                        return _data
                    };
                    this.hasMatch = function () {
                        if (!self._hasData()) return !1;
                        self.execute();
                        return _data.length > 0
                    };
                    this.andNot = function (e, t, i) {
                        _negate = !_negate;
                        return self.and(e, t, i)
                    };
                    this.orNot = function (e, t, i) {
                        _negate = !_negate;
                        return self.or(e, t, i)
                    };
                    this.not = function (e, t, i) {
                        return self.andNot(e, t, i)
                    };
                    this.and = function (e, t, i) {
                        _queuedOperator = " && ";
                        return void 0 === e ? self : self._repeatCommand(e, t, i)
                    };
                    this.or = function (e, t, i) {
                        _queuedOperator = " || ";
                        return void 0 === e ? self : self._repeatCommand(e, t, i)
                    };
                    this.orBegin = function () {
                        _orDepth++;
                        return self
                    };
                    this.orEnd = function () {
                        null !== _query && (_query += ")");
                        return self
                    };
                    this.isNot = function (e) {
                        _negate = !_negate;
                        return self.is(e)
                    };
                    this.is = function (e) {
                        self._append("this." + e);
                        self._resetNegate();
                        return self
                    };
                    this._compareValues = function (e, t, i, r, a) {
                        var s;
                        s = _useProperties ? "jQuery.jgrid.getAccessor(this,'" + t + "')" : "this";
                        void 0 === i && (i = null);
                        var n = i,
                            o = void 0 === a.stype ? "text" : a.stype;
                        if (null !== i) switch (o) {
                            case "int":
                            case "integer":
                                n = isNaN(Number(n)) || "" === n ? "0" : n;
                                s = "parseInt(" + s + ",10)";
                                n = "parseInt(" + n + ",10)";
                                break;
                            case "float":
                            case "number":
                            case "numeric":
                                n = String(n).replace(_stripNum, "");
                                n = isNaN(Number(n)) || "" === n ? "0" : n;
                                s = "parseFloat(" + s + ")";
                                n = "parseFloat(" + n + ")";
                                break;
                            case "date":
                            case "datetime":
                                n = String($.jgrid.parseDate(a.newfmt || "Y-m-d", n).getTime());
                                s = 'jQuery.jgrid.parseDate("' + a.srcfmt + '",' + s + ").getTime()";
                                break;
                            default:
                                s = self._getStr(s);
                                n = self._getStr('"' + self._toStr(n) + '"')
                        }
                        self._append(s + " " + r + " " + n);
                        self._setCommand(e, t);
                        self._resetNegate();
                        return self
                    };
                    this.equals = function (e, t, i) {
                        return self._compareValues(self.equals, e, t, "==", i)
                    };
                    this.notEquals = function (e, t, i) {
                        return self._compareValues(self.equals, e, t, "!==", i)
                    };
                    this.isNull = function (e, t, i) {
                        return self._compareValues(self.equals, e, null, "===", i)
                    };
                    this.greater = function (e, t, i) {
                        return self._compareValues(self.greater, e, t, ">", i)
                    };
                    this.less = function (e, t, i) {
                        return self._compareValues(self.less, e, t, "<", i)
                    };
                    this.greaterOrEquals = function (e, t, i) {
                        return self._compareValues(self.greaterOrEquals, e, t, ">=", i)
                    };
                    this.lessOrEquals = function (e, t, i) {
                        return self._compareValues(self.lessOrEquals, e, t, "<=", i)
                    };
                    this.startsWith = function (e, t) {
                        var i = null == t ? e : t,
                            r = _trim ? $.trim(i.toString()).length : i.toString().length;
                        if (_useProperties) self._append(self._getStr("jQuery.jgrid.getAccessor(this,'" + e + "')") + ".substr(0," + r + ") == " + self._getStr('"' + self._toStr(t) + '"'));
                        else {
                            null != t && (r = _trim ? $.trim(t.toString()).length : t.toString().length);
                            self._append(self._getStr("this") + ".substr(0," + r + ") == " + self._getStr('"' + self._toStr(e) + '"'))
                        }
                        self._setCommand(self.startsWith, e);
                        self._resetNegate();
                        return self
                    };
                    this.endsWith = function (e, t) {
                        var i = null == t ? e : t,
                            r = _trim ? $.trim(i.toString()).length : i.toString().length;
                        self._append(_useProperties ? self._getStr("jQuery.jgrid.getAccessor(this,'" + e + "')") + ".substr(" + self._getStr("jQuery.jgrid.getAccessor(this,'" + e + "')") + ".length-" + r + "," + r + ') == "' + self._toStr(t) + '"' : self._getStr("this") + ".substr(" + self._getStr("this") + '.length-"' + self._toStr(e) + '".length,"' + self._toStr(e) + '".length) == "' + self._toStr(e) + '"');
                        self._setCommand(self.endsWith, e);
                        self._resetNegate();
                        return self
                    };
                    this.contains = function (e, t) {
                        self._append(_useProperties ? self._getStr("jQuery.jgrid.getAccessor(this,'" + e + "')") + '.indexOf("' + self._toStr(t) + '",0) > -1' : self._getStr("this") + '.indexOf("' + self._toStr(e) + '",0) > -1');
                        self._setCommand(self.contains, e);
                        self._resetNegate();
                        return self
                    };
                    this.groupBy = function (e, t, i, r) {
                        return self._hasData() ? self._getGroup(_data, e, t, i, r) : null
                    };
                    this.orderBy = function (e, t, i, r, a) {
                        t = null == t ? "a" : $.trim(t.toString().toLowerCase());
                        null == i && (i = "text");
                        null == r && (r = "Y-m-d");
                        null == a && (a = !1);
                        ("desc" === t || "descending" === t) && (t = "d");
                        ("asc" === t || "ascending" === t) && (t = "a");
                        _sorting.push({
                            by: e,
                            dir: t,
                            type: i,
                            datefmt: r,
                            sfunc: a
                        });
                        return self
                    };
                    return self
                };
                return new QueryObject(source, null)
            },
            getMethod: function (e) {
                return this.getAccessor($.fn.jqGrid, e)
            },
            extend: function (e) {
                $.extend($.fn.jqGrid, e);
                this.no_legacy_api || $.fn.extend(e)
            }
        });
        $.fn.jqGrid = function (e) {
            if ("string" == typeof e) {
                var t = $.jgrid.getMethod(e);
                if (!t) throw "jqGrid - No such method: " + e;
                var i = $.makeArray(arguments).slice(1);
                return t.apply(this, i)
            }
            return this.each(function () {
                if (!this.grid) {
                    var t = $.extend(!0, {
                            url: "",
                            height: 150,
                            page: 1,
                            rowNum: 20,
                            rowTotal: null,
                            records: 0,
                            pager: "",
                            pgbuttons: !0,
                            pginput: !0,
                            colModel: [],
                            rowList: [],
                            colNames: [],
                            sortorder: "asc",
                            sortname: "",
                            datatype: "xml",
                            mtype: "GET",
                            altRows: !1,
                            selarrrow: [],
                            savedRow: [],
                            shrinkToFit: !0,
                            xmlReader: {},
                            jsonReader: {},
                            subGrid: !1,
                            subGridModel: [],
                            reccount: 0,
                            lastpage: 0,
                            lastsort: 0,
                            selrow: null,
                            beforeSelectRow: null,
                            onSelectRow: null,
                            onSortCol: null,
                            ondblClickRow: null,
                            onRightClickRow: null,
                            onPaging: null,
                            onSelectAll: null,
                            onInitGrid: null,
                            loadComplete: null,
                            gridComplete: null,
                            loadError: null,
                            loadBeforeSend: null,
                            afterInsertRow: null,
                            beforeRequest: null,
                            beforeProcessing: null,
                            onHeaderClick: null,
                            viewrecords: !1,
                            loadonce: !1,
                            multiselect: !1,
                            multikey: !1,
                            editurl: null,
                            search: !1,
                            caption: "",
                            hidegrid: !0,
                            hiddengrid: !1,
                            postData: {},
                            userData: {},
                            treeGrid: !1,
                            treeGridModel: "nested",
                            treeReader: {},
                            treeANode: -1,
                            ExpandColumn: null,
                            tree_root_level: 0,
                            prmNames: {
                                page: "page",
                                rows: "rows",
                                sort: "sidx",
                                order: "sord",
                                search: "_search",
                                nd: "nd",
                                id: "id",
                                oper: "oper",
                                editoper: "edit",
                                addoper: "add",
                                deloper: "del",
                                subgridid: "id",
                                npage: null,
                                totalrows: "totalrows"
                            },
                            forceFit: !1,
                            gridstate: "visible",
                            cellEdit: !1,
                            cellsubmit: "remote",
                            nv: 0,
                            loadui: "enable",
                            toolbar: [!1, ""],
                            scroll: !1,
                            multiboxonly: !1,
                            deselectAfterSort: !0,
                            scrollrows: !1,
                            autowidth: !1,
                            scrollOffset: 18,
                            cellLayout: 5,
                            subGridWidth: 20,
                            multiselectWidth: 20,
                            gridview: !1,
                            rownumWidth: 25,
                            rownumbers: !1,
                            pagerpos: "center",
                            recordpos: "right",
                            footerrow: !1,
                            userDataOnFooter: !1,
                            hoverrows: !0,
                            altclass: "ui-priority-secondary",
                            viewsortcols: [!1, "vertical", !0],
                            resizeclass: "",
                            autoencode: !1,
                            remapColumns: [],
                            ajaxGridOptions: {},
                            direction: "ltr",
                            toppager: !1,
                            headertitles: !1,
                            scrollTimeout: 40,
                            data: [],
                            _index: {},
                            grouping: !1,
                            groupingView: {
                                groupField: [],
                                groupOrder: [],
                                groupText: [],
                                groupColumnShow: [],
                                groupSummary: [],
                                showSummaryOnHide: !1,
                                sortitems: [],
                                sortnames: [],
                                summary: [],
                                summaryval: [],
                                plusicon: "ui-icon-circlesmall-plus",
                                minusicon: "ui-icon-circlesmall-minus",
                                displayField: [],
                                groupSummaryPos: [],
                                formatDisplayField: [],
                                _locgr: !1
                            },
                            ignoreCase: !1,
                            cmTemplate: {},
                            idPrefix: "",
                            multiSort: !1,
                            minColWidth: 33
                        }, $.jgrid.defaults, e || {}),
                        i = this,
                        r = {
                            headers: [],
                            cols: [],
                            footers: [],
                            dragStart: function (e, r, a) {
                                var s = $(this.bDiv).offset().left;
                                this.resizing = {
                                    idx: e,
                                    startX: r.pageX,
                                    sOL: r.pageX - s
                                };
                                this.hDiv.style.cursor = "col-resize";
                                this.curGbox = $("#rs_m" + $.jgrid.jqID(t.id), "#gbox_" + $.jgrid.jqID(t.id));
                                this.curGbox.css({
                                    display: "block",
                                    left: r.pageX - s,
                                    top: a[1],
                                    height: a[2]
                                });
                                $(i).triggerHandler("jqGridResizeStart", [r, e]);
                                $.isFunction(t.resizeStart) && t.resizeStart.call(i, r, e);
                                document.onselectstart = function () {
                                    return !1
                                }
                            },
                            dragMove: function (e) {
                                if (this.resizing) {
                                    var i, r, a = e.pageX - this.resizing.startX,
                                        s = this.headers[this.resizing.idx],
                                        n = "ltr" === t.direction ? s.width + a : s.width - a;
                                    if (n > 33) {
                                        this.curGbox.css({
                                            left: this.resizing.sOL + a
                                        });
                                        if (t.forceFit === !0) {
                                            i = this.headers[this.resizing.idx + t.nv];
                                            r = "ltr" === t.direction ? i.width - a : i.width + a;
                                            if (r > t.minColWidth) {
                                                s.newWidth = n;
                                                i.newWidth = r
                                            }
                                        } else {
                                            this.newWidth = "ltr" === t.direction ? t.tblwidth + a : t.tblwidth - a;
                                            s.newWidth = n
                                        }
                                    }
                                }
                            },
                            dragEnd: function () {
                                this.hDiv.style.cursor = "default";
                                if (this.resizing) {
                                    var e = this.resizing.idx,
                                        r = this.headers[e].newWidth || this.headers[e].width;
                                    r = parseInt(r, 10);
                                    this.resizing = !1;
                                    $("#rs_m" + $.jgrid.jqID(t.id)).css("display", "none");
                                    t.colModel[e].width = r;
                                    this.headers[e].width = r;
                                    this.headers[e].el.style.width = r + "px";
                                    this.cols[e].style.width = r + "px";
                                    this.footers.length > 0 && (this.footers[e].style.width = r + "px");
                                    if (t.forceFit === !0) {
                                        r = this.headers[e + t.nv].newWidth || this.headers[e + t.nv].width;
                                        this.headers[e + t.nv].width = r;
                                        this.headers[e + t.nv].el.style.width = r + "px";
                                        this.cols[e + t.nv].style.width = r + "px";
                                        this.footers.length > 0 && (this.footers[e + t.nv].style.width = r + "px");
                                        t.colModel[e + t.nv].width = r
                                    } else {
                                        t.tblwidth = this.newWidth || t.tblwidth;
                                        $("table:first", this.bDiv).css("width", t.tblwidth + "px");
                                        $("table:first", this.hDiv).css("width", t.tblwidth + "px");
                                        this.hDiv.scrollLeft = this.bDiv.scrollLeft;
                                        if (t.footerrow) {
                                            $("table:first", this.sDiv).css("width", t.tblwidth + "px");
                                            this.sDiv.scrollLeft = this.bDiv.scrollLeft
                                        }
                                    }
                                    $(i).triggerHandler("jqGridResizeStop", [r, e]);
                                    $.isFunction(t.resizeStop) && t.resizeStop.call(i, r, e)
                                }
                                this.curGbox = null;
                                document.onselectstart = function () {
                                    return !0
                                }
                            },
                            populateVisible: function () {
                                r.timer && clearTimeout(r.timer);
                                r.timer = null;
                                var e = $(r.bDiv).height();
                                if (e) {
                                    var i, a, s = $("table:first", r.bDiv);
                                    if (s[0].rows.length) try {
                                        i = s[0].rows[1];
                                        a = i ? $(i).outerHeight() || r.prevRowHeight : r.prevRowHeight
                                    } catch (n) {
                                        a = r.prevRowHeight
                                    }
                                    if (a) {
                                        r.prevRowHeight = a;
                                        var o, l, d, c = t.rowNum,
                                            u = r.scrollTop = r.bDiv.scrollTop,
                                            p = Math.round(s.position().top) - u,
                                            h = p + s.height(),
                                            f = a * c;
                                        if (e > h && 0 >= p && (void 0 === t.lastpage || (parseInt((h + u + f - 1) / f, 10) || 0) <= t.lastpage)) {
                                            l = parseInt((e - h + f - 1) / f, 10) || 1;
                                            if (h >= 0 || 2 > l || t.scroll === !0) {
                                                o = (Math.round((h + u) / f) || 0) + 1;
                                                p = -1
                                            } else p = 1
                                        }
                                        if (p > 0) {
                                            o = (parseInt(u / f, 10) || 0) + 1;
                                            l = (parseInt((u + e) / f, 10) || 0) + 2 - o;
                                            d = !0
                                        }
                                        if (l) {
                                            if (t.lastpage && (o > t.lastpage || 1 === t.lastpage || o === t.page && o === t.lastpage)) return;
                                            if (r.hDiv.loading) r.timer = setTimeout(r.populateVisible, t.scrollTimeout);
                                            else {
                                                t.page = o;
                                                if (d) {
                                                    r.selectionPreserver(s[0]);
                                                    r.emptyRows.call(s[0], !1, !1)
                                                }
                                                r.populate(l)
                                            }
                                        }
                                    }
                                }
                            },
                            scrollGrid: function (e) {
                                if (t.scroll) {
                                    var i = r.bDiv.scrollTop;
                                    void 0 === r.scrollTop && (r.scrollTop = 0);
                                    if (i !== r.scrollTop) {
                                        r.scrollTop = i;
                                        r.timer && clearTimeout(r.timer);
                                        r.timer = setTimeout(r.populateVisible, t.scrollTimeout)
                                    }
                                }
                                r.hDiv.scrollLeft = r.bDiv.scrollLeft;
                                t.footerrow && (r.sDiv.scrollLeft = r.bDiv.scrollLeft);
                                e && e.stopPropagation()
                            },
                            selectionPreserver: function (e) {
                                var t = e.p,
                                    i = t.selrow,
                                    r = t.selarrrow ? $.makeArray(t.selarrrow) : null,
                                    a = e.grid.bDiv.scrollLeft,
                                    s = function () {
                                        var n;
                                        t.selrow = null;
                                        t.selarrrow = [];
                                        if (t.multiselect && r && r.length > 0) for (n = 0; n < r.length; n++) r[n] !== i && $(e).jqGrid("setSelection", r[n], !1, null);
                                        i && $(e).jqGrid("setSelection", i, !1, null);
                                        e.grid.bDiv.scrollLeft = a;
                                        $(e).unbind(".selectionPreserver", s)
                                    };
                                $(e).bind("jqGridGridComplete.selectionPreserver", s)
                            }
                        };
                    if ("TABLE" === this.tagName.toUpperCase() && null != this.id) if (void 0 !== document.documentMode && document.documentMode <= 5) alert("Grid can not be used in this ('quirks') mode!");
                    else {
                        $(this).empty().attr("tabindex", "0");
                        this.p = t;
                        this.p.useProp = !! $.fn.prop;
                        var a, s;
                        if (0 === this.p.colNames.length) for (a = 0; a < this.p.colModel.length; a++) this.p.colNames[a] = this.p.colModel[a].label || this.p.colModel[a].name;
                        if (this.p.colNames.length === this.p.colModel.length) {
                            var n = $("<div class='ui-jqgrid-view'></div>"),
                                o = $.jgrid.msie;
                            i.p.direction = $.trim(i.p.direction.toLowerCase()); - 1 === $.inArray(i.p.direction, ["ltr", "rtl"]) && (i.p.direction = "ltr");
                            s = i.p.direction;
                            $(n).insertBefore(this);
                            $(this).removeClass("scroll").appendTo(n);
                            var l = $("<div class='ui-jqgrid ui-widget ui-widget-content ui-corner-all'></div>");
                            $(l).attr({
                                id: "gbox_" + this.id,
                                dir: s
                            }).insertBefore(n);
                            $(n).attr("id", "gview_" + this.id).appendTo(l);
                            $("<div class='ui-widget-overlay jqgrid-overlay' id='lui_" + this.id + "'></div>").insertBefore(n);
                            $("<div class='loading ui-state-default ui-state-active' id='load_" + this.id + "'>" + this.p.loadtext + "</div>").insertBefore(n);
                            $(this).attr({
                                cellspacing: "0",
                                cellpadding: "0",
                                border: "0",
                                role: "grid",
                                "aria-multiselectable": !! this.p.multiselect,
                                "aria-labelledby": "gbox_" + this.id
                            });
                            var d = ["shiftKey", "altKey", "ctrlKey"],
                                c = function (e, t) {
                                    e = parseInt(e, 10);
                                    return isNaN(e) ? t || 0 : e
                                },
                                u = function (e, t, a, s, n, o) {
                                    var l, d = i.p.colModel[e],
                                        c = d.align,
                                        u = 'style="',
                                        p = d.classes,
                                        h = d.name,
                                        f = [];
                                    c && (u += "text-align:" + c + ";");
                                    d.hidden === !0 && (u += "display:none;");
                                    if (0 === t) u += "width: " + r.headers[e].width + "px;";
                                    else if (d.cellattr && $.isFunction(d.cellattr)) {
                                        l = d.cellattr.call(i, n, a, s, d, o);
                                        if (l && "string" == typeof l) {
                                            l = l.replace(/style/i, "style").replace(/title/i, "title");
                                            l.indexOf("title") > -1 && (d.title = !1);
                                            l.indexOf("class") > -1 && (p = void 0);
                                            f = l.replace("-style", "-sti").split(/style/);
                                            if (2 === f.length) {
                                                f[1] = $.trim(f[1].replace("-sti", "-style").replace("=", ""));
                                                (0 === f[1].indexOf("'") || 0 === f[1].indexOf('"')) && (f[1] = f[1].substring(1));
                                                u += f[1].replace(/'/gi, '"')
                                            } else u += '"'
                                        }
                                    }
                                    if (!f.length) {
                                        f[0] = "";
                                        u += '"'
                                    }
                                    u += (void 0 !== p ? ' class="' + p + '"' : "") + (d.title && a ? ' title="' + $.jgrid.stripHtml(a) + '"' : "");
                                    u += ' aria-describedby="' + i.p.id + "_" + h + '"';
                                    return u + f[0]
                                },
                                p = function (e) {
                                    return null == e || "" === e ? "&#160;" : i.p.autoencode ? $.jgrid.htmlEncode(e) : String(e)
                                },
                                h = function (e, t, r, a, s) {
                                    var n, o = i.p.colModel[r];
                                    if (void 0 !== o.formatter) {
                                        e = "" !== String(i.p.idPrefix) ? $.jgrid.stripPref(i.p.idPrefix, e) : e;
                                        var l = {
                                            rowId: e,
                                            colModel: o,
                                            gid: i.p.id,
                                            pos: r
                                        };
                                        n = $.isFunction(o.formatter) ? o.formatter.call(i, t, l, a, s) : $.fmatter ? $.fn.fmatter.call(i, o.formatter, t, l, a, s) : p(t)
                                    } else n = p(t);
                                    return n
                                },
                                f = function (e, t, i, r, a, s) {
                                    var n, o;
                                    n = h(e, t, i, a, "add");
                                    o = u(i, r, n, a, e, s);
                                    return '<td role="gridcell" ' + o + ">" + n + "</td>"
                                },
                                g = function (e, t, r, a) {
                                    var s = '<input role="checkbox" type="checkbox" id="jqg_' + i.p.id + "_" + e + '" class="cbox" name="jqg_' + i.p.id + "_" + e + '"' + (a ? 'checked="checked"' : "") + "/>",
                                        n = u(t, r, "", null, e, !0);
                                    return '<td role="gridcell" ' + n + ">" + s + "</td>"
                                },
                                m = function (e, t, i, r) {
                                    var a = (parseInt(i, 10) - 1) * parseInt(r, 10) + 1 + t,
                                        s = u(e, t, a, null, t, !0);
                                    return '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + s + ">" + a + "</td>"
                                },
                                v = function (e) {
                                    var t, r, a = [],
                                        s = 0;
                                    for (r = 0; r < i.p.colModel.length; r++) {
                                        t = i.p.colModel[r];
                                        if ("cb" !== t.name && "subgrid" !== t.name && "rn" !== t.name) {
                                            a[s] = "local" === e ? t.name : "xml" === e || "xmlstring" === e ? t.xmlmap || t.name : t.jsonmap || t.name;
                                            i.p.keyName !== !1 && t.key === !0 && (i.p.keyName = a[s]);
                                            s++
                                        }
                                    }
                                    return a
                                },
                                b = function (e) {
                                    var t = i.p.remapColumns;
                                    t && t.length || (t = $.map(i.p.colModel, function (e, t) {
                                        return t
                                    }));
                                    e && (t = $.map(t, function (t) {
                                        return e > t ? null : t - e
                                    }));
                                    return t
                                },
                                w = function (e, t) {
                                    var i;
                                    if (this.p.deepempty) $(this.rows).slice(1).remove();
                                    else {
                                        i = this.rows.length > 0 ? this.rows[0] : null;
                                        $(this.firstChild).empty().append(i)
                                    }
                                    if (e && this.p.scroll) {
                                        $(this.grid.bDiv.firstChild).css({
                                            height: "auto"
                                        });
                                        $(this.grid.bDiv.firstChild.firstChild).css({
                                            height: 0,
                                            display: "none"
                                        });
                                        0 !== this.grid.bDiv.scrollTop && (this.grid.bDiv.scrollTop = 0)
                                    }
                                    if (t === !0 && this.p.treeGrid) {
                                        this.p.data = [];
                                        this.p._index = {}
                                    }
                                },
                                y = function (e) {
                                    var t, r, a, s = i.p.data.length;
                                    t = i.p.keyName === !1 || i.p.loadonce === !0 ? i.p.localReader.id : i.p.keyName;
                                    if ("delete" === e) {
                                        var n = 0;
                                        for (var o in i.p._index) i.p._index.hasOwnProperty(o) && (i.p._index[o] = n++)
                                    } else for (r = 0; s > r; r++) {
                                        a = $.jgrid.getAccessor(i.p.data[r], t);
                                        void 0 === a && (a = String(r + 1));
                                        i.p._index[a] = r
                                    }
                                },
                                C = function (e, t, r, a, s, n) {
                                    var o, l = "-1",
                                        d = "",
                                        c = t ? "display:none;" : "",
                                        u = "ui-widget-content jqgrow ui-row-" + i.p.direction + (r ? " " + r : "") + (n ? " ui-state-highlight" : ""),
                                        p = $(i).triggerHandler("jqGridRowAttr", [a, s, e]);
                                    "object" != typeof p && (p = $.isFunction(i.p.rowattr) ? i.p.rowattr.call(i, a, s, e) : {});
                                    if (!$.isEmptyObject(p)) {
                                        if (p.hasOwnProperty("id")) {
                                            e = p.id;
                                            delete p.id
                                        }
                                        if (p.hasOwnProperty("tabindex")) {
                                            l = p.tabindex;
                                            delete p.tabindex
                                        }
                                        if (p.hasOwnProperty("style")) {
                                            c += p.style;
                                            delete p.style
                                        }
                                        if (p.hasOwnProperty("class")) {
                                            u += " " + p["class"];
                                            delete p["class"]
                                        }
                                        try {
                                            delete p.role
                                        } catch (h) {}
                                        for (o in p) p.hasOwnProperty(o) && (d += " " + o + "=" + p[o])
                                    }
                                    return '<tr role="row" id="' + e + '" tabindex="' + l + '" class="' + u + '"' + ("" === c ? "" : ' style="' + c + '"') + d + ">"
                                },
                                N = function (e, t, r, a, s) {
                                    var n = new Date,
                                        o = "local" !== i.p.datatype && i.p.loadonce || "xmlstring" === i.p.datatype,
                                        l = "_id_",
                                        d = i.p.xmlReader,
                                        u = "local" === i.p.datatype ? "local" : "xml";
                                    if (o) {
                                        i.p.data = [];
                                        i.p._index = {};
                                        i.p.localReader.id = l
                                    }
                                    i.p.reccount = 0;
                                    if ($.isXMLDoc(e)) {
                                        if (-1 !== i.p.treeANode || i.p.scroll) r = r > 1 ? r : 1;
                                        else {
                                            w.call(i, !1, !0);
                                            r = 1
                                        }
                                        var p, h, y, N, D, k, _, x, j, I, T = $(i),
                                            S = 0,
                                            E = i.p.multiselect === !0 ? 1 : 0,
                                            F = 0,
                                            R = i.p.rownumbers === !0 ? 1 : 0,
                                            q = [],
                                            P = {},
                                            A = [],
                                            L = i.p.altRows === !0 ? i.p.altclass : "";
                                        if (i.p.subGrid === !0) {
                                            F = 1;
                                            N = $.jgrid.getMethod("addSubGridCell")
                                        }
                                        d.repeatitems || (q = v(u));
                                        D = i.p.keyName === !1 ? $.isFunction(d.id) ? d.id.call(i, e) : d.id : i.p.keyName;
                                        k = -1 === String(D).indexOf("[") ? q.length ?
                                            function (e, t) {
                                                return $(D, e).text() || t
                                            } : function (e, t) {
                                                return $(d.cell, e).eq(D).text() || t
                                            } : function (e, t) {
                                            return e.getAttribute(D.replace(/[\[\]]/g, "")) || t
                                        };
                                        i.p.userData = {};
                                        i.p.page = c($.jgrid.getXmlData(e, d.page), i.p.page);
                                        i.p.lastpage = c($.jgrid.getXmlData(e, d.total), 1);
                                        i.p.records = c($.jgrid.getXmlData(e, d.records));
                                        $.isFunction(d.userdata) ? i.p.userData = d.userdata.call(i, e) || {} : $.jgrid.getXmlData(e, d.userdata, !0).each(function () {
                                            i.p.userData[this.getAttribute("name")] = $(this).text()
                                        });
                                        var M = $.jgrid.getXmlData(e, d.root, !0);
                                        M = $.jgrid.getXmlData(M, d.row, !0);
                                        M || (M = []);
                                        var O, G = M.length,
                                            H = 0,
                                            z = [],
                                            B = parseInt(i.p.rowNum, 10),
                                            W = i.p.scroll ? $.jgrid.randId() : 1;
                                        G > 0 && i.p.page <= 0 && (i.p.page = 1);
                                        if (M && G) {
                                            s && (B *= s + 1);
                                            var Y, U = $.isFunction(i.p.afterInsertRow),
                                                V = !1;
                                            if (i.p.grouping) {
                                                V = i.p.groupingView.groupCollapse === !0;
                                                Y = $.jgrid.getMethod("groupingPrepare")
                                            }
                                            for (; G > H;) {
                                                x = M[H];
                                                j = k(x, W + H);
                                                j = i.p.idPrefix + j;
                                                O = 0 === r ? 0 : r + 1;
                                                I = (O + H) % 2 === 1 ? L : "";
                                                var K = A.length;
                                                A.push("");
                                                R && A.push(m(0, H, i.p.page, i.p.rowNum));
                                                E && A.push(g(j, R, H, !1));
                                                F && A.push(N.call(T, E + R, H + r));
                                                if (d.repeatitems) {
                                                    _ || (_ = b(E + F + R));
                                                    var X = $.jgrid.getXmlData(x, d.cell, !0);
                                                    $.each(_, function (e) {
                                                        var t = X[this];
                                                        if (!t) return !1;
                                                        y = t.textContent || t.text;
                                                        P[i.p.colModel[e + E + F + R].name] = y;
                                                        A.push(f(j, y, e + E + F + R, H + r, x, P))
                                                    })
                                                } else for (p = 0; p < q.length; p++) {
                                                    y = $.jgrid.getXmlData(x, q[p]);
                                                    P[i.p.colModel[p + E + F + R].name] = y;
                                                    A.push(f(j, y, p + E + F + R, H + r, x, P))
                                                }
                                                A[K] = C(j, V, I, P, x, !1);
                                                A.push("</tr>");
                                                if (i.p.grouping) {
                                                    z.push(A);
                                                    i.p.groupingView._locgr || Y.call(T, P, H);
                                                    A = []
                                                }
                                                if (o || i.p.treeGrid === !0) {
                                                    P[l] = $.jgrid.stripPref(i.p.idPrefix, j);
                                                    i.p.data.push(P);
                                                    i.p._index[P[l]] = i.p.data.length - 1
                                                }
                                                if (i.p.gridview === !1) {
                                                    $("tbody:first", t).append(A.join(""));
                                                    T.triggerHandler("jqGridAfterInsertRow", [j, P, x]);
                                                    U && i.p.afterInsertRow.call(i, j, P, x);
                                                    A = []
                                                }
                                                P = {};
                                                S++;
                                                H++;
                                                if (S === B) break
                                            }
                                        }
                                        if (i.p.gridview === !0) {
                                            h = i.p.treeANode > -1 ? i.p.treeANode : 0;
                                            if (i.p.grouping) {
                                                if (!o) {
                                                    T.jqGrid("groupingRender", z, i.p.colModel.length, i.p.page, B);
                                                    z = null
                                                }
                                            } else i.p.treeGrid === !0 && h > 0 ? $(i.rows[h]).after(A.join("")) : $("tbody:first", t).append(A.join(""))
                                        }
                                        if (i.p.subGrid === !0) try {
                                            T.jqGrid("addSubGrid", E + R)
                                        } catch (Q) {}
                                        i.p.totaltime = new Date - n;
                                        S > 0 && 0 === i.p.records && (i.p.records = G);
                                        A = null;
                                        if (i.p.treeGrid === !0) try {
                                            T.jqGrid("setTreeNode", h + 1, S + h + 1)
                                        } catch (Z) {}
                                        i.p.treeGrid || i.p.scroll || (i.grid.bDiv.scrollTop = 0);
                                        i.p.reccount = S;
                                        i.p.treeANode = -1;
                                        i.p.userDataOnFooter && T.jqGrid("footerData", "set", i.p.userData, !0);
                                        if (o) {
                                            i.p.records = G;
                                            i.p.lastpage = Math.ceil(G / B)
                                        }
                                        a || i.updatepager(!1, !0);
                                        if (o) {
                                            for (; G > S;) {
                                                x = M[S];
                                                j = k(x, S + W);
                                                j = i.p.idPrefix + j;
                                                if (d.repeatitems) {
                                                    _ || (_ = b(E + F + R));
                                                    var J = $.jgrid.getXmlData(x, d.cell, !0);
                                                    $.each(_, function (e) {
                                                        var t = J[this];
                                                        if (!t) return !1;
                                                        y = t.textContent || t.text;
                                                        P[i.p.colModel[e + E + F + R].name] = y
                                                    })
                                                } else for (p = 0; p < q.length; p++) {
                                                    y = $.jgrid.getXmlData(x, q[p]);
                                                    P[i.p.colModel[p + E + F + R].name] = y
                                                }
                                                P[l] = $.jgrid.stripPref(i.p.idPrefix, j);
                                                i.p.grouping && Y.call(T, P, S);
                                                i.p.data.push(P);
                                                i.p._index[P[l]] = i.p.data.length - 1;
                                                P = {};
                                                S++
                                            }
                                            if (i.p.grouping) {
                                                i.p.groupingView._locgr = !0;
                                                T.jqGrid("groupingRender", z, i.p.colModel.length, i.p.page, B);
                                                z = null
                                            }
                                        }
                                    }
                                },
                                D = function (e, t, r, a, s) {
                                    var n = new Date;
                                    if (e) {
                                        if (-1 !== i.p.treeANode || i.p.scroll) r = r > 1 ? r : 1;
                                        else {
                                            w.call(i, !1, !0);
                                            r = 1
                                        }
                                        var o, l, d = "_id_",
                                            u = "local" !== i.p.datatype && i.p.loadonce || "jsonstring" === i.p.datatype;
                                        if (u) {
                                            i.p.data = [];
                                            i.p._index = {};
                                            i.p.localReader.id = d
                                        }
                                        i.p.reccount = 0;
                                        if ("local" === i.p.datatype) {
                                            o = i.p.localReader;
                                            l = "local"
                                        } else {
                                            o = i.p.jsonReader;
                                            l = "json"
                                        }
                                        var p, h, y, N, D, k, _, x, j, I, T, S, E = $(i),
                                            F = 0,
                                            R = [],
                                            q = i.p.multiselect ? 1 : 0,
                                            P = i.p.subGrid === !0 ? 1 : 0,
                                            A = i.p.rownumbers === !0 ? 1 : 0,
                                            L = b(q + P + A),
                                            M = v(l),
                                            O = {},
                                            G = [],
                                            H = i.p.altRows === !0 ? i.p.altclass : "";
                                        i.p.page = c($.jgrid.getAccessor(e, o.page), i.p.page);
                                        i.p.lastpage = c($.jgrid.getAccessor(e, o.total), 1);
                                        i.p.records = c($.jgrid.getAccessor(e, o.records));
                                        i.p.userData = $.jgrid.getAccessor(e, o.userdata) || {};
                                        P && (D = $.jgrid.getMethod("addSubGridCell"));
                                        j = i.p.keyName === !1 ? $.isFunction(o.id) ? o.id.call(i, e) : o.id : i.p.keyName;
                                        x = $.jgrid.getAccessor(e, o.root);
                                        null == x && $.isArray(e) && (x = e);
                                        x || (x = []);
                                        _ = x.length;
                                        h = 0;
                                        _ > 0 && i.p.page <= 0 && (i.p.page = 1);
                                        var z, B, W = parseInt(i.p.rowNum, 10),
                                            Y = i.p.scroll ? $.jgrid.randId() : 1,
                                            U = !1;
                                        s && (W *= s + 1);
                                        "local" !== i.p.datatype || i.p.deselectAfterSort || (U = !0);
                                        var V, K = $.isFunction(i.p.afterInsertRow),
                                            X = [],
                                            Q = !1;
                                        if (i.p.grouping) {
                                            Q = i.p.groupingView.groupCollapse === !0;
                                            V = $.jgrid.getMethod("groupingPrepare")
                                        }
                                        for (; _ > h;) {
                                            N = x[h];
                                            T = $.jgrid.getAccessor(N, j);
                                            if (void 0 === T) {
                                                "number" == typeof j && null != i.p.colModel[j + q + P + A] && (T = $.jgrid.getAccessor(N, i.p.colModel[j + q + P + A].name));
                                                if (void 0 === T) {
                                                    T = Y + h;
                                                    if (0 === R.length && o.cell) {
                                                        var Z = $.jgrid.getAccessor(N, o.cell) || N;
                                                        T = null != Z && void 0 !== Z[j] ? Z[j] : T;
                                                        Z = null
                                                    }
                                                }
                                            }
                                            T = i.p.idPrefix + T;
                                            z = 1 === r ? 0 : r;
                                            S = (z + h) % 2 === 1 ? H : "";
                                            U && (B = i.p.multiselect ? -1 !== $.inArray(T, i.p.selarrrow) : T === i.p.selrow);
                                            var J = G.length;
                                            G.push("");
                                            A && G.push(m(0, h, i.p.page, i.p.rowNum));
                                            q && G.push(g(T, A, h, B));
                                            P && G.push(D.call(E, q + A, h + r));
                                            k = M;
                                            if (o.repeatitems) {
                                                o.cell && (N = $.jgrid.getAccessor(N, o.cell) || N);
                                                $.isArray(N) && (k = L)
                                            }
                                            for (y = 0; y < k.length; y++) {
                                                p = $.jgrid.getAccessor(N, k[y]);
                                                O[i.p.colModel[y + q + P + A].name] = p;
                                                G.push(f(T, p, y + q + P + A, h + r, N, O))
                                            }
                                            G[J] = C(T, Q, S, O, N, B);
                                            G.push("</tr>");
                                            if (i.p.grouping) {
                                                X.push(G);
                                                i.p.groupingView._locgr || V.call(E, O, h);
                                                G = []
                                            }
                                            if (u || i.p.treeGrid === !0) {
                                                O[d] = $.jgrid.stripPref(i.p.idPrefix, T);
                                                i.p.data.push(O);
                                                i.p._index[O[d]] = i.p.data.length - 1
                                            }
                                            if (i.p.gridview === !1) {
                                                $("#" + $.jgrid.jqID(i.p.id) + " tbody:first").append(G.join(""));
                                                E.triggerHandler("jqGridAfterInsertRow", [T, O, N]);
                                                K && i.p.afterInsertRow.call(i, T, O, N);
                                                G = []
                                            }
                                            O = {};
                                            F++;
                                            h++;
                                            if (F === W) break
                                        }
                                        if (i.p.gridview === !0) {
                                            I = i.p.treeANode > -1 ? i.p.treeANode : 0;
                                            if (i.p.grouping) {
                                                if (!u) {
                                                    E.jqGrid("groupingRender", X, i.p.colModel.length, i.p.page, W);
                                                    X = null
                                                }
                                            } else i.p.treeGrid === !0 && I > 0 ? $(i.rows[I]).after(G.join("")) : $("#" + $.jgrid.jqID(i.p.id) + " tbody:first").append(G.join(""))
                                        }
                                        if (i.p.subGrid === !0) try {
                                            E.jqGrid("addSubGrid", q + A)
                                        } catch (et) {}
                                        i.p.totaltime = new Date - n;
                                        F > 0 && 0 === i.p.records && (i.p.records = _);
                                        G = null;
                                        if (i.p.treeGrid === !0) try {
                                            E.jqGrid("setTreeNode", I + 1, F + I + 1)
                                        } catch (tt) {}
                                        i.p.treeGrid || i.p.scroll || (i.grid.bDiv.scrollTop = 0);
                                        i.p.reccount = F;
                                        i.p.treeANode = -1;
                                        i.p.userDataOnFooter && E.jqGrid("footerData", "set", i.p.userData, !0);
                                        if (u) {
                                            i.p.records = _;
                                            i.p.lastpage = Math.ceil(_ / W)
                                        }
                                        a || i.updatepager(!1, !0);
                                        if (u) {
                                            for (; _ > F && x[F];) {
                                                N = x[F];
                                                T = $.jgrid.getAccessor(N, j);
                                                if (void 0 === T) {
                                                    "number" == typeof j && null != i.p.colModel[j + q + P + A] && (T = $.jgrid.getAccessor(N, i.p.colModel[j + q + P + A].name));
                                                    if (void 0 === T) {
                                                        T = Y + F;
                                                        if (0 === R.length && o.cell) {
                                                            var it = $.jgrid.getAccessor(N, o.cell) || N;
                                                            T = null != it && void 0 !== it[j] ? it[j] : T;
                                                            it = null
                                                        }
                                                    }
                                                }
                                                if (N) {
                                                    T = i.p.idPrefix + T;
                                                    k = M;
                                                    if (o.repeatitems) {
                                                        o.cell && (N = $.jgrid.getAccessor(N, o.cell) || N);
                                                        $.isArray(N) && (k = L)
                                                    }
                                                    for (y = 0; y < k.length; y++) O[i.p.colModel[y + q + P + A].name] = $.jgrid.getAccessor(N, k[y]);
                                                    O[d] = $.jgrid.stripPref(i.p.idPrefix, T);
                                                    i.p.grouping && V.call(E, O, F);
                                                    i.p.data.push(O);
                                                    i.p._index[O[d]] = i.p.data.length - 1;
                                                    O = {}
                                                }
                                                F++
                                            }
                                            if (i.p.grouping) {
                                                i.p.groupingView._locgr = !0;
                                                E.jqGrid("groupingRender", X, i.p.colModel.length, i.p.page, W);
                                                X = null
                                            }
                                        }
                                    }
                                },
                                k = function () {
                                    function e(t) {
                                        var i, r, a, s, n, o = 0;
                                        if (null != t.groups) {
                                            r = t.groups.length && "OR" === t.groupOp.toString().toUpperCase();
                                            r && g.orBegin();
                                            for (i = 0; i < t.groups.length; i++) {
                                                o > 0 && r && g.or();
                                                try {
                                                    e(t.groups[i])
                                                } catch (d) {
                                                    alert(d)
                                                }
                                                o++
                                            }
                                            r && g.orEnd()
                                        }
                                        if (null != t.rules) try {
                                            a = t.rules.length && "OR" === t.groupOp.toString().toUpperCase();
                                            a && g.orBegin();
                                            for (i = 0; i < t.rules.length; i++) {
                                                n = t.rules[i];
                                                s = t.groupOp.toString().toUpperCase();
                                                if (f[n.op] && n.field) {
                                                    o > 0 && s && "OR" === s && (g = g.or());
                                                    g = f[n.op](g, s)(n.field, n.data, l[n.field])
                                                }
                                                o++
                                            }
                                            a && g.orEnd()
                                        } catch (c) {
                                            alert(c)
                                        }
                                    }
                                    var t, r, a, s = i.p.multiSort ? [] : "",
                                        n = [],
                                        o = !1,
                                        l = {},
                                        d = [],
                                        c = [];
                                    if ($.isArray(i.p.data)) {
                                        var u, p, h = i.p.grouping ? i.p.groupingView : !1;
                                        $.each(i.p.colModel, function () {
                                            r = this.sorttype || "text";
                                            if ("date" === r || "datetime" === r) {
                                                if (this.formatter && "string" == typeof this.formatter && "date" === this.formatter) {
                                                    t = this.formatoptions && this.formatoptions.srcformat ? this.formatoptions.srcformat : $.jgrid.formatter.date.srcformat;
                                                    a = this.formatoptions && this.formatoptions.newformat ? this.formatoptions.newformat : $.jgrid.formatter.date.newformat
                                                } else t = a = this.datefmt || "Y-m-d";
                                                l[this.name] = {
                                                    stype: r,
                                                    srcfmt: t,
                                                    newfmt: a,
                                                    sfunc: this.sortfunc || null
                                                }
                                            } else l[this.name] = {
                                                stype: r,
                                                srcfmt: "",
                                                newfmt: "",
                                                sfunc: this.sortfunc || null
                                            };
                                            if (i.p.grouping) for (p = 0, u = h.groupField.length; u > p; p++) if (this.name === h.groupField[p]) {
                                                var e = this.name;
                                                this.index && (e = this.index);
                                                d[p] = l[e];
                                                c[p] = e
                                            }
                                            if (i.p.multiSort) {
                                                if (this.lso) {
                                                    s.push(this.name);
                                                    var f = this.lso.split("-");
                                                    n.push(f[f.length - 1])
                                                }
                                            } else if (!o && (this.index === i.p.sortname || this.name === i.p.sortname)) {
                                                s = this.name;
                                                o = !0
                                            }
                                        });
                                        if (!i.p.treeGrid) {
                                            var f = {
                                                    eq: function (e) {
                                                        return e.equals
                                                    },
                                                    ne: function (e) {
                                                        return e.notEquals
                                                    },
                                                    lt: function (e) {
                                                        return e.less
                                                    },
                                                    le: function (e) {
                                                        return e.lessOrEquals
                                                    },
                                                    gt: function (e) {
                                                        return e.greater
                                                    },
                                                    ge: function (e) {
                                                        return e.greaterOrEquals
                                                    },
                                                    cn: function (e) {
                                                        return e.contains
                                                    },
                                                    nc: function (e, t) {
                                                        return "OR" === t ? e.orNot().contains : e.andNot().contains
                                                    },
                                                    bw: function (e) {
                                                        return e.startsWith
                                                    },
                                                    bn: function (e, t) {
                                                        return "OR" === t ? e.orNot().startsWith : e.andNot().startsWith
                                                    },
                                                    en: function (e, t) {
                                                        return "OR" === t ? e.orNot().endsWith : e.andNot().endsWith
                                                    },
                                                    ew: function (e) {
                                                        return e.endsWith
                                                    },
                                                    ni: function (e, t) {
                                                        return "OR" === t ? e.orNot().equals : e.andNot().equals
                                                    },
                                                    "in": function (e) {
                                                        return e.equals
                                                    },
                                                    nu: function (e) {
                                                        return e.isNull
                                                    },
                                                    nn: function (e, t) {
                                                        return "OR" === t ? e.orNot().isNull : e.andNot().isNull
                                                    }
                                                },
                                                g = $.jgrid.from(i.p.data);
                                            i.p.ignoreCase && (g = g.ignoreCase());
                                            if (i.p.search === !0) {
                                                var m = i.p.postData.filters;
                                                if (m) {
                                                    "string" == typeof m && (m = $.jgrid.parse(m));
                                                    e(m)
                                                } else try {
                                                    g = f[i.p.postData.searchOper](g)(i.p.postData.searchField, i.p.postData.searchString, l[i.p.postData.searchField])
                                                } catch (v) {}
                                            }
                                            if (i.p.grouping) for (p = 0; u > p; p++) g.orderBy(c[p], h.groupOrder[p], d[p].stype, d[p].srcfmt);
                                            i.p.multiSort ? $.each(s, function (e) {
                                                g.orderBy(this, n[e], l[this].stype, l[this].srcfmt, l[this].sfunc)
                                            }) : s && i.p.sortorder && o && ("DESC" === i.p.sortorder.toUpperCase() ? g.orderBy(i.p.sortname, "d", l[s].stype, l[s].srcfmt, l[s].sfunc) : g.orderBy(i.p.sortname, "a", l[s].stype, l[s].srcfmt, l[s].sfunc));
                                            var b = g.select(),
                                                w = parseInt(i.p.rowNum, 10),
                                                y = b.length,
                                                C = parseInt(i.p.page, 10),
                                                N = Math.ceil(y / w),
                                                D = {};
                                            if ((i.p.search || i.p.resetsearch) && i.p.grouping && i.p.groupingView._locgr) {
                                                i.p.groupingView.groups = [];
                                                var k, _, x, j = $.jgrid.getMethod("groupingPrepare");
                                                if (i.p.footerrow && i.p.userDataOnFooter) {
                                                    for (_ in i.p.userData) i.p.userData.hasOwnProperty(_) && (i.p.userData[_] = 0);
                                                    x = !0
                                                }
                                                for (k = 0; y > k; k++) {
                                                    if (x) for (_ in i.p.userData) i.p.userData[_] += parseFloat(b[k][_] || 0);
                                                    j.call($(i), b[k], k, w)
                                                }
                                            }
                                            b = b.slice((C - 1) * w, C * w);
                                            g = null;
                                            l = null;
                                            D[i.p.localReader.total] = N;
                                            D[i.p.localReader.page] = C;
                                            D[i.p.localReader.records] = y;
                                            D[i.p.localReader.root] = b;
                                            D[i.p.localReader.userdata] = i.p.userData;
                                            b = null;
                                            return D
                                        }
                                        $(i).jqGrid("SortTree", s, i.p.sortorder, l[s].stype || "text", l[s].srcfmt || "")
                                    }
                                },
                                _ = function (e, t) {
                                    var r, a, s, n, o, l, d, u, p = "",
                                        h = i.p.pager ? "_" + $.jgrid.jqID(i.p.pager.substr(1)) : "",
                                        f = i.p.toppager ? "_" + i.p.toppager.substr(1) : "";
                                    s = parseInt(i.p.page, 10) - 1;
                                    0 > s && (s = 0);
                                    s *= parseInt(i.p.rowNum, 10);
                                    o = s + i.p.reccount;
                                    if (i.p.scroll) {
                                        var g = $("tbody:first > tr:gt(0)", i.grid.bDiv);
                                        s = o - g.length;
                                        i.p.reccount = g.length;
                                        var m = g.outerHeight() || i.grid.prevRowHeight;
                                        if (m) {
                                            var v = s * m,
                                                b = parseInt(i.p.records, 10) * m;
                                            $(">div:first", i.grid.bDiv).css({
                                                height: b
                                            }).children("div:first").css({
                                                height: v,
                                                display: v ? "" : "none"
                                            });
                                            0 == i.grid.bDiv.scrollTop && i.p.page > 1 && (i.grid.bDiv.scrollTop = i.p.rowNum * (i.p.page - 1) * m)
                                        }
                                        i.grid.bDiv.scrollLeft = i.grid.hDiv.scrollLeft
                                    }
                                    p = i.p.pager || "";
                                    p += i.p.toppager ? p ? "," + i.p.toppager : i.p.toppager : "";
                                    if (p) {
                                        d = $.jgrid.formatter.integer || {};
                                        r = c(i.p.page);
                                        a = c(i.p.lastpage);
                                        $(".selbox", p)[this.p.useProp ? "prop" : "attr"]("disabled", !1);
                                        if (i.p.pginput === !0) {
                                            $(".ui-pg-input", p).val(i.p.page);
                                            u = i.p.toppager ? "#sp_1" + h + ",#sp_1" + f : "#sp_1" + h;
                                            $(u).html($.fmatter ? $.fmatter.util.NumberFormat(i.p.lastpage, d) : i.p.lastpage)
                                        }
                                        if (i.p.viewrecords) if (0 === i.p.reccount) $(".ui-paging-info", p).html(i.p.emptyrecords);
                                        else {
                                            n = s + 1;
                                            l = i.p.records;
                                            if ($.fmatter) {
                                                n = $.fmatter.util.NumberFormat(n, d);
                                                o = $.fmatter.util.NumberFormat(o, d);
                                                l = $.fmatter.util.NumberFormat(l, d)
                                            }
                                            $(".ui-paging-info", p).html($.jgrid.format(i.p.recordtext, n, o, l))
                                        }
                                        if (i.p.pgbuttons === !0) {
                                            0 >= r && (r = a = 0);
                                            if (1 === r || 0 === r) {
                                                $("#first" + h + ", #prev" + h).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                                i.p.toppager && $("#first_t" + f + ", #prev_t" + f).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                            } else {
                                                $("#first" + h + ", #prev" + h).removeClass("ui-state-disabled");
                                                i.p.toppager && $("#first_t" + f + ", #prev_t" + f).removeClass("ui-state-disabled")
                                            }
                                            if (r === a || 0 === r) {
                                                $("#next" + h + ", #last" + h).addClass("ui-state-disabled").removeClass("ui-state-hover");
                                                i.p.toppager && $("#next_t" + f + ", #last_t" + f).addClass("ui-state-disabled").removeClass("ui-state-hover")
                                            } else {
                                                $("#next" + h + ", #last" + h).removeClass("ui-state-disabled");
                                                i.p.toppager && $("#next_t" + f + ", #last_t" + f).removeClass("ui-state-disabled")
                                            }
                                        }
                                    }
                                    e === !0 && i.p.rownumbers === !0 && $(">td.jqgrid-rownum", i.rows).each(function (e) {
                                        $(this).html(s + 1 + e)
                                    });
                                    t && i.p.jqgdnd && $(i).jqGrid("gridDnD", "updateDnD");
                                    $(i).triggerHandler("jqGridGridComplete");
                                    $.isFunction(i.p.gridComplete) && i.p.gridComplete.call(i);
                                    $(i).triggerHandler("jqGridAfterGridComplete")
                                },
                                x = function () {
                                    i.grid.hDiv.loading = !0;
                                    if (!i.p.hiddengrid) switch (i.p.loadui) {
                                        case "disable":
                                            break;
                                        case "enable":
                                            $("#load_" + $.jgrid.jqID(i.p.id)).show();
                                            break;
                                        case "block":
                                            $("#lui_" + $.jgrid.jqID(i.p.id)).show();
                                            $("#load_" + $.jgrid.jqID(i.p.id)).show()
                                    }
                                },
                                j = function () {
                                    i.grid.hDiv.loading = !1;
                                    switch (i.p.loadui) {
                                        case "disable":
                                            break;
                                        case "enable":
                                            $("#load_" + $.jgrid.jqID(i.p.id)).hide();
                                            break;
                                        case "block":
                                            $("#lui_" + $.jgrid.jqID(i.p.id)).hide();
                                            $("#load_" + $.jgrid.jqID(i.p.id)).hide()
                                    }
                                },
                                I = function (e) {
                                    if (!i.grid.hDiv.loading) {
                                        var t, r, a = i.p.scroll && e === !1,
                                            s = {},
                                            n = i.p.prmNames;
                                        i.p.page <= 0 && (i.p.page = Math.min(1, i.p.lastpage));
                                        null !== n.search && (s[n.search] = i.p.search);
                                        null !== n.nd && (s[n.nd] = (new Date).getTime());
                                        null !== n.rows && (s[n.rows] = i.p.rowNum);
                                        null !== n.page && (s[n.page] = i.p.page);
                                        null !== n.sort && (s[n.sort] = i.p.sortname);
                                        null !== n.order && (s[n.order] = i.p.sortorder);
                                        null !== i.p.rowTotal && null !== n.totalrows && (s[n.totalrows] = i.p.rowTotal);
                                        var o = $.isFunction(i.p.loadComplete),
                                            l = o ? i.p.loadComplete : null,
                                            d = 0;
                                        e = e || 1;
                                        if (e > 1) if (null !== n.npage) {
                                            s[n.npage] = e;
                                            d = e - 1;
                                            e = 1
                                        } else l = function (t) {
                                            i.p.page++;
                                            i.grid.hDiv.loading = !1;
                                            o && i.p.loadComplete.call(i, t);
                                            I(e - 1)
                                        };
                                        else null !== n.npage && delete i.p.postData[n.npage];
                                        if (i.p.grouping) {
                                            $(i).jqGrid("groupingSetup");
                                            var c, u = i.p.groupingView,
                                                p = "";
                                            for (c = 0; c < u.groupField.length; c++) {
                                                var h = u.groupField[c];
                                                $.each(i.p.colModel, function (e, t) {
                                                    t.name === h && t.index && (h = t.index)
                                                });
                                                p += h + " " + u.groupOrder[c] + ", "
                                            }
                                            s[n.sort] = p + s[n.sort]
                                        }
                                        $.extend(i.p.postData, s);
                                        var f = i.p.scroll ? i.rows.length - 1 : 1,
                                            g = $(i).triggerHandler("jqGridBeforeRequest");
                                        if (g === !1 || "stop" === g) return;
                                        if ($.isFunction(i.p.datatype)) {
                                            i.p.datatype.call(i, i.p.postData, "load_" + i.p.id, f, e, d);
                                            return
                                        }
                                        if ($.isFunction(i.p.beforeRequest)) {
                                            g = i.p.beforeRequest.call(i);
                                            void 0 === g && (g = !0);
                                            if (g === !1) return
                                        }
                                        t = i.p.datatype.toLowerCase();
                                        switch (t) {
                                            case "json":
                                            case "jsonp":
                                            case "xml":
                                            case "script":
                                                $.ajax($.extend({
                                                    url: i.p.url,
                                                    type: i.p.mtype,
                                                    dataType: t,
                                                    data: $.isFunction(i.p.serializeGridData) ? i.p.serializeGridData.call(i, i.p.postData) : i.p.postData,
                                                    success: function (r, s, n) {
                                                        if ($.isFunction(i.p.beforeProcessing) && i.p.beforeProcessing.call(i, r, s, n) === !1) j();
                                                        else {
                                                            "xml" === t ? N(r, i.grid.bDiv, f, e > 1, d) : D(r, i.grid.bDiv, f, e > 1, d);
                                                            $(i).triggerHandler("jqGridLoadComplete", [r]);
                                                            l && l.call(i, r);
                                                            $(i).triggerHandler("jqGridAfterLoadComplete", [r]);
                                                            a && i.grid.populateVisible();
                                                            (i.p.loadonce || i.p.treeGrid) && (i.p.datatype = "local");
                                                            r = null;
                                                            1 === e && j()
                                                        }
                                                    },
                                                    error: function (t, r, a) {
                                                        $.isFunction(i.p.loadError) && i.p.loadError.call(i, t, r, a);
                                                        1 === e && j();
                                                        t = null
                                                    },
                                                    beforeSend: function (e, t) {
                                                        var r = !0;
                                                        $.isFunction(i.p.loadBeforeSend) && (r = i.p.loadBeforeSend.call(i, e, t));
                                                        void 0 === r && (r = !0);
                                                        if (r === !1) return !1;
                                                        x();
                                                        return void 0
                                                    }
                                                }, $.jgrid.ajaxOptions, i.p.ajaxGridOptions));
                                                break;
                                            case "xmlstring":
                                                x();
                                                r = "string" != typeof i.p.datastr ? i.p.datastr : $.parseXML(i.p.datastr);
                                                N(r, i.grid.bDiv);
                                                $(i).triggerHandler("jqGridLoadComplete", [r]);
                                                o && i.p.loadComplete.call(i, r);
                                                $(i).triggerHandler("jqGridAfterLoadComplete", [r]);
                                                i.p.datatype = "local";
                                                i.p.datastr = null;
                                                j();
                                                break;
                                            case "jsonstring":
                                                x();
                                                r = "string" == typeof i.p.datastr ? $.jgrid.parse(i.p.datastr) : i.p.datastr;
                                                D(r, i.grid.bDiv);
                                                $(i).triggerHandler("jqGridLoadComplete", [r]);
                                                o && i.p.loadComplete.call(i, r);
                                                $(i).triggerHandler("jqGridAfterLoadComplete", [r]);
                                                i.p.datatype = "local";
                                                i.p.datastr = null;
                                                j();
                                                break;
                                            case "local":
                                            case "clientside":
                                                x();
                                                i.p.datatype = "local";
                                                var m = k();
                                                D(m, i.grid.bDiv, f, e > 1, d);
                                                $(i).triggerHandler("jqGridLoadComplete", [m]);
                                                l && l.call(i, m);
                                                $(i).triggerHandler("jqGridAfterLoadComplete", [m]);
                                                a && i.grid.populateVisible();
                                                j()
                                        }
                                    }
                                },
                                T = function (e) {
                                    $("#cb_" + $.jgrid.jqID(i.p.id), i.grid.hDiv)[i.p.useProp ? "prop" : "attr"]("checked", e);
                                    var t = i.p.frozenColumns ? i.p.id + "_frozen" : "";
                                    t && $("#cb_" + $.jgrid.jqID(i.p.id), i.grid.fhDiv)[i.p.useProp ? "prop" : "attr"]("checked", e)
                                },
                                S = function (e, t) {
                                    var r, a, n, o, l, d, u, p = "<td class='ui-pg-button ui-state-disabled' style='width:4px;'><span class='ui-separator'></span></td>",
                                        h = "",
                                        f = "<table cellspacing='0' cellpadding='0' border='0' style='table-layout:auto;' class='ui-pg-table'><tbody><tr>",
                                        g = "",
                                        m = function (e) {
                                            var t;
                                            $.isFunction(i.p.onPaging) && (t = i.p.onPaging.call(i, e));
                                            if ("stop" === t) return !1;
                                            i.p.selrow = null;
                                            if (i.p.multiselect) {
                                                i.p.selarrrow = [];
                                                T(!1)
                                            }
                                            i.p.savedRow = [];
                                            return !0
                                        };
                                    e = e.substr(1);
                                    t += "_" + e;
                                    r = "pg_" + e;
                                    a = e + "_left";
                                    n = e + "_center";
                                    o = e + "_right";
                                    $("#" + $.jgrid.jqID(e)).append("<div id='" + r + "' class='ui-pager-control' role='group'><table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table' style='width:100%;table-layout:fixed;height:100%;' role='row'><tbody><tr><td id='" + a + "' align='left'></td><td id='" + n + "' align='center' style='white-space:pre;'></td><td id='" + o + "' align='right'></td></tr></tbody></table></div>").attr("dir", "ltr");
                                    if (i.p.rowList.length > 0) {
                                        g = "<td dir='" + s + "'>";
                                        g += "<select class='ui-pg-selbox' role='listbox'>";
                                        var v;
                                        for (u = 0; u < i.p.rowList.length; u++) {
                                            v = i.p.rowList[u].toString().split(":");
                                            1 === v.length && (v[1] = v[0]);
                                            g += '<option role="option" value="' + v[0] + '"' + (c(i.p.rowNum, 0) === c(v[0], 0) ? ' selected="selected"' : "") + ">" + v[1] + "</option>"
                                        }
                                        g += "</select></td>"
                                    }
                                    "rtl" === s && (f += g);
                                    i.p.pginput === !0 && (h = "<td dir='" + s + "'>" + $.jgrid.format(i.p.pgtext || "", "<input class='ui-pg-input' type='text' size='2' maxlength='7' value='0' role='textbox'/>", "<span id='sp_1_" + $.jgrid.jqID(e) + "'></span>") + "</td>");
                                    if (i.p.pgbuttons === !0) {
                                        var b = ["first" + t, "prev" + t, "next" + t, "last" + t];
                                        "rtl" === s && b.reverse();
                                        f += "<td id='" + b[0] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-first'></span></td>";
                                        f += "<td id='" + b[1] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-prev'></span></td>";
                                        f += "" !== h ? p + h + p : "";
                                        f += "<td id='" + b[2] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-next'></span></td>";
                                        f += "<td id='" + b[3] + "' class='ui-pg-button ui-corner-all'><span class='ui-icon ui-icon-seek-end'></span></td>"
                                    } else "" !== h && (f += h);
                                    "ltr" === s && (f += g);
                                    f += "</tr></tbody></table>";
                                    i.p.viewrecords === !0 && $("td#" + e + "_" + i.p.recordpos, "#" + r).append("<div dir='" + s + "' style='text-align:" + i.p.recordpos + "' class='ui-paging-info'></div>");
                                    $("td#" + e + "_" + i.p.pagerpos, "#" + r).append(f);
                                    d = $(".ui-jqgrid").css("font-size") || "11px";
                                    $(document.body).append("<div id='testpg' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:" + d + ";visibility:hidden;' ></div>");
                                    l = $(f).clone().appendTo("#testpg").width();
                                    $("#testpg").remove();
                                    if (l > 0) {
                                        "" !== h && (l += 50);
                                        $("td#" + e + "_" + i.p.pagerpos, "#" + r).width(l)
                                    }
                                    i.p._nvtd = [];
                                    i.p._nvtd[0] = Math.floor(l ? (i.p.width - l) / 2 : i.p.width / 3);
                                    i.p._nvtd[1] = 0;
                                    f = null;
                                    $(".ui-pg-selbox", "#" + r).bind("change", function () {
                                        if (!m("records")) return !1;
                                        i.p.page = Math.round(i.p.rowNum * (i.p.page - 1) / this.value - .5) + 1;
                                        i.p.rowNum = this.value;
                                        i.p.pager && $(".ui-pg-selbox", i.p.pager).val(this.value);
                                        i.p.toppager && $(".ui-pg-selbox", i.p.toppager).val(this.value);
                                        I();
                                        return !1
                                    });
                                    if (i.p.pgbuttons === !0) {
                                        $(".ui-pg-button", "#" + r).hover(function () {
                                            if ($(this).hasClass("ui-state-disabled")) this.style.cursor = "default";
                                            else {
                                                $(this).addClass("ui-state-hover");
                                                this.style.cursor = "pointer"
                                            }
                                        }, function () {
                                            if (!$(this).hasClass("ui-state-disabled")) {
                                                $(this).removeClass("ui-state-hover");
                                                this.style.cursor = "default"
                                            }
                                        });
                                        $("#first" + $.jgrid.jqID(t) + ", #prev" + $.jgrid.jqID(t) + ", #next" + $.jgrid.jqID(t) + ", #last" + $.jgrid.jqID(t)).click(function () {
                                            if ($(this).hasClass("ui-state-disabled")) return !1;
                                            var e = c(i.p.page, 1),
                                                r = c(i.p.lastpage, 1),
                                                a = !1,
                                                s = !0,
                                                n = !0,
                                                o = !0,
                                                l = !0;
                                            if (0 === r || 1 === r) {
                                                s = !1;
                                                n = !1;
                                                o = !1;
                                                l = !1
                                            } else if (r > 1 && e >= 1) {
                                                if (1 === e) {
                                                    s = !1;
                                                    n = !1
                                                } else if (e === r) {
                                                    o = !1;
                                                    l = !1
                                                }
                                            } else if (r > 1 && 0 === e) {
                                                o = !1;
                                                l = !1;
                                                e = r - 1
                                            }
                                            if (!m(this.id)) return !1;
                                            if (this.id === "first" + t && s) {
                                                i.p.page = 1;
                                                a = !0
                                            }
                                            if (this.id === "prev" + t && n) {
                                                i.p.page = e - 1;
                                                a = !0
                                            }
                                            if (this.id === "next" + t && o) {
                                                i.p.page = e + 1;
                                                a = !0
                                            }
                                            if (this.id === "last" + t && l) {
                                                i.p.page = r;
                                                a = !0
                                            }
                                            a && I();
                                            return !1
                                        })
                                    }
                                    i.p.pginput === !0 && $("input.ui-pg-input", "#" + r).keypress(function (e) {
                                        var t = e.charCode || e.keyCode || 0;
                                        if (13 === t) {
                                            if (!m("user")) return !1;
                                            $(this).val(c($(this).val(), 1));
                                            i.p.page = $(this).val() > 0 ? $(this).val() : i.p.page;
                                            I();
                                            return !1
                                        }
                                        return this
                                    })
                                },
                                E = function (e, t) {
                                    var r, a, s = "",
                                        n = i.p.colModel,
                                        o = !1,
                                        l = i.p.frozenColumns ? t : i.grid.headers[e].el,
                                        d = "";
                                    $("span.ui-grid-ico-sort", l).addClass("ui-state-disabled");
                                    $(l).attr("aria-selected", "false");
                                    if (n[e].lso) if ("asc" === n[e].lso) {
                                        n[e].lso += "-desc";
                                        d = "desc"
                                    } else if ("desc" === n[e].lso) {
                                        n[e].lso += "-asc";
                                        d = "asc"
                                    } else("asc-desc" === n[e].lso || "desc-asc" === n[e].lso) && (n[e].lso = "");
                                    else n[e].lso = d = n[e].firstsortorder || "asc";
                                    if (d) {
                                        $("span.s-ico", l).show();
                                        $("span.ui-icon-" + d, l).removeClass("ui-state-disabled");
                                        $(l).attr("aria-selected", "true")
                                    } else i.p.viewsortcols[0] || $("span.s-ico", l).hide();
                                    i.p.sortorder = "";
                                    $.each(n, function (e) {
                                        if (this.lso) {
                                            e > 0 && o && (s += ", ");
                                            r = this.lso.split("-");
                                            s += n[e].index || n[e].name;
                                            s += " " + r[r.length - 1];
                                            o = !0;
                                            i.p.sortorder = r[r.length - 1]
                                        }
                                    });
                                    a = s.lastIndexOf(i.p.sortorder);
                                    s = s.substring(0, a);
                                    i.p.sortname = s
                                },
                                F = function (e, t, r, a, s) {
                                    if (i.p.colModel[t].sortable && !(i.p.savedRow.length > 0)) {
                                        if (!r) {
                                            i.p.lastsort === t ? "asc" === i.p.sortorder ? i.p.sortorder = "desc" : "desc" === i.p.sortorder && (i.p.sortorder = "asc") : i.p.sortorder = i.p.colModel[t].firstsortorder || "asc";
                                            i.p.page = 1
                                        }
                                        if (i.p.multiSort) E(t, s);
                                        else {
                                            if (a) {
                                                if (i.p.lastsort === t && i.p.sortorder === a && !r) return;
                                                i.p.sortorder = a
                                            }
                                            var n = i.grid.headers[i.p.lastsort].el,
                                                o = i.p.frozenColumns ? s : i.grid.headers[t].el;
                                            $("span.ui-grid-ico-sort", n).addClass("ui-state-disabled");
                                            $(n).attr("aria-selected", "false");
                                            if (i.p.frozenColumns) {
                                                i.grid.fhDiv.find("span.ui-grid-ico-sort").addClass("ui-state-disabled");
                                                i.grid.fhDiv.find("th").attr("aria-selected", "false")
                                            }
                                            $("span.ui-icon-" + i.p.sortorder, o).removeClass("ui-state-disabled");
                                            $(o).attr("aria-selected", "true");
                                            if (!i.p.viewsortcols[0] && i.p.lastsort !== t) {
                                                i.p.frozenColumns && i.grid.fhDiv.find("span.s-ico").hide();
                                                $("span.s-ico", n).hide();
                                                $("span.s-ico", o).show()
                                            }
                                            e = e.substring(5 + i.p.id.length + 1);
                                            i.p.sortname = i.p.colModel[t].index || e
                                        }
                                        if ("stop" !== $(i).triggerHandler("jqGridSortCol", [i.p.sortname, t, i.p.sortorder])) if ($.isFunction(i.p.onSortCol) && "stop" === i.p.onSortCol.call(i, i.p.sortname, t, i.p.sortorder)) i.p.lastsort = t;
                                        else {
                                            if ("local" === i.p.datatype) i.p.deselectAfterSort && $(i).jqGrid("resetSelection");
                                            else {
                                                i.p.selrow = null;
                                                i.p.multiselect && T(!1);
                                                i.p.selarrrow = [];
                                                i.p.savedRow = []
                                            }
                                            if (i.p.scroll) {
                                                var l = i.grid.bDiv.scrollLeft;
                                                w.call(i, !0, !1);
                                                i.grid.hDiv.scrollLeft = l
                                            }
                                            i.p.subGrid && "local" === i.p.datatype && $("td.sgexpanded", "#" + $.jgrid.jqID(i.p.id)).each(function () {
                                                $(this).trigger("click")
                                            });
                                            I();
                                            i.p.lastsort = t;
                                            i.p.sortname !== e && t && (i.p.lastsort = t)
                                        } else i.p.lastsort = t
                                    }
                                },
                                R = function () {
                                    var e, t, a, s, n = 0,
                                        o = $.jgrid.cell_width ? 0 : c(i.p.cellLayout, 0),
                                        l = 0,
                                        d = c(i.p.scrollOffset, 0),
                                        u = !1,
                                        p = 0;
                                    $.each(i.p.colModel, function () {
                                        void 0 === this.hidden && (this.hidden = !1);
                                        if (i.p.grouping && i.p.autowidth) {
                                            var e = $.inArray(this.name, i.p.groupingView.groupField);
                                            e >= 0 && i.p.groupingView.groupColumnShow.length > e && (this.hidden = !i.p.groupingView.groupColumnShow[e])
                                        }
                                        this.widthOrg = t = c(this.width, 0);
                                        if (this.hidden === !1) {
                                            n += t + o;
                                            this.fixed ? p += t + o : l++
                                        }
                                    });
                                    isNaN(i.p.width) && (i.p.width = n + (i.p.shrinkToFit !== !1 || isNaN(i.p.height) ? 0 : d));
                                    r.width = i.p.width;
                                    i.p.tblwidth = n;
                                    i.p.shrinkToFit === !1 && i.p.forceFit === !0 && (i.p.forceFit = !1);
                                    if (i.p.shrinkToFit === !0 && l > 0) {
                                        a = r.width - o * l - p;
                                        if (!isNaN(i.p.height)) {
                                            a -= d;
                                            u = !0
                                        }
                                        n = 0;
                                        $.each(i.p.colModel, function (r) {
                                            if (this.hidden === !1 && !this.fixed) {
                                                t = Math.round(a * this.width / (i.p.tblwidth - o * l - p));
                                                this.width = t;
                                                n += t;
                                                e = r
                                            }
                                        });
                                        s = 0;
                                        u ? r.width - p - (n + o * l) !== d && (s = r.width - p - (n + o * l) - d) : u || 1 === Math.abs(r.width - p - (n + o * l)) || (s = r.width - p - (n + o * l));
                                        i.p.colModel[e].width += s;
                                        i.p.tblwidth = n + s + o * l + p;
                                        if (i.p.tblwidth > i.p.width) {
                                            i.p.colModel[e].width -= i.p.tblwidth - parseInt(i.p.width, 10);
                                            i.p.tblwidth = i.p.width
                                        }
                                    }
                                },
                                q = function (e) {
                                    var t, r = e,
                                        a = e;
                                    for (t = e + 1; t < i.p.colModel.length; t++) if (i.p.colModel[t].hidden !== !0) {
                                        a = t;
                                        break
                                    }
                                    return a - r
                                },
                                P = function (e) {
                                    var t = $(i.grid.headers[e].el),
                                        r = [t.position().left + t.outerWidth()];
                                    "rtl" === i.p.direction && (r[0] = i.p.width - r[0]);
                                    r[0] -= i.grid.bDiv.scrollLeft;
                                    r.push($(i.grid.hDiv).position().top);
                                    r.push($(i.grid.bDiv).offset().top - $(i.grid.hDiv).offset().top + $(i.grid.bDiv).height());
                                    return r
                                },
                                A = function (e) {
                                    var t, r = i.grid.headers,
                                        a = $.jgrid.getCellIndex(e);
                                    for (t = 0; t < r.length; t++) if (e === r[t].el) {
                                        a = t;
                                        break
                                    }
                                    return a
                                };
                            this.p.id = this.id; - 1 === $.inArray(i.p.multikey, d) && (i.p.multikey = !1);
                            i.p.keyName = !1;
                            for (a = 0; a < i.p.colModel.length; a++) {
                                i.p.colModel[a] = $.extend(!0, {}, i.p.cmTemplate, i.p.colModel[a].template || {}, i.p.colModel[a]);
                                i.p.keyName === !1 && i.p.colModel[a].key === !0 && (i.p.keyName = i.p.colModel[a].name)
                            }
                            i.p.sortorder = i.p.sortorder.toLowerCase();
                            $.jgrid.cell_width = $.jgrid.cellWidth();
                            if (i.p.grouping === !0) {
                                i.p.scroll = !1;
                                i.p.rownumbers = !1;
                                i.p.treeGrid = !1;
                                i.p.gridview = !0
                            }
                            if (this.p.treeGrid === !0) {
                                try {
                                    $(this).jqGrid("setTreeGrid")
                                } catch (L) {}
                                "local" !== i.p.datatype && (i.p.localReader = {
                                    id: "_id_"
                                })
                            }
                            if (this.p.subGrid) try {
                                $(i).jqGrid("setSubGrid")
                            } catch (M) {}
                            if (this.p.multiselect) {
                                this.p.colNames.unshift("<input role='checkbox' id='cb_" + this.p.id + "' class='cbox' type='checkbox'/>");
                                this.p.colModel.unshift({
                                    name: "cb",
                                    width: $.jgrid.cell_width ? i.p.multiselectWidth + i.p.cellLayout : i.p.multiselectWidth,
                                    sortable: !1,
                                    resizable: !1,
                                    hidedlg: !0,
                                    search: !1,
                                    align: "center",
                                    fixed: !0
                                })
                            }
                            if (this.p.rownumbers) {
                                this.p.colNames.unshift("");
                                this.p.colModel.unshift({
                                    name: "rn",
                                    width: i.p.rownumWidth,
                                    sortable: !1,
                                    resizable: !1,
                                    hidedlg: !0,
                                    search: !1,
                                    align: "center",
                                    fixed: !0
                                })
                            }
                            i.p.xmlReader = $.extend(!0, {
                                root: "rows",
                                row: "row",
                                page: "rows>page",
                                total: "rows>total",
                                records: "rows>records",
                                repeatitems: !0,
                                cell: "cell",
                                id: "[id]",
                                userdata: "userdata",
                                subgrid: {
                                    root: "rows",
                                    row: "row",
                                    repeatitems: !0,
                                    cell: "cell"
                                }
                            }, i.p.xmlReader);
                            i.p.jsonReader = $.extend(!0, {
                                root: "rows",
                                page: "page",
                                total: "total",
                                records: "records",
                                repeatitems: !0,
                                cell: "cell",
                                id: "id",
                                userdata: "userdata",
                                subgrid: {
                                    root: "rows",
                                    repeatitems: !0,
                                    cell: "cell"
                                }
                            }, i.p.jsonReader);
                            i.p.localReader = $.extend(!0, {
                                root: "rows",
                                page: "page",
                                total: "total",
                                records: "records",
                                repeatitems: !1,
                                cell: "cell",
                                id: "id",
                                userdata: "userdata",
                                subgrid: {
                                    root: "rows",
                                    repeatitems: !0,
                                    cell: "cell"
                                }
                            }, i.p.localReader);
                            if (i.p.scroll) {
                                i.p.pgbuttons = !1;
                                i.p.pginput = !1;
                                i.p.rowList = []
                            }
                            i.p.data.length && y();
                            var O, G, H, z, B, W, Y, U, V, K = "<thead><tr class='ui-jqgrid-labels' role='rowheader'>",
                                X = "",
                                Q = "",
                                Z = [],
                                J = [],
                                et = [];
                            if (i.p.shrinkToFit === !0 && i.p.forceFit === !0) for (a = i.p.colModel.length - 1; a >= 0; a--) if (!i.p.colModel[a].hidden) {
                                i.p.colModel[a].resizable = !1;
                                break
                            }
                            if ("horizontal" === i.p.viewsortcols[1]) {
                                X = " ui-i-asc";
                                Q = " ui-i-desc"
                            }
                            O = o ? "class='ui-th-div-ie'" : "";
                            V = "<span class='s-ico' style='display:none'><span sort='asc' class='ui-grid-ico-sort ui-icon-asc" + X + " ui-state-disabled ui-icon ui-icon-triangle-1-n ui-sort-" + s + "'></span>";
                            V += "<span sort='desc' class='ui-grid-ico-sort ui-icon-desc" + Q + " ui-state-disabled ui-icon ui-icon-triangle-1-s ui-sort-" + s + "'></span></span>";
                            if (i.p.multiSort) {
                                Z = i.p.sortname.split(",");
                                for (a = 0; a < Z.length; a++) {
                                    et = $.trim(Z[a]).split(" ");
                                    Z[a] = $.trim(et[0]);
                                    J[a] = et[1] ? $.trim(et[1]) : i.p.sortorder || "asc"
                                }
                            }
                            for (a = 0; a < this.p.colNames.length; a++) {
                                var tt = i.p.headertitles ? ' title="' + $.jgrid.stripHtml(i.p.colNames[a]) + '"' : "";
                                K += "<th id='" + i.p.id + "_" + i.p.colModel[a].name + "' role='columnheader' class='ui-state-default ui-th-column ui-th-" + s + "'" + tt + ">";
                                G = i.p.colModel[a].index || i.p.colModel[a].name;
                                K += "<div id='jqgh_" + i.p.id + "_" + i.p.colModel[a].name + "' " + O + ">" + i.p.colNames[a];
                                i.p.colModel[a].width = i.p.colModel[a].width ? parseInt(i.p.colModel[a].width, 10) : 150;
                                "boolean" != typeof i.p.colModel[a].title && (i.p.colModel[a].title = !0);
                                i.p.colModel[a].lso = "";
                                G === i.p.sortname && (i.p.lastsort = a);
                                if (i.p.multiSort) {
                                    et = $.inArray(G, Z); - 1 !== et && (i.p.colModel[a].lso = J[et])
                                }
                                K += V + "</div></th>"
                            }
                            K += "</tr></thead>";
                            V = null;
                            $(this).append(K);
                            $("thead tr:first th", this).hover(function () {
                                $(this).addClass("ui-state-hover")
                            }, function () {
                                $(this).removeClass("ui-state-hover")
                            });
                            if (this.p.multiselect) {
                                var it, rt = [];
                                $("#cb_" + $.jgrid.jqID(i.p.id), this).bind("click", function () {
                                    i.p.selarrrow = [];
                                    var e = i.p.frozenColumns === !0 ? i.p.id + "_frozen" : "";
                                    if (this.checked) {
                                        $(i.rows).each(function (t) {
                                            if (t > 0 && !($(this).hasClass("ui-subgrid") || $(this).hasClass("jqgroup") || $(this).hasClass("ui-state-disabled") || $(this).hasClass("jqfoot"))) {
                                                $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + $.jgrid.jqID(this.id))[i.p.useProp ? "prop" : "attr"]("checked", !0);
                                                $(this).addClass("ui-state-highlight").attr("aria-selected", "true");
                                                i.p.selarrrow.push(this.id);
                                                i.p.selrow = this.id;
                                                if (e) {
                                                    $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + $.jgrid.jqID(this.id), i.grid.fbDiv)[i.p.useProp ? "prop" : "attr"]("checked", !0);
                                                    $("#" + $.jgrid.jqID(this.id), i.grid.fbDiv).addClass("ui-state-highlight")
                                                }
                                            }
                                        });
                                        it = !0;
                                        rt = []
                                    } else {
                                        $(i.rows).each(function (t) {
                                            if (t > 0 && !($(this).hasClass("ui-subgrid") || $(this).hasClass("jqgroup") || $(this).hasClass("ui-state-disabled") || $(this).hasClass("jqfoot"))) {
                                                $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + $.jgrid.jqID(this.id))[i.p.useProp ? "prop" : "attr"]("checked", !1);
                                                $(this).removeClass("ui-state-highlight").attr("aria-selected", "false");
                                                rt.push(this.id);
                                                if (e) {
                                                    $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + $.jgrid.jqID(this.id), i.grid.fbDiv)[i.p.useProp ? "prop" : "attr"]("checked", !1);
                                                    $("#" + $.jgrid.jqID(this.id), i.grid.fbDiv).removeClass("ui-state-highlight")
                                                }
                                            }
                                        });
                                        i.p.selrow = null;
                                        it = !1
                                    }
                                    $(i).triggerHandler("jqGridSelectAll", [it ? i.p.selarrrow : rt, it]);
                                    $.isFunction(i.p.onSelectAll) && i.p.onSelectAll.call(i, it ? i.p.selarrrow : rt, it)
                                })
                            }
                            if (i.p.autowidth === !0) {
                                var at = $(l).innerWidth();
                                i.p.width = at > 0 ? at : "nw"
                            }
                            R();
                            $(l).css("width", r.width + "px").append("<div class='ui-jqgrid-resize-mark' id='rs_m" + i.p.id + "'>&#160;</div>");
                            $(n).css("width", r.width + "px");
                            K = $("thead:first", i).get(0);
                            var st = "";
                            i.p.footerrow && (st += "<table role='grid' style='width:" + i.p.tblwidth + "px' class='ui-jqgrid-ftable' cellspacing='0' cellpadding='0' border='0'><tbody><tr role='row' class='ui-widget-content footrow footrow-" + s + "'>");
                            var nt = $("tr:first", K),
                                ot = "<tr class='jqgfirstrow' role='row' style='height:auto'>";
                            i.p.disableClick = !1;
                            $("th", nt).each(function (e) {
                                H = i.p.colModel[e].width;
                                void 0 === i.p.colModel[e].resizable && (i.p.colModel[e].resizable = !0);
                                if (i.p.colModel[e].resizable) {
                                    z = document.createElement("span");
                                    $(z).html("&#160;").addClass("ui-jqgrid-resize ui-jqgrid-resize-" + s).css("cursor", "col-resize");
                                    $(this).addClass(i.p.resizeclass)
                                } else z = "";
                                $(this).css("width", H + "px").prepend(z);
                                z = null;
                                var t = "";
                                if (i.p.colModel[e].hidden) {
                                    $(this).css("display", "none");
                                    t = "display:none;"
                                }
                                ot += "<td role='gridcell' style='height:0px;width:" + H + "px;" + t + "'></td>";
                                r.headers[e] = {
                                    width: H,
                                    el: this
                                };
                                B = i.p.colModel[e].sortable;
                                if ("boolean" != typeof B) {
                                    i.p.colModel[e].sortable = !0;
                                    B = !0
                                }
                                var a = i.p.colModel[e].name;
                                "cb" !== a && "subgrid" !== a && "rn" !== a && i.p.viewsortcols[2] && $(">div", this).addClass("ui-jqgrid-sortable");
                                if (B) if (i.p.multiSort) {
                                    if (i.p.viewsortcols[0]) {
                                        $("div span.s-ico", this).show();
                                        i.p.colModel[e].lso && $("div span.ui-icon-" + i.p.colModel[e].lso, this).removeClass("ui-state-disabled")
                                    } else if (i.p.colModel[e].lso) {
                                        $("div span.s-ico", this).show();
                                        $("div span.ui-icon-" + i.p.colModel[e].lso, this).removeClass("ui-state-disabled")
                                    }
                                } else if (i.p.viewsortcols[0]) {
                                    $("div span.s-ico", this).show();
                                    e === i.p.lastsort && $("div span.ui-icon-" + i.p.sortorder, this).removeClass("ui-state-disabled")
                                } else if (e === i.p.lastsort) {
                                    $("div span.s-ico", this).show();
                                    $("div span.ui-icon-" + i.p.sortorder, this).removeClass("ui-state-disabled")
                                }
                                i.p.footerrow && (st += "<td role='gridcell' " + u(e, 0, "", null, "", !1) + ">&#160;</td>")
                            }).mousedown(function (e) {
                                if (1 === $(e.target).closest("th>span.ui-jqgrid-resize").length) {
                                    var t = A(this);
                                    i.p.forceFit === !0 && (i.p.nv = q(t));
                                    r.dragStart(t, e, P(t));
                                    return !1
                                }
                            }).click(function (e) {
                                if (i.p.disableClick) {
                                    i.p.disableClick = !1;
                                    return !1
                                }
                                var t, r, a = "th>div.ui-jqgrid-sortable";
                                i.p.viewsortcols[2] || (a = "th>div>span>span.ui-grid-ico-sort");
                                var s = $(e.target).closest(a);
                                if (1 === s.length) {
                                    var n;
                                    if (i.p.frozenColumns) {
                                        var o = $(this)[0].id.substring(i.p.id.length + 1);
                                        $(i.p.colModel).each(function (e) {
                                            if (this.name === o) {
                                                n = e;
                                                return !1
                                            }
                                        })
                                    } else n = A(this);
                                    if (!i.p.viewsortcols[2]) {
                                        t = !0;
                                        r = s.attr("sort")
                                    }
                                    null != n && F($("div", this)[0].id, n, t, r, this);
                                    return !1
                                }
                            });
                            if (i.p.sortable && $.fn.sortable) try {
                                $(i).jqGrid("sortableColumns", nt)
                            } catch (lt) {}
                            i.p.footerrow && (st += "</tr></tbody></table>");
                            ot += "</tr>";
                            U = document.createElement("tbody");
                            this.appendChild(U);
                            $(this).addClass("ui-jqgrid-btable").append(ot);
                            ot = null;
                            var dt = $("<table class='ui-jqgrid-htable' style='width:" + i.p.tblwidth + "px' role='grid' aria-labelledby='gbox_" + this.id + "' cellspacing='0' cellpadding='0' border='0'></table>").append(K),
                                ct = i.p.caption && i.p.hiddengrid === !0 ? !0 : !1,
                                ut = $("<div class='ui-jqgrid-hbox" + ("rtl" === s ? "-rtl" : "") + "'></div>");
                            K = null;
                            r.hDiv = document.createElement("div");
                            $(r.hDiv).css({
                                width: r.width + "px"
                            }).addClass("ui-state-default ui-jqgrid-hdiv").append(ut);
                            $(ut).append(dt);
                            dt = null;
                            ct && $(r.hDiv).hide();
                            if (i.p.pager) {
                                "string" == typeof i.p.pager ? "#" !== i.p.pager.substr(0, 1) && (i.p.pager = "#" + i.p.pager) : i.p.pager = "#" + $(i.p.pager).attr("id");
                                $(i.p.pager).css({
                                    width: r.width + "px"
                                }).addClass("ui-state-default ui-jqgrid-pager ui-corner-bottom").appendTo(l);
                                ct && $(i.p.pager).hide();
                                S(i.p.pager, "")
                            }
                            i.p.cellEdit === !1 && i.p.hoverrows === !0 && $(i).bind("mouseover", function (e) {
                                Y = $(e.target).closest("tr.jqgrow");
                                "ui-subgrid" !== $(Y).attr("class") && $(Y).addClass("ui-state-hover")
                            }).bind("mouseout", function (e) {
                                Y = $(e.target).closest("tr.jqgrow");
                                $(Y).removeClass("ui-state-hover")
                            });
                            var pt, ht, ft;
                            $(i).before(r.hDiv).click(function (e) {
                                W = e.target;
                                Y = $(W, i.rows).closest("tr.jqgrow");
                                if (0 === $(Y).length || Y[0].className.indexOf("ui-state-disabled") > -1 || ($(W, i).closest("table.ui-jqgrid-btable").attr("id") || "").replace("_frozen", "") !== i.id) return this;
                                var t = $(W).hasClass("cbox"),
                                    r = $(i).triggerHandler("jqGridBeforeSelectRow", [Y[0].id, e]);
                                r = r === !1 || "stop" === r ? !1 : !0;
                                r && $.isFunction(i.p.beforeSelectRow) && (r = i.p.beforeSelectRow.call(i, Y[0].id, e));
                                if ("A" !== W.tagName && ("INPUT" !== W.tagName && "TEXTAREA" !== W.tagName && "OPTION" !== W.tagName && "SELECT" !== W.tagName || t) && r === !0) {
                                    pt = Y[0].id;
                                    ht = $.jgrid.getCellIndex(W);
                                    ft = $(W).closest("td,th").html();
                                    $(i).triggerHandler("jqGridCellSelect", [pt, ht, ft, e]);
                                    $.isFunction(i.p.onCellSelect) && i.p.onCellSelect.call(i, pt, ht, ft, e);
                                    if (i.p.cellEdit === !0) if (i.p.multiselect && t) $(i).jqGrid("setSelection", pt, !0, e);
                                    else {
                                        pt = Y[0].rowIndex;
                                        try {
                                            $(i).jqGrid("editCell", pt, ht, !0)
                                        } catch (a) {}
                                    } else if (i.p.multikey) {
                                        if (e[i.p.multikey]) $(i).jqGrid("setSelection", pt, !0, e);
                                        else if (i.p.multiselect && t) {
                                            t = $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + pt).is(":checked");
                                            $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + pt)[i.p.useProp ? "prop" : "attr"]("checked", t)
                                        }
                                    } else if (i.p.multiselect && i.p.multiboxonly) if (t) $(i).jqGrid("setSelection", pt, !0, e);
                                    else {
                                        var s = i.p.frozenColumns ? i.p.id + "_frozen" : "";
                                        $(i.p.selarrrow).each(function (e, t) {
                                            var r = $(i).jqGrid("getGridRowById", t);
                                            r && $(r).removeClass("ui-state-highlight");
                                            $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + $.jgrid.jqID(t))[i.p.useProp ? "prop" : "attr"]("checked", !1);
                                            if (s) {
                                                $("#" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(s)).removeClass("ui-state-highlight");
                                                $("#jqg_" + $.jgrid.jqID(i.p.id) + "_" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(s))[i.p.useProp ? "prop" : "attr"]("checked", !1)
                                            }
                                        });
                                        i.p.selarrrow = [];
                                        $(i).jqGrid("setSelection", pt, !0, e)
                                    } else $(i).jqGrid("setSelection", pt, !0, e)
                                }
                            }).bind("reloadGrid", function (e, t) {
                                i.p.treeGrid === !0 && (i.p.datatype = i.p.treedatatype);
                                t && t.current && i.grid.selectionPreserver(i);
                                if ("local" === i.p.datatype) {
                                    $(i).jqGrid("resetSelection");
                                    i.p.data.length && y()
                                } else if (!i.p.treeGrid) {
                                    i.p.selrow = null;
                                    if (i.p.multiselect) {
                                        i.p.selarrrow = [];
                                        T(!1)
                                    }
                                    i.p.savedRow = []
                                }
                                i.p.scroll && w.call(i, !0, !1);
                                if (t && t.page) {
                                    var r = t.page;
                                    r > i.p.lastpage && (r = i.p.lastpage);
                                    1 > r && (r = 1);
                                    i.p.page = r;
                                    i.grid.bDiv.scrollTop = i.grid.prevRowHeight ? (r - 1) * i.grid.prevRowHeight * i.p.rowNum : 0
                                }
                                if (i.grid.prevRowHeight && i.p.scroll) {
                                    delete i.p.lastpage;
                                    i.grid.populateVisible()
                                } else i.grid.populate();
                                i.p._inlinenav === !0 && $(i).jqGrid("showAddEditButtons");
                                return !1
                            }).dblclick(function (e) {
                                W = e.target;
                                Y = $(W, i.rows).closest("tr.jqgrow");
                                if (0 !== $(Y).length) {
                                    pt = Y[0].rowIndex;
                                    ht = $.jgrid.getCellIndex(W);
                                    $(i).triggerHandler("jqGridDblClickRow", [$(Y).attr("id"), pt, ht, e]);
                                    $.isFunction(i.p.ondblClickRow) && i.p.ondblClickRow.call(i, $(Y).attr("id"), pt, ht, e)
                                }
                            }).bind("contextmenu", function (e) {
                                W = e.target;
                                Y = $(W, i.rows).closest("tr.jqgrow");
                                if (0 !== $(Y).length) {
                                    i.p.multiselect || $(i).jqGrid("setSelection", Y[0].id, !0, e);
                                    pt = Y[0].rowIndex;
                                    ht = $.jgrid.getCellIndex(W);
                                    $(i).triggerHandler("jqGridRightClickRow", [$(Y).attr("id"), pt, ht, e]);
                                    $.isFunction(i.p.onRightClickRow) && i.p.onRightClickRow.call(i, $(Y).attr("id"), pt, ht, e)
                                }
                            });
                            r.bDiv = document.createElement("div");
                            o && "auto" === String(i.p.height).toLowerCase() && (i.p.height = "100%");
                            $(r.bDiv).append($('<div style="position:relative;' + (o && $.jgrid.msiever() < 8 ? "height:0.01%;" : "") + '"></div>').append("<div></div>").append(this)).addClass("ui-jqgrid-bdiv").css({
                                height: i.p.height + (isNaN(i.p.height) ? "" : "px"),
                                width: r.width + "px"
                            }).scroll(r.scrollGrid);
                            $("table:first", r.bDiv).css({
                                width: i.p.tblwidth + "px"
                            });
                            $.support.tbody || 2 === $("tbody", this).length && $("tbody:gt(0)", this).remove();
                            i.p.multikey && ($.jgrid.msie ? $(r.bDiv).bind("selectstart", function () {
                                return !1
                            }) : $(r.bDiv).bind("mousedown", function () {
                                return !1
                            }));
                            ct && $(r.bDiv).hide();
                            r.cDiv = document.createElement("div");
                            var gt = i.p.hidegrid === !0 ? $("<a role='link' class='ui-jqgrid-titlebar-close ui-corner-all HeaderButton' />").hover(function () {
                                gt.addClass("ui-state-hover")
                            }, function () {
                                gt.removeClass("ui-state-hover")
                            }).append("<span class='ui-icon ui-icon-circle-triangle-n'></span>").css("rtl" === s ? "left" : "right", "0px") : "";
                            $(r.cDiv).append(gt).append("<span class='ui-jqgrid-title'>" + i.p.caption + "</span>").addClass("ui-jqgrid-titlebar ui-jqgrid-caption" + ("rtl" === s ? "-rtl" : "") + " ui-widget-header ui-corner-top ui-helper-clearfix");
                            $(r.cDiv).insertBefore(r.hDiv);
                            if (i.p.toolbar[0]) {
                                r.uDiv = document.createElement("div");
                                "top" === i.p.toolbar[1] ? $(r.uDiv).insertBefore(r.hDiv) : "bottom" === i.p.toolbar[1] && $(r.uDiv).insertAfter(r.hDiv);
                                if ("both" === i.p.toolbar[1]) {
                                    r.ubDiv = document.createElement("div");
                                    $(r.uDiv).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id).insertBefore(r.hDiv);
                                    $(r.ubDiv).addClass("ui-userdata ui-state-default").attr("id", "tb_" + this.id).insertAfter(r.hDiv);
                                    ct && $(r.ubDiv).hide()
                                } else $(r.uDiv).width(r.width).addClass("ui-userdata ui-state-default").attr("id", "t_" + this.id);
                                ct && $(r.uDiv).hide()
                            }
                            if (i.p.toppager) {
                                i.p.toppager = $.jgrid.jqID(i.p.id) + "_toppager";
                                r.topDiv = $("<div id='" + i.p.toppager + "'></div>")[0];
                                i.p.toppager = "#" + i.p.toppager;
                                $(r.topDiv).addClass("ui-state-default ui-jqgrid-toppager").width(r.width).insertBefore(r.hDiv);
                                S(i.p.toppager, "_t")
                            }
                            if (i.p.footerrow) {
                                r.sDiv = $("<div class='ui-jqgrid-sdiv'></div>")[0];
                                ut = $("<div class='ui-jqgrid-hbox" + ("rtl" === s ? "-rtl" : "") + "'></div>");
                                $(r.sDiv).append(ut).width(r.width).insertAfter(r.hDiv);
                                $(ut).append(st);
                                r.footers = $(".ui-jqgrid-ftable", r.sDiv)[0].rows[0].cells;
                                i.p.rownumbers && (r.footers[0].className = "ui-state-default jqgrid-rownum");
                                ct && $(r.sDiv).hide()
                            }
                            ut = null;
                            if (i.p.caption) {
                                var mt = i.p.datatype;
                                if (i.p.hidegrid === !0) {
                                    $(".ui-jqgrid-titlebar-close", r.cDiv).click(function (e) {
                                        var t, a = $.isFunction(i.p.onHeaderClick),
                                            s = ".ui-jqgrid-bdiv, .ui-jqgrid-hdiv, .ui-jqgrid-pager, .ui-jqgrid-sdiv",
                                            n = this;
                                        if (i.p.toolbar[0] === !0) {
                                            "both" === i.p.toolbar[1] && (s += ", #" + $(r.ubDiv).attr("id"));
                                            s += ", #" + $(r.uDiv).attr("id")
                                        }
                                        t = $(s, "#gview_" + $.jgrid.jqID(i.p.id)).length;
                                        "visible" === i.p.gridstate ? $(s, "#gbox_" + $.jgrid.jqID(i.p.id)).slideUp("fast", function () {
                                            t--;
                                            if (0 === t) {
                                                $("span", n).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                                                i.p.gridstate = "hidden";
                                                $("#gbox_" + $.jgrid.jqID(i.p.id)).hasClass("ui-resizable") && $(".ui-resizable-handle", "#gbox_" + $.jgrid.jqID(i.p.id)).hide();
                                                $(i).triggerHandler("jqGridHeaderClick", [i.p.gridstate, e]);
                                                a && (ct || i.p.onHeaderClick.call(i, i.p.gridstate, e))
                                            }
                                        }) : "hidden" === i.p.gridstate && $(s, "#gbox_" + $.jgrid.jqID(i.p.id)).slideDown("fast", function () {
                                            t--;
                                            if (0 === t) {
                                                $("span", n).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                                                if (ct) {
                                                    i.p.datatype = mt;
                                                    I();
                                                    ct = !1
                                                }
                                                i.p.gridstate = "visible";
                                                $("#gbox_" + $.jgrid.jqID(i.p.id)).hasClass("ui-resizable") && $(".ui-resizable-handle", "#gbox_" + $.jgrid.jqID(i.p.id)).show();
                                                $(i).triggerHandler("jqGridHeaderClick", [i.p.gridstate, e]);
                                                a && (ct || i.p.onHeaderClick.call(i, i.p.gridstate, e))
                                            }
                                        });
                                        return !1
                                    });
                                    if (ct) {
                                        i.p.datatype = "local";
                                        $(".ui-jqgrid-titlebar-close", r.cDiv).trigger("click")
                                    }
                                }
                            } else {
                                $(r.cDiv).hide();
                                $(r.hDiv).addClass("ui-corner-top")
                            }
                            $(r.hDiv).after(r.bDiv).mousemove(function (e) {
                                if (r.resizing) {
                                    r.dragMove(e);
                                    return !1
                                }
                            });
                            $(".ui-jqgrid-labels", r.hDiv).bind("selectstart", function () {
                                return !1
                            });
                            $(document).bind("mouseup.jqGrid" + i.p.id, function () {
                                if (r.resizing) {
                                    r.dragEnd();
                                    return !1
                                }
                                return !0
                            });
                            i.formatCol = u;
                            i.sortData = F;
                            i.updatepager = _;
                            i.refreshIndex = y;
                            i.setHeadCheckBox = T;
                            i.constructTr = C;
                            i.formatter = function (e, t, i, r, a) {
                                return h(e, t, i, r, a)
                            };
                            $.extend(r, {
                                populate: I,
                                emptyRows: w,
                                beginReq: x,
                                endReq: j
                            });
                            this.grid = r;
                            i.addXmlData = function (e) {
                                N(e, i.grid.bDiv)
                            };
                            i.addJSONData = function (e) {
                                D(e, i.grid.bDiv)
                            };
                            this.grid.cols = this.rows[0].cells;
                            $(i).triggerHandler("jqGridInitGrid");
                            $.isFunction(i.p.onInitGrid) && i.p.onInitGrid.call(i);
                            I();
                            i.p.hiddengrid = !1
                        } else alert($.jgrid.errors.model)
                    } else alert("Element is not a table or has no id!")
                }
            })
        };
        $.jgrid.extend({
            getGridParam: function (e) {
                var t = this[0];
                return t && t.grid ? e ? void 0 !== t.p[e] ? t.p[e] : null : t.p : void 0
            },
            setGridParam: function (e, t) {
                return this.each(function () {
                    null == t && (t = !1);
                    if (this.grid && "object" == typeof e) if (t === !0) {
                        var i = $.extend({}, this.p, e);
                        this.p = i
                    } else $.extend(!0, this.p, e)
                })
            },
            getGridRowById: function (e) {
                var t;
                this.each(function () {
                    try {
                        for (var i = this.rows.length; i--;) if (e.toString() === this.rows[i].id) {
                            t = this.rows[i];
                            break
                        }
                    } catch (r) {
                        t = $(this.grid.bDiv).find("#" + $.jgrid.jqID(e))
                    }
                });
                return t
            },
            getDataIDs: function () {
                var e, t = [],
                    i = 0,
                    r = 0;
                this.each(function () {
                    e = this.rows.length;
                    if (e && e > 0) for (; e > i;) {
                        if ($(this.rows[i]).hasClass("jqgrow")) {
                            t[r] = this.rows[i].id;
                            r++
                        }
                        i++
                    }
                });
                return t
            },
            setSelection: function (e, t, i) {
                return this.each(function () {
                    function r(e) {
                        var t = $(u.grid.bDiv)[0].clientHeight,
                            i = $(u.grid.bDiv)[0].scrollTop,
                            r = $(u.rows[e]).position().top,
                            a = u.rows[e].clientHeight;
                        r + a >= t + i ? $(u.grid.bDiv)[0].scrollTop = r - (t + i) + a + i : t + i > r && i > r && ($(u.grid.bDiv)[0].scrollTop = r)
                    }
                    var a, s, n, o, l, d, c, u = this;
                    if (void 0 !== e) {
                        t = t === !1 ? !1 : !0;
                        s = $(u).jqGrid("getGridRowById", e);
                        if (s && s.className && !(s.className.indexOf("ui-state-disabled") > -1)) {
                            if (u.p.scrollrows === !0) {
                                n = $(u).jqGrid("getGridRowById", e).rowIndex;
                                n >= 0 && r(n)
                            }
                            u.p.frozenColumns === !0 && (d = u.p.id + "_frozen");
                            if (u.p.multiselect) {
                                u.setHeadCheckBox(!1);
                                u.p.selrow = s.id;
                                o = $.inArray(u.p.selrow, u.p.selarrrow);
                                if (-1 === o) {
                                    "ui-subgrid" !== s.className && $(s).addClass("ui-state-highlight").attr("aria-selected", "true");
                                    a = !0;
                                    u.p.selarrrow.push(u.p.selrow)
                                } else {
                                    "ui-subgrid" !== s.className && $(s).removeClass("ui-state-highlight").attr("aria-selected", "false");
                                    a = !1;
                                    u.p.selarrrow.splice(o, 1);
                                    l = u.p.selarrrow[0];
                                    u.p.selrow = void 0 === l ? null : l
                                }
                                $("#jqg_" + $.jgrid.jqID(u.p.id) + "_" + $.jgrid.jqID(s.id))[u.p.useProp ? "prop" : "attr"]("checked", a);
                                if (d) {
                                    -1 === o ? $("#" + $.jgrid.jqID(e), "#" + $.jgrid.jqID(d)).addClass("ui-state-highlight") : $("#" + $.jgrid.jqID(e), "#" + $.jgrid.jqID(d)).removeClass("ui-state-highlight");
                                    $("#jqg_" + $.jgrid.jqID(u.p.id) + "_" + $.jgrid.jqID(e), "#" + $.jgrid.jqID(d))[u.p.useProp ? "prop" : "attr"]("checked", a)
                                }
                                if (t) {
                                    $(u).triggerHandler("jqGridSelectRow", [s.id, a, i]);
                                    u.p.onSelectRow && u.p.onSelectRow.call(u, s.id, a, i)
                                }
                            } else if ("ui-subgrid" !== s.className) {
                                if (u.p.selrow !== s.id) {
                                    c = $(u).jqGrid("getGridRowById", u.p.selrow);
                                    c && $(c).removeClass("ui-state-highlight").attr({
                                        "aria-selected": "false",
                                        tabindex: "-1"
                                    });
                                    $(s).addClass("ui-state-highlight").attr({
                                        "aria-selected": "true",
                                        tabindex: "0"
                                    });
                                    if (d) {
                                        $("#" + $.jgrid.jqID(u.p.selrow), "#" + $.jgrid.jqID(d)).removeClass("ui-state-highlight");
                                        $("#" + $.jgrid.jqID(e), "#" + $.jgrid.jqID(d)).addClass("ui-state-highlight")
                                    }
                                    a = !0
                                } else a = !1;
                                u.p.selrow = s.id;
                                if (t) {
                                    $(u).triggerHandler("jqGridSelectRow", [s.id, a, i]);
                                    u.p.onSelectRow && u.p.onSelectRow.call(u, s.id, a, i)
                                }
                            }
                        }
                    }
                })
            },
            resetSelection: function (e) {
                return this.each(function () {
                    var t, i, r = this;
                    r.p.frozenColumns === !0 && (i = r.p.id + "_frozen");
                    if (void 0 !== e) {
                        t = e === r.p.selrow ? r.p.selrow : e;
                        $("#" + $.jgrid.jqID(r.p.id) + " tbody:first tr#" + $.jgrid.jqID(t)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                        i && $("#" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(i)).removeClass("ui-state-highlight");
                        if (r.p.multiselect) {
                            $("#jqg_" + $.jgrid.jqID(r.p.id) + "_" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(r.p.id))[r.p.useProp ? "prop" : "attr"]("checked", !1);
                            i && $("#jqg_" + $.jgrid.jqID(r.p.id) + "_" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(i))[r.p.useProp ? "prop" : "attr"]("checked", !1);
                            r.setHeadCheckBox(!1)
                        }
                        t = null
                    } else if (r.p.multiselect) {
                        $(r.p.selarrrow).each(function (e, t) {
                            $($(r).jqGrid("getGridRowById", t)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                            $("#jqg_" + $.jgrid.jqID(r.p.id) + "_" + $.jgrid.jqID(t))[r.p.useProp ? "prop" : "attr"]("checked", !1);
                            if (i) {
                                $("#" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(i)).removeClass("ui-state-highlight");
                                $("#jqg_" + $.jgrid.jqID(r.p.id) + "_" + $.jgrid.jqID(t), "#" + $.jgrid.jqID(i))[r.p.useProp ? "prop" : "attr"]("checked", !1)
                            }
                        });
                        r.setHeadCheckBox(!1);
                        r.p.selarrrow = [];
                        r.p.selrow = null
                    } else if (r.p.selrow) {
                        $("#" + $.jgrid.jqID(r.p.id) + " tbody:first tr#" + $.jgrid.jqID(r.p.selrow)).removeClass("ui-state-highlight").attr("aria-selected", "false");
                        i && $("#" + $.jgrid.jqID(r.p.selrow), "#" + $.jgrid.jqID(i)).removeClass("ui-state-highlight");
                        r.p.selrow = null
                    }
                    if (r.p.cellEdit === !0 && parseInt(r.p.iCol, 10) >= 0 && parseInt(r.p.iRow, 10) >= 0) {
                        $("td:eq(" + r.p.iCol + ")", r.rows[r.p.iRow]).removeClass("edit-cell ui-state-highlight");
                        $(r.rows[r.p.iRow]).removeClass("selected-row ui-state-hover")
                    }
                    r.p.savedRow = []
                })
            },
            getRowData: function (e) {
                var t, i, r = {},
                    a = !1,
                    s = 0;
                this.each(function () {
                    var n, o, l = this;
                    if (void 0 === e) {
                        a = !0;
                        t = [];
                        i = l.rows.length
                    } else {
                        o = $(l).jqGrid("getGridRowById", e);
                        if (!o) return r;
                        i = 2
                    }
                    for (; i > s;) {
                        a && (o = l.rows[s]);
                        if ($(o).hasClass("jqgrow")) {
                            $('td[role="gridcell"]', o).each(function (e) {
                                n = l.p.colModel[e].name;
                                if ("cb" !== n && "subgrid" !== n && "rn" !== n) if (l.p.treeGrid === !0 && n === l.p.ExpandColumn) r[n] = $.jgrid.htmlDecode($("span:first", this).html());
                                else try {
                                        r[n] = $.unformat.call(l, this, {
                                            rowId: o.id,
                                            colModel: l.p.colModel[e]
                                        }, e)
                                    } catch (t) {
                                        r[n] = $.jgrid.htmlDecode($(this).html())
                                    }
                            });
                            if (a) {
                                t.push(r);
                                r = {}
                            }
                        }
                        s++
                    }
                });
                return t || r
            },
            delRowData: function (e) {
                var t, i, r, a = !1;
                this.each(function () {
                    var s = this;
                    t = $(s).jqGrid("getGridRowById", e);
                    if (!t) return !1;
                    if (s.p.subGrid) {
                        r = $(t).next();
                        r.hasClass("ui-subgrid") && r.remove()
                    }
                    $(t).remove();
                    s.p.records--;
                    s.p.reccount--;
                    s.updatepager(!0, !1);
                    a = !0;
                    if (s.p.multiselect) {
                        i = $.inArray(e, s.p.selarrrow); - 1 !== i && s.p.selarrrow.splice(i, 1)
                    }
                    s.p.selrow = s.p.multiselect && s.p.selarrrow.length > 0 ? s.p.selarrrow[s.p.selarrrow.length - 1] : null;
                    if ("local" === s.p.datatype) {
                        var n = $.jgrid.stripPref(s.p.idPrefix, e),
                            o = s.p._index[n];
                        if (void 0 !== o) {
                            s.p.data.splice(o, 1);
                            delete s.p._index[n];
                            s.refreshIndex("delete")
                        }
                    }
                    if (s.p.altRows === !0 && a) {
                        var l = s.p.altclass;
                        $(s.rows).each(function (e) {
                            e % 2 === 1 ? $(this).addClass(l) : $(this).removeClass(l)
                        })
                    }
                });
                return a
            },
            setRowData: function (e, t, i) {
                var r, a, s = !0;
                this.each(function () {
                    if (!this.grid) return !1;
                    var n, o, l = this,
                        d = typeof i,
                        c = {};
                    o = $(this).jqGrid("getGridRowById", e);
                    if (!o) return !1;
                    if (t) try {
                        $(this.p.colModel).each(function (i) {
                            r = this.name;
                            var s = $.jgrid.getAccessor(t, r);
                            if (void 0 !== s) {
                                c[r] = this.formatter && "string" == typeof this.formatter && "date" === this.formatter ? $.unformat.date.call(l, s, this) : s;
                                n = l.formatter(e, s, i, t, "edit");
                                a = this.title ? {
                                    title: $.jgrid.stripHtml(n)
                                } : {};
                                l.p.treeGrid === !0 && r === l.p.ExpandColumn ? $("td[role='gridcell']:eq(" + i + ") > span:first", o).html(n).attr(a) : $("td[role='gridcell']:eq(" + i + ")", o).html(n).attr(a)
                            }
                        });
                        if ("local" === l.p.datatype) {
                            var u, p = $.jgrid.stripPref(l.p.idPrefix, e),
                                h = l.p._index[p];
                            if (l.p.treeGrid) for (u in l.p.treeReader) l.p.treeReader.hasOwnProperty(u) && delete c[l.p.treeReader[u]];
                            void 0 !== h && (l.p.data[h] = $.extend(!0, l.p.data[h], c));
                            c = null
                        }
                    } catch (f) {
                        s = !1
                    }
                    if (s) {
                        "string" === d ? $(o).addClass(i) : null !== i && "object" === d && $(o).css(i);
                        $(l).triggerHandler("jqGridAfterGridComplete")
                    }
                });
                return s
            },
            addRowData: function (e, t, i, r) {
                -1 == ["first", "last", "before", "after"].indexOf(i) && (i = "last");
                var a, s, n, o, l, d, c, u, p, h, f, g, m, v, b = !1,
                    w = "";
                if (t) {
                    if ($.isArray(t)) {
                        p = !0;
                        h = e
                    } else {
                        t = [t];
                        p = !1
                    }
                    this.each(function () {
                        var y = this,
                            C = t.length;
                        l = y.p.rownumbers === !0 ? 1 : 0;
                        n = y.p.multiselect === !0 ? 1 : 0;
                        o = y.p.subGrid === !0 ? 1 : 0;
                        if (!p) if (void 0 !== e) e = String(e);
                        else {
                            e = $.jgrid.randId();
                            if (y.p.keyName !== !1) {
                                h = y.p.keyName;
                                void 0 !== t[0][h] && (e = t[0][h])
                            }
                        }
                        f = y.p.altclass;
                        for (var N = 0, D = "", k = {}, _ = $.isFunction(y.p.afterInsertRow) ? !0 : !1; C > N;) {
                            g = t[N];
                            s = [];
                            if (p) {
                                try {
                                    e = g[h];
                                    void 0 === e && (e = $.jgrid.randId())
                                } catch (x) {
                                    e = $.jgrid.randId()
                                }
                                D = y.p.altRows === !0 ? (y.rows.length - 1) % 2 === 0 ? f : "" : ""
                            }
                            v = e;
                            e = y.p.idPrefix + e;
                            if (l) {
                                w = y.formatCol(0, 1, "", null, e, !0);
                                s[s.length] = '<td role="gridcell" class="ui-state-default jqgrid-rownum" ' + w + ">0</td>"
                            }
                            if (n) {
                                u = '<input role="checkbox" type="checkbox" id="jqg_' + y.p.id + "_" + e + '" class="cbox"/>';
                                w = y.formatCol(l, 1, "", null, e, !0);
                                s[s.length] = '<td role="gridcell" ' + w + ">" + u + "</td>"
                            }
                            o && (s[s.length] = $(y).jqGrid("addSubGridCell", n + l, 1));
                            for (c = n + o + l; c < y.p.colModel.length; c++) {
                                m = y.p.colModel[c];
                                a = m.name;
                                k[a] = g[a];
                                u = y.formatter(e, $.jgrid.getAccessor(g, a), c, g);
                                w = y.formatCol(c, 1, u, g, e, k);
                                s[s.length] = '<td role="gridcell" ' + w + ">" + u + "</td>"
                            }
                            s.unshift(y.constructTr(e, !1, D, k, g, !1));
                            s[s.length] = "</tr>";
                            if (0 === y.rows.length) $("table:first", y.grid.bDiv).append(s.join(""));
                            else switch (i) {
                                case "last":
                                    $(y.rows[y.rows.length - 1]).after(s.join(""));
                                    d = y.rows.length - 1;
                                    break;
                                case "first":
                                    $(y.rows[0]).after(s.join(""));
                                    d = 1;
                                    break;
                                case "after":
                                    d = $(y).jqGrid("getGridRowById", r);
                                    if (d) {
                                        $(y.rows[d.rowIndex + 1]).hasClass("ui-subgrid") ? $(y.rows[d.rowIndex + 1]).after(s) : $(d).after(s.join(""));
                                        d = d.rowIndex + 1
                                    }
                                    break;
                                case "before":
                                    d = $(y).jqGrid("getGridRowById", r);
                                    if (d) {
                                        $(d).before(s.join(""));
                                        d = d.rowIndex - 1
                                    }
                            }
                            y.p.subGrid === !0 && $(y).jqGrid("addSubGrid", n + l, d);
                            y.p.records++;
                            y.p.reccount++;
                            $(y).triggerHandler("jqGridAfterInsertRow", [e, g, g]);
                            _ && y.p.afterInsertRow.call(y, e, g, g);
                            N++;
                            if ("local" === y.p.datatype) {
                                k[y.p.localReader.id] = v;
                                y.p._index[v] = y.p.data.length;
                                y.p.data.push(k);
                                k = {}
                            }
                        }
                        y.p.altRows !== !0 || p || ("last" === i ? (y.rows.length - 1) % 2 === 1 && $(y.rows[y.rows.length - 1]).addClass(f) : $(y.rows).each(function (e) {
                            e % 2 === 1 ? $(this).addClass(f) : $(this).removeClass(f)
                        }));
                        y.updatepager(!0, !0);
                        b = !0
                    })
                }
                return b
            },
            footerData: function (e, t, i) {
                function r(e) {
                    var t;
                    for (t in e) if (e.hasOwnProperty(t)) return !1;
                    return !0
                }
                var a, s, n = !1,
                    o = {};
                void 0 == e && (e = "get");
                "boolean" != typeof i && (i = !0);
                e = e.toLowerCase();
                this.each(function () {
                    var l, d = this;
                    if (!d.grid || !d.p.footerrow) return !1;
                    if ("set" === e && r(t)) return !1;
                    n = !0;
                    $(this.p.colModel).each(function (r) {
                        a = this.name;
                        if ("set" === e) {
                            if (void 0 !== t[a]) {
                                l = i ? d.formatter("", t[a], r, t, "edit") : t[a];
                                s = this.title ? {
                                    title: $.jgrid.stripHtml(l)
                                } : {};
                                $("tr.footrow td:eq(" + r + ")", d.grid.sDiv).html(l).attr(s);
                                n = !0
                            }
                        } else "get" === e && (o[a] = $("tr.footrow td:eq(" + r + ")", d.grid.sDiv).html())
                    })
                });
                return "get" === e ? o : n
            },
            showHideCol: function (e, t) {
                return this.each(function () {
                    var i, r = this,
                        a = !1,
                        s = $.jgrid.cell_width ? 0 : r.p.cellLayout;
                    if (r.grid) {
                        "string" == typeof e && (e = [e]);
                        t = "none" !== t ? "" : "none";
                        var n = "" === t ? !0 : !1,
                            o = r.p.groupHeader && ("object" == typeof r.p.groupHeader || $.isFunction(r.p.groupHeader));
                        o && $(r).jqGrid("destroyGroupHeader", !1);
                        $(this.p.colModel).each(function (o) {
                            if (-1 !== $.inArray(this.name, e) && this.hidden === n) {
                                if (r.p.frozenColumns === !0 && this.frozen === !0) return !0;
                                $("tr[role=rowheader]", r.grid.hDiv).each(function () {
                                    $(this.cells[o]).css("display", t)
                                });
                                $(r.rows).each(function () {
                                    $(this).hasClass("jqgroup") || $(this.cells[o]).css("display", t)
                                });
                                r.p.footerrow && $("tr.footrow td:eq(" + o + ")", r.grid.sDiv).css("display", t);
                                i = parseInt(this.width, 10);
                                "none" === t ? r.p.tblwidth -= i + s : r.p.tblwidth += i + s;
                                this.hidden = !n;
                                a = !0;
                                $(r).triggerHandler("jqGridShowHideCol", [n, this.name, o])
                            }
                        });
                        if (a === !0) {
                            r.p.shrinkToFit !== !0 || isNaN(r.p.height) || (r.p.tblwidth += parseInt(r.p.scrollOffset, 10));
                            $(r).jqGrid("setGridWidth", r.p.shrinkToFit === !0 ? r.p.tblwidth : r.p.width)
                        }
                        o && $(r).jqGrid("setGroupHeaders", r.p.groupHeader)
                    }
                })
            },
            hideCol: function (e) {
                return this.each(function () {
                    $(this).jqGrid("showHideCol", e, "none")
                })
            },
            showCol: function (e) {
                return this.each(function () {
                    $(this).jqGrid("showHideCol", e, "")
                })
            },
            remapColumns: function (e, t, i) {
                function r(t) {
                    var i;
                    i = t.length ? $.makeArray(t) : $.extend({}, t);
                    $.each(e, function (e) {
                        t[e] = i[this]
                    })
                }
                function a(t, i) {
                    $(">tr" + (i || ""), t).each(function () {
                        var t = this,
                            i = $.makeArray(t.cells);
                        $.each(e, function () {
                            var e = i[this];
                            e && t.appendChild(e)
                        })
                    })
                }
                var s = this.get(0);
                r(s.p.colModel);
                r(s.p.colNames);
                r(s.grid.headers);
                a($("thead:first", s.grid.hDiv), i && ":not(.ui-jqgrid-labels)");
                t && a($("#" + $.jgrid.jqID(s.p.id) + " tbody:first"), ".jqgfirstrow, tr.jqgrow, tr.jqfoot");
                s.p.footerrow && a($("tbody:first", s.grid.sDiv));
                s.p.remapColumns && (s.p.remapColumns.length ? r(s.p.remapColumns) : s.p.remapColumns = $.makeArray(e));
                s.p.lastsort = $.inArray(s.p.lastsort, e);
                s.p.treeGrid && (s.p.expColInd = $.inArray(s.p.expColInd, e));
                $(s).triggerHandler("jqGridRemapColumns", [e, t, i])
            },
            setGridWidth: function (e, t) {
                return this.each(function () {
                    if (this.grid) {
                        var i, r, a, s, n = this,
                            o = 0,
                            l = $.jgrid.cell_width ? 0 : n.p.cellLayout,
                            d = 0,
                            c = !1,
                            u = n.p.scrollOffset,
                            p = 0;
                        "boolean" != typeof t && (t = n.p.shrinkToFit);
                        if (!isNaN(e)) {
                            e = parseInt(e, 10);
                            n.grid.width = n.p.width = e;
                            $("#gbox_" + $.jgrid.jqID(n.p.id)).css("width", e + "px");
                            $("#gview_" + $.jgrid.jqID(n.p.id)).css("width", e + "px");
                            $(n.grid.bDiv).css("width", e + "px");
                            $(n.grid.hDiv).css("width", e + "px");
                            n.p.pager && $(n.p.pager).css("width", e + "px");
                            n.p.toppager && $(n.p.toppager).css("width", e + "px");
                            if (n.p.toolbar[0] === !0) {
                                $(n.grid.uDiv).css("width", e + "px");
                                "both" === n.p.toolbar[1] && $(n.grid.ubDiv).css("width", e + "px")
                            }
                            n.p.footerrow && $(n.grid.sDiv).css("width", e + "px");
                            t === !1 && n.p.forceFit === !0 && (n.p.forceFit = !1);
                            if (t === !0) {
                                $.each(n.p.colModel, function () {
                                    if (this.hidden === !1) {
                                        i = this.widthOrg;
                                        o += i + l;
                                        this.fixed ? p += i + l : d++
                                    }
                                });
                                if (0 === d) return;
                                n.p.tblwidth = o;
                                a = e - l * d - p;
                                if (!isNaN(n.p.height) && ($(n.grid.bDiv)[0].clientHeight < $(n.grid.bDiv)[0].scrollHeight || 1 === n.rows.length)) {
                                    c = !0;
                                    a -= u
                                }
                                o = 0;
                                var h = n.grid.cols.length > 0;
                                $.each(n.p.colModel, function (e) {
                                    if (this.hidden === !1 && !this.fixed) {
                                        i = this.widthOrg;
                                        i = Math.round(a * i / (n.p.tblwidth - l * d - p));
                                        if (0 > i) return;
                                        this.width = i;
                                        o += i;
                                        n.grid.headers[e].width = i;
                                        n.grid.headers[e].el.style.width = i + "px";
                                        n.p.footerrow && (n.grid.footers[e].style.width = i + "px");
                                        h && (n.grid.cols[e].style.width = i + "px");
                                        r = e
                                    }
                                });
                                if (!r) return;
                                s = 0;
                                c ? e - p - (o + l * d) !== u && (s = e - p - (o + l * d) - u) : 1 !== Math.abs(e - p - (o + l * d)) && (s = e - p - (o + l * d));
                                n.p.colModel[r].width += s;
                                n.p.tblwidth = o + s + l * d + p;
                                if (n.p.tblwidth > e) {
                                    var f = n.p.tblwidth - parseInt(e, 10);
                                    n.p.tblwidth = e;
                                    i = n.p.colModel[r].width = n.p.colModel[r].width - f
                                } else i = n.p.colModel[r].width;
                                n.grid.headers[r].width = i;
                                n.grid.headers[r].el.style.width = i + "px";
                                h && (n.grid.cols[r].style.width = i + "px");
                                n.p.footerrow && (n.grid.footers[r].style.width = i + "px")
                            }
                            if (n.p.tblwidth) {
                                $("table:first", n.grid.bDiv).css("width", n.p.tblwidth + "px");
                                $("table:first", n.grid.hDiv).css("width", n.p.tblwidth + "px");
                                n.grid.hDiv.scrollLeft = n.grid.bDiv.scrollLeft;
                                n.p.footerrow && $("table:first", n.grid.sDiv).css("width", n.p.tblwidth + "px")
                            }
                        }
                    }
                })
            },
            setGridHeight: function (e) {
                return this.each(function () {
                    var t = this;
                    if (t.grid) {
                        var i = $(t.grid.bDiv);
                        i.css({
                            height: e + (isNaN(e) ? "" : "px")
                        });
                        t.p.frozenColumns === !0 && $("#" + $.jgrid.jqID(t.p.id) + "_frozen").parent().height(i.height() - 16);
                        t.p.height = e;
                        t.p.scroll && t.grid.populateVisible()
                    }
                })
            },
            setCaption: function (e) {
                return this.each(function () {
                    this.p.caption = e;
                    $("span.ui-jqgrid-title, span.ui-jqgrid-title-rtl", this.grid.cDiv).html(e);
                    $(this.grid.cDiv).show();
                    $(this.grid.hDiv).removeClass("ui-corner-top")
                })
            },
            setLabel: function (e, t, i, r) {
                return this.each(function () {
                    var a = this,
                        s = -1;
                    if (a.grid && void 0 !== e) {
                        $(a.p.colModel).each(function (t) {
                            if (this.name === e) {
                                s = t;
                                return !1
                            }
                        });
                        if (s >= 0) {
                            var n = $("tr.ui-jqgrid-labels th:eq(" + s + ")", a.grid.hDiv);
                            if (t) {
                                var o = $(".s-ico", n);
                                $("[id^=jqgh_]", n).empty().html(t).append(o);
                                a.p.colNames[s] = t
                            }
                            i && ("string" == typeof i ? $(n).addClass(i) : $(n).css(i));
                            "object" == typeof r && $(n).attr(r)
                        }
                    }
                })
            },
            setCell: function (e, t, i, r, a, s) {
                return this.each(function () {
                    var n, o, l = this,
                        d = -1;
                    if (l.grid) {
                        isNaN(t) ? $(l.p.colModel).each(function (e) {
                            if (this.name === t) {
                                d = e;
                                return !1
                            }
                        }) : d = parseInt(t, 10);
                        if (d >= 0) {
                            var c = $(l).jqGrid("getGridRowById", e);
                            if (c) {
                                var u = $("td:eq(" + d + ")", c);
                                if ("" !== i || s === !0) {
                                    n = l.formatter(e, i, d, c, "edit");
                                    o = l.p.colModel[d].title ? {
                                        title: $.jgrid.stripHtml(n)
                                    } : {};
                                    l.p.treeGrid && $(".tree-wrap", $(u)).length > 0 ? $("span", $(u)).html(n).attr(o) : $(u).html(n).attr(o);
                                    if ("local" === l.p.datatype) {
                                        var p, h = l.p.colModel[d];
                                        i = h.formatter && "string" == typeof h.formatter && "date" === h.formatter ? $.unformat.date.call(l, i, h) : i;
                                        p = l.p._index[$.jgrid.stripPref(l.p.idPrefix, e)];
                                        void 0 !== p && (l.p.data[p][h.name] = i)
                                    }
                                }
                                "string" == typeof r ? $(u).addClass(r) : r && $(u).css(r);
                                "object" == typeof a && $(u).attr(a)
                            }
                        }
                    }
                })
            },
            getCell: function (e, t) {
                var i = !1;
                this.each(function () {
                    var r = this,
                        a = -1;
                    if (r.grid) {
                        isNaN(t) ? $(r.p.colModel).each(function (e) {
                            if (this.name === t) {
                                a = e;
                                return !1
                            }
                        }) : a = parseInt(t, 10);
                        if (a >= 0) {
                            var s = $(r).jqGrid("getGridRowById", e);
                            if (s) try {
                                i = $.unformat.call(r, $("td:eq(" + a + ")", s), {
                                    rowId: s.id,
                                    colModel: r.p.colModel[a]
                                }, a)
                            } catch (n) {
                                i = $.jgrid.htmlDecode($("td:eq(" + a + ")", s).html())
                            }
                        }
                    }
                });
                return i
            },
            getCol: function (e, t, i) {
                var r, a, s, n, o = [],
                    l = 0;
                t = "boolean" != typeof t ? !1 : t;
                void 0 === i && (i = !1);
                this.each(function () {
                    var d = this,
                        c = -1;
                    if (d.grid) {
                        isNaN(e) ? $(d.p.colModel).each(function (t) {
                            if (this.name === e) {
                                c = t;
                                return !1
                            }
                        }) : c = parseInt(e, 10);
                        if (c >= 0) {
                            var u = d.rows.length,
                                p = 0,
                                h = 0;
                            if (u && u > 0) {
                                for (; u > p;) {
                                    if ($(d.rows[p]).hasClass("jqgrow")) {
                                        try {
                                            r = $.unformat.call(d, $(d.rows[p].cells[c]), {
                                                rowId: d.rows[p].id,
                                                colModel: d.p.colModel[c]
                                            }, c)
                                        } catch (f) {
                                            r = $.jgrid.htmlDecode(d.rows[p].cells[c].innerHTML)
                                        }
                                        if (i) {
                                            n = parseFloat(r);
                                            if (!isNaN(n)) {
                                                l += n;
                                                void 0 === s && (s = a = n);
                                                a = Math.min(a, n);
                                                s = Math.max(s, n);
                                                h++
                                            }
                                        } else o.push(t ? {
                                            id: d.rows[p].id,
                                            value: r
                                        } : r)
                                    }
                                    p++
                                }
                                if (i) switch (i.toLowerCase()) {
                                    case "sum":
                                        o = l;
                                        break;
                                    case "avg":
                                        o = l / h;
                                        break;
                                    case "count":
                                        o = u - 1;
                                        break;
                                    case "min":
                                        o = a;
                                        break;
                                    case "max":
                                        o = s
                                }
                            }
                        }
                    }
                });
                return o
            },
            clearGridData: function (e) {
                return this.each(function () {
                    var t = this;
                    if (t.grid) {
                        "boolean" != typeof e && (e = !1);
                        if (t.p.deepempty) $("#" + $.jgrid.jqID(t.p.id) + " tbody:first tr:gt(0)").remove();
                        else {
                            var i = $("#" + $.jgrid.jqID(t.p.id) + " tbody:first tr:first")[0];
                            $("#" + $.jgrid.jqID(t.p.id) + " tbody:first").empty().append(i)
                        }
                        t.p.footerrow && e && $(".ui-jqgrid-ftable td", t.grid.sDiv).html("&#160;");
                        t.p.selrow = null;
                        t.p.selarrrow = [];
                        t.p.savedRow = [];
                        t.p.records = 0;
                        t.p.page = 1;
                        t.p.lastpage = 0;
                        t.p.reccount = 0;
                        t.p.data = [];
                        t.p._index = {};
                        t.updatepager(!0, !1)
                    }
                })
            },
            getInd: function (e, t) {
                var i, r = !1;
                this.each(function () {
                    i = $(this).jqGrid("getGridRowById", e);
                    i && (r = t === !0 ? i : i.rowIndex)
                });
                return r
            },
            bindKeys: function (e) {
                var t = $.extend({
                    onEnter: null,
                    onSpace: null,
                    onLeftKey: null,
                    onRightKey: null,
                    scrollingRows: !0
                }, e || {});
                return this.each(function () {
                    var e = this;
                    $("body").is("[role]") || $("body").attr("role", "application");
                    e.p.scrollrows = t.scrollingRows;
                    $(e).keydown(function (i) {
                        var r, a, s, n = $(e).find("tr[tabindex=0]")[0],
                            o = e.p.treeReader.expanded_field;
                        if (n) {
                            s = e.p._index[$.jgrid.stripPref(e.p.idPrefix, n.id)];
                            if (37 === i.keyCode || 38 === i.keyCode || 39 === i.keyCode || 40 === i.keyCode) {
                                if (38 === i.keyCode) {
                                    a = n.previousSibling;
                                    r = "";
                                    if (a) if ($(a).is(":hidden")) for (; a;) {
                                        a = a.previousSibling;
                                        if (!$(a).is(":hidden") && $(a).hasClass("jqgrow")) {
                                            r = a.id;
                                            break
                                        }
                                    } else r = a.id;
                                    $(e).jqGrid("setSelection", r, !0, i);
                                    i.preventDefault()
                                }
                                if (40 === i.keyCode) {
                                    a = n.nextSibling;
                                    r = "";
                                    if (a) if ($(a).is(":hidden")) for (; a;) {
                                        a = a.nextSibling;
                                        if (!$(a).is(":hidden") && $(a).hasClass("jqgrow")) {
                                            r = a.id;
                                            break
                                        }
                                    } else r = a.id;
                                    $(e).jqGrid("setSelection", r, !0, i);
                                    i.preventDefault()
                                }
                                if (37 === i.keyCode) {
                                    e.p.treeGrid && e.p.data[s][o] && $(n).find("div.treeclick").trigger("click");
                                    $(e).triggerHandler("jqGridKeyLeft", [e.p.selrow]);
                                    $.isFunction(t.onLeftKey) && t.onLeftKey.call(e, e.p.selrow)
                                }
                                if (39 === i.keyCode) {
                                    e.p.treeGrid && !e.p.data[s][o] && $(n).find("div.treeclick").trigger("click");
                                    $(e).triggerHandler("jqGridKeyRight", [e.p.selrow]);
                                    $.isFunction(t.onRightKey) && t.onRightKey.call(e, e.p.selrow)
                                }
                            } else if (13 === i.keyCode) {
                                $(e).triggerHandler("jqGridKeyEnter", [e.p.selrow]);
                                $.isFunction(t.onEnter) && t.onEnter.call(e, e.p.selrow)
                            } else if (32 === i.keyCode) {
                                $(e).triggerHandler("jqGridKeySpace", [e.p.selrow]);
                                $.isFunction(t.onSpace) && t.onSpace.call(e, e.p.selrow)
                            }
                        }
                    })
                })
            },
            unbindKeys: function () {
                return this.each(function () {
                    $(this).unbind("keydown")
                })
            },
            getLocalRow: function (e) {
                var t, i = !1;
                this.each(function () {
                    if (void 0 !== e) {
                        t = this.p._index[$.jgrid.stripPref(this.p.idPrefix, e)];
                        t >= 0 && (i = this.p.data[t])
                    }
                });
                return i
            }
        })
    }(jQuery);
!
    function (e) {
        "use strict";
        e.jgrid.extend({
            getColProp: function (e) {
                var t = {},
                    i = this[0];
                if (!i.grid) return !1;
                var r, a = i.p.colModel;
                for (r = 0; r < a.length; r++) if (a[r].name === e) {
                    t = a[r];
                    break
                }
                return t
            },
            setColProp: function (t, i) {
                return this.each(function () {
                    if (this.grid && i) {
                        var r, a = this.p.colModel;
                        for (r = 0; r < a.length; r++) if (a[r].name === t) {
                            e.extend(!0, this.p.colModel[r], i);
                            break
                        }
                    }
                })
            },
            sortGrid: function (e, t, i) {
                return this.each(function () {
                    var r, a = this,
                        s = -1,
                        o = !1;
                    if (a.grid) {
                        e || (e = a.p.sortname);
                        for (r = 0; r < a.p.colModel.length; r++) if (a.p.colModel[r].index === e || a.p.colModel[r].name === e) {
                            s = r;
                            a.p.frozenColumns === !0 && a.p.colModel[r].frozen === !0 && (o = a.grid.fhDiv.find("#" + a.p.id + "_" + e));
                            break
                        }
                        if (-1 !== s) {
                            var n = a.p.colModel[s].sortable;
                            o || (o = a.grid.headers[s].el);
                            "boolean" != typeof n && (n = !0);
                            "boolean" != typeof t && (t = !1);
                            n && a.sortData("jqgh_" + a.p.id + "_" + e, s, t, i, o)
                        }
                    }
                })
            },
            clearBeforeUnload: function () {
                return this.each(function () {
                    var t = this.grid;
                    e.isFunction(t.emptyRows) && t.emptyRows.call(this, !0, !0);
                    e(document).unbind("mouseup.jqGrid" + this.p.id);
                    e(t.hDiv).unbind("mousemove");
                    e(this).unbind();
                    t.dragEnd = null;
                    t.dragMove = null;
                    t.dragStart = null;
                    t.emptyRows = null;
                    t.populate = null;
                    t.populateVisible = null;
                    t.scrollGrid = null;
                    t.selectionPreserver = null;
                    t.bDiv = null;
                    t.cDiv = null;
                    t.hDiv = null;
                    t.cols = null;
                    var i, r = t.headers.length;
                    for (i = 0; r > i; i++) t.headers[i].el = null;
                    this.formatCol = null;
                    this.sortData = null;
                    this.updatepager = null;
                    this.refreshIndex = null;
                    this.setHeadCheckBox = null;
                    this.constructTr = null;
                    this.formatter = null;
                    this.addXmlData = null;
                    this.addJSONData = null;
                    this.grid = null
                })
            },
            GridDestroy: function () {
                return this.each(function () {
                    if (this.grid) {
                        this.p.pager && e(this.p.pager).remove();
                        try {
                            e(this).jqGrid("clearBeforeUnload");
                            e("#gbox_" + e.jgrid.jqID(this.id)).remove()
                        } catch (t) {}
                    }
                })
            },
            GridUnload: function () {
                return this.each(function () {
                    if (this.grid) {
                        var t = {
                            id: e(this).attr("id"),
                            cl: e(this).attr("class")
                        };
                        this.p.pager && e(this.p.pager).empty().removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
                        var i = document.createElement("table");
                        e(i).attr({
                            id: t.id
                        });
                        i.className = t.cl;
                        var r = e.jgrid.jqID(this.id);
                        e(i).removeClass("ui-jqgrid-btable");
                        if (1 === e(this.p.pager).parents("#gbox_" + r).length) {
                            e(i).insertBefore("#gbox_" + r).show();
                            e(this.p.pager).insertBefore("#gbox_" + r)
                        } else e(i).insertBefore("#gbox_" + r).show();
                        e(this).jqGrid("clearBeforeUnload");
                        e("#gbox_" + r).remove()
                    }
                })
            },
            setGridState: function (t) {
                return this.each(function () {
                    if (this.grid) {
                        var i = this;
                        if ("hidden" === t) {
                            e(".ui-jqgrid-bdiv, .ui-jqgrid-hdiv", "#gview_" + e.jgrid.jqID(i.p.id)).slideUp("fast");
                            i.p.pager && e(i.p.pager).slideUp("fast");
                            i.p.toppager && e(i.p.toppager).slideUp("fast");
                            if (i.p.toolbar[0] === !0) {
                                "both" === i.p.toolbar[1] && e(i.grid.ubDiv).slideUp("fast");
                                e(i.grid.uDiv).slideUp("fast")
                            }
                            i.p.footerrow && e(".ui-jqgrid-sdiv", "#gbox_" + e.jgrid.jqID(i.p.id)).slideUp("fast");
                            e(".ui-jqgrid-titlebar-close span", i.grid.cDiv).removeClass("ui-icon-circle-triangle-n").addClass("ui-icon-circle-triangle-s");
                            i.p.gridstate = "hidden"
                        } else if ("visible" === t) {
                            e(".ui-jqgrid-hdiv, .ui-jqgrid-bdiv", "#gview_" + e.jgrid.jqID(i.p.id)).slideDown("fast");
                            i.p.pager && e(i.p.pager).slideDown("fast");
                            i.p.toppager && e(i.p.toppager).slideDown("fast");
                            if (i.p.toolbar[0] === !0) {
                                "both" === i.p.toolbar[1] && e(i.grid.ubDiv).slideDown("fast");
                                e(i.grid.uDiv).slideDown("fast")
                            }
                            i.p.footerrow && e(".ui-jqgrid-sdiv", "#gbox_" + e.jgrid.jqID(i.p.id)).slideDown("fast");
                            e(".ui-jqgrid-titlebar-close span", i.grid.cDiv).removeClass("ui-icon-circle-triangle-s").addClass("ui-icon-circle-triangle-n");
                            i.p.gridstate = "visible"
                        }
                    }
                })
            },
            filterToolbar: function (t) {
                t = e.extend({
                    autosearch: !0,
                    searchOnEnter: !0,
                    beforeSearch: null,
                    afterSearch: null,
                    beforeClear: null,
                    afterClear: null,
                    searchurl: "",
                    stringResult: !1,
                    groupOp: "AND",
                    defaultSearch: "bw",
                    searchOperators: !1,
                    resetIcon: "x",
                    operands: {
                        eq: "==",
                        ne: "!",
                        lt: "<",
                        le: "<=",
                        gt: ">",
                        ge: ">=",
                        bw: "^",
                        bn: "!^",
                        "in": "=",
                        ni: "!=",
                        ew: "|",
                        en: "!@",
                        cn: "~",
                        nc: "!~",
                        nu: "#",
                        nn: "!#"
                    }
                }, e.jgrid.search, t || {});
                return this.each(function () {
                    var i = this;
                    if (!this.ftoolbar) {
                        var r, a = function () {
                                var r, a, s, o = {},
                                    n = 0,
                                    l = {};
                                e.each(i.p.colModel, function () {
                                    var d = e("#gs_" + e.jgrid.jqID(this.name), this.frozen === !0 && i.p.frozenColumns === !0 ? i.grid.fhDiv : i.grid.hDiv);
                                    a = this.index || this.name;
                                    s = t.searchOperators ? d.parent().prev().children("a").attr("soper") || t.defaultSearch : this.searchoptions && this.searchoptions.sopt ? this.searchoptions.sopt[0] : "select" === this.stype ? "eq" : t.defaultSearch;
                                    r = "custom" === this.stype && e.isFunction(this.searchoptions.custom_value) && d.length > 0 && "SPAN" === d[0].nodeName.toUpperCase() ? this.searchoptions.custom_value.call(i, d.children(".customelement:first"), "get") : d.val();
                                    if (r || "nu" === s || "nn" === s) {
                                        o[a] = r;
                                        l[a] = s;
                                        n++
                                    } else try {
                                        delete i.p.postData[a]
                                    } catch (c) {}
                                });
                                var d = n > 0 ? !0 : !1;
                                if (t.stringResult === !0 || "local" === i.p.datatype || t.searchOperators === !0) {
                                    var c = '{"groupOp":"' + t.groupOp + '","rules":[',
                                        u = 0;
                                    e.each(o, function (e, t) {
                                        u > 0 && (c += ",");
                                        c += '{"field":"' + e + '",';
                                        c += '"op":"' + l[e] + '",';
                                        t += "";
                                        c += '"data":"' + t.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                        u++
                                    });
                                    c += "]}";
                                    e.extend(i.p.postData, {
                                        filters: c
                                    });
                                    e.each(["searchField", "searchString", "searchOper"], function (e, t) {
                                        i.p.postData.hasOwnProperty(t) && delete i.p.postData[t]
                                    })
                                } else e.extend(i.p.postData, o);
                                var p;
                                if (i.p.searchurl) {
                                    p = i.p.url;
                                    e(i).jqGrid("setGridParam", {
                                        url: i.p.searchurl
                                    })
                                }
                                var h = "stop" === e(i).triggerHandler("jqGridToolbarBeforeSearch") ? !0 : !1;
                                !h && e.isFunction(t.beforeSearch) && (h = t.beforeSearch.call(i));
                                h || e(i).jqGrid("setGridParam", {
                                    search: d
                                }).trigger("reloadGrid", [{
                                    page: 1
                                }]);
                                p && e(i).jqGrid("setGridParam", {
                                    url: p
                                });
                                e(i).triggerHandler("jqGridToolbarAfterSearch");
                                e.isFunction(t.afterSearch) && t.afterSearch.call(i)
                            },
                            s = function (r) {
                                var a, s = {},
                                    o = 0;
                                r = "boolean" != typeof r ? !0 : r;
                                e.each(i.p.colModel, function () {
                                    var t, r = e("#gs_" + e.jgrid.jqID(this.name), this.frozen === !0 && i.p.frozenColumns === !0 ? i.grid.fhDiv : i.grid.hDiv);
                                    this.searchoptions && void 0 !== this.searchoptions.defaultValue && (t = this.searchoptions.defaultValue);
                                    a = this.index || this.name;
                                    switch (this.stype) {
                                        case "select":
                                            r.find("option").each(function (i) {
                                                0 === i && (this.selected = !0);
                                                if (e(this).val() === t) {
                                                    this.selected = !0;
                                                    return !1
                                                }
                                            });
                                            if (void 0 !== t) {
                                                s[a] = t;
                                                o++
                                            } else try {
                                                delete i.p.postData[a]
                                            } catch (n) {}
                                            break;
                                        case "text":
                                            r.val(t || "");
                                            if (void 0 !== t) {
                                                s[a] = t;
                                                o++
                                            } else try {
                                                delete i.p.postData[a]
                                            } catch (l) {}
                                            break;
                                        case "custom":
                                            e.isFunction(this.searchoptions.custom_value) && r.length > 0 && "SPAN" === r[0].nodeName.toUpperCase() && this.searchoptions.custom_value.call(i, r.children(".customelement:first"), "set", t || "")
                                    }
                                });
                                var n = o > 0 ? !0 : !1;
                                i.p.resetsearch = !0;
                                if (t.stringResult === !0 || "local" === i.p.datatype) {
                                    var l = '{"groupOp":"' + t.groupOp + '","rules":[',
                                        d = 0;
                                    e.each(s, function (e, t) {
                                        d > 0 && (l += ",");
                                        l += '{"field":"' + e + '",';
                                        l += '"op":"eq",';
                                        t += "";
                                        l += '"data":"' + t.replace(/\\/g, "\\\\").replace(/\"/g, '\\"') + '"}';
                                        d++
                                    });
                                    l += "]}";
                                    e.extend(i.p.postData, {
                                        filters: l
                                    });
                                    e.each(["searchField", "searchString", "searchOper"], function (e, t) {
                                        i.p.postData.hasOwnProperty(t) && delete i.p.postData[t]
                                    })
                                } else e.extend(i.p.postData, s);
                                var c;
                                if (i.p.searchurl) {
                                    c = i.p.url;
                                    e(i).jqGrid("setGridParam", {
                                        url: i.p.searchurl
                                    })
                                }
                                var u = "stop" === e(i).triggerHandler("jqGridToolbarBeforeClear") ? !0 : !1;
                                !u && e.isFunction(t.beforeClear) && (u = t.beforeClear.call(i));
                                u || r && e(i).jqGrid("setGridParam", {
                                    search: n
                                }).trigger("reloadGrid", [{
                                    page: 1
                                }]);
                                c && e(i).jqGrid("setGridParam", {
                                    url: c
                                });
                                e(i).triggerHandler("jqGridToolbarAfterClear");
                                e.isFunction(t.afterClear) && t.afterClear()
                            },
                            o = function () {
                                var t = e("tr.ui-search-toolbar", i.grid.hDiv),
                                    r = i.p.frozenColumns === !0 ? e("tr.ui-search-toolbar", i.grid.fhDiv) : !1;
                                if ("none" === t.css("display")) {
                                    t.show();
                                    r && r.show()
                                } else {
                                    t.hide();
                                    r && r.hide()
                                }
                            },
                            n = function (r, s, o) {
                                e("#sopt_menu").remove();
                                s = parseInt(s, 10);
                                o = parseInt(o, 10) + 18;
                                for (var n, l, d = e(".ui-jqgrid-view").css("font-size") || "11px", c = '<ul id="sopt_menu" class="ui-search-menu" role="menu" tabindex="0" style="font-size:' + d + ";left:" + s + "px;top:" + o + 'px;">', u = e(r).attr("soper"), p = [], h = 0, f = e(r).attr("colname"), g = i.p.colModel.length; g > h && i.p.colModel[h].name !== f;) h++;
                                var m = i.p.colModel[h],
                                    v = e.extend({}, m.searchoptions);
                                if (!v.sopt) {
                                    v.sopt = [];
                                    v.sopt[0] = "select" === m.stype ? "eq" : t.defaultSearch
                                }
                                e.each(t.odata, function () {
                                    p.push(this.oper)
                                });
                                for (h = 0; h < v.sopt.length; h++) {
                                    l = e.inArray(v.sopt[h], p);
                                    if (-1 !== l) {
                                        n = u === t.odata[l].oper ? "ui-state-highlight" : "";
                                        c += '<li class="ui-menu-item ' + n + '" role="presentation"><a class="ui-corner-all g-menu-item" tabindex="0" role="menuitem" value="' + t.odata[l].oper + '" oper="' + t.operands[t.odata[l].oper] + '"><table cellspacing="0" cellpadding="0" border="0"><tr><td width="25px">' + t.operands[t.odata[l].oper] + "</td><td>" + t.odata[l].text + "</td></tr></table></a></li>"
                                    }
                                }
                                c += "</ul>";
                                e("body").append(c);
                                e("#sopt_menu").addClass("ui-menu ui-widget ui-widget-content ui-corner-all");
                                e("#sopt_menu > li > a").hover(function () {
                                    e(this).addClass("ui-state-hover")
                                }, function () {
                                    e(this).removeClass("ui-state-hover")
                                }).click(function () {
                                    var s = e(this).attr("value"),
                                        o = e(this).attr("oper");
                                    e(i).triggerHandler("jqGridToolbarSelectOper", [s, o, r]);
                                    e("#sopt_menu").hide();
                                    e(r).text(o).attr("soper", s);
                                    if (t.autosearch === !0) {
                                        var n = e(r).parent().next().children()[0];
                                        (e(n).val() || "nu" === s || "nn" === s) && a()
                                    }
                                })
                            },
                            l = e("<tr class='ui-search-toolbar' role='rowheader'></tr>");
                        e.each(i.p.colModel, function (s) {
                            var o, n, d, c, u, p = this,
                                h = "",
                                f = "=",
                                g = e("<th role='columnheader' class='ui-state-default ui-th-column ui-th-" + i.p.direction + "'></th>"),
                                m = e("<div style='position:relative;height:auto;padding-right:0.3em;padding-left:0.3em;'></div>"),
                                v = e("<table class='ui-search-table' cellspacing='0'><tr><td class='ui-search-oper'></td><td class='ui-search-input'></td><td class='ui-search-clear'></td></tr></table>");
                            this.hidden === !0 && e(g).css("display", "none");
                            this.search = this.search === !1 ? !1 : !0;
                            void 0 === this.stype && (this.stype = "text");
                            o = e.extend({}, this.searchoptions || {});
                            if (this.search) {
                                if (t.searchOperators) {
                                    c = o.sopt ? o.sopt[0] : "select" === p.stype ? "eq" : t.defaultSearch;
                                    for (u = 0; u < t.odata.length; u++) if (t.odata[u].oper === c) {
                                        f = t.operands[c] || "";
                                        break
                                    }
                                    var b = null != o.searchtitle ? o.searchtitle : t.operandTitle;
                                    h = "<a title='" + b + "' style='padding-right: 0.5em;' soper='" + c + "' class='soptclass' colname='" + this.name + "'>" + f + "</a>"
                                }
                                e("td:eq(0)", v).attr("colindex", s).append(h);
                                void 0 === o.clearSearch && (o.clearSearch = !0);
                                if (o.clearSearch) {
                                    var w = t.resetTitle || "Clear Search Value";
                                    e("td:eq(2)", v).append("<a title='" + w + "' style='padding-right: 0.3em;padding-left: 0.3em;' class='clearsearchclass'>" + t.resetIcon + "</a>")
                                } else e("td:eq(2)", v).hide();
                                switch (this.stype) {
                                    case "select":
                                        n = this.surl || o.dataUrl;
                                        if (n) {
                                            d = m;
                                            e(d).append(v);
                                            e.ajax(e.extend({
                                                url: n,
                                                dataType: "html",
                                                success: function (r) {
                                                    if (void 0 !== o.buildSelect) {
                                                        var s = o.buildSelect(r);
                                                        s && e("td:eq(1)", v).append(s)
                                                    } else e("td:eq(1)", v).append(r);
                                                    void 0 !== o.defaultValue && e("select", d).val(o.defaultValue);
                                                    e("select", d).attr({
                                                        name: p.index || p.name,
                                                        id: "gs_" + p.name
                                                    });
                                                    o.attr && e("select", d).attr(o.attr);
                                                    e("select", d).css({
                                                        width: "100%"
                                                    });
                                                    e.jgrid.bindEv.call(i, e("select", d)[0], o);
                                                    t.autosearch === !0 && e("select", d).change(function () {
                                                        a();
                                                        return !1
                                                    });
                                                    r = null
                                                }
                                            }, e.jgrid.ajaxOptions, i.p.ajaxSelectOptions || {}))
                                        } else {
                                            var y, C, D;
                                            if (p.searchoptions) {
                                                y = void 0 === p.searchoptions.value ? "" : p.searchoptions.value;
                                                C = void 0 === p.searchoptions.separator ? ":" : p.searchoptions.separator;
                                                D = void 0 === p.searchoptions.delimiter ? ";" : p.searchoptions.delimiter
                                            } else if (p.editoptions) {
                                                y = void 0 === p.editoptions.value ? "" : p.editoptions.value;
                                                C = void 0 === p.editoptions.separator ? ":" : p.editoptions.separator;
                                                D = void 0 === p.editoptions.delimiter ? ";" : p.editoptions.delimiter
                                            }
                                            if (y) {
                                                var N = document.createElement("select");
                                                N.style.width = "100%";
                                                e(N).attr({
                                                    name: p.index || p.name,
                                                    id: "gs_" + p.name
                                                });
                                                var $, _, j, k;
                                                if ("string" == typeof y) {
                                                    c = y.split(D);
                                                    for (k = 0; k < c.length; k++) {
                                                        $ = c[k].split(C);
                                                        _ = document.createElement("option");
                                                        _.value = $[0];
                                                        _.innerHTML = $[1];
                                                        N.appendChild(_)
                                                    }
                                                } else if ("object" == typeof y) for (j in y) if (y.hasOwnProperty(j)) {
                                                    _ = document.createElement("option");
                                                    _.value = j;
                                                    _.innerHTML = y[j];
                                                    N.appendChild(_)
                                                }
                                                void 0 !== o.defaultValue && e(N).val(o.defaultValue);
                                                o.attr && e(N).attr(o.attr);
                                                e(m).append(v);
                                                e.jgrid.bindEv.call(i, N, o);
                                                e("td:eq(1)", v).append(N);
                                                t.autosearch === !0 && e(N).change(function () {
                                                    a();
                                                    return !1
                                                })
                                            }
                                        }
                                        break;
                                    case "text":
                                        var x = void 0 !== o.defaultValue ? o.defaultValue : "";
                                        e("td:eq(1)", v).append("<input type='text' style='width:100%;padding:0px;' name='" + (p.index || p.name) + "' id='gs_" + p.name + "' value='" + x + "'/>");
                                        e(m).append(v);
                                        o.attr && e("input", m).attr(o.attr);
                                        e.jgrid.bindEv.call(i, e("input", m)[0], o);
                                        t.autosearch === !0 && (t.searchOnEnter ? e("input", m).keypress(function (e) {
                                            var t = e.charCode || e.keyCode || 0;
                                            if (13 === t) {
                                                a();
                                                return !1
                                            }
                                            return this
                                        }) : e("input", m).keydown(function (e) {
                                            var t = e.which;
                                            switch (t) {
                                                case 13:
                                                    return !1;
                                                case 9:
                                                case 16:
                                                case 37:
                                                case 38:
                                                case 39:
                                                case 40:
                                                case 27:
                                                    break;
                                                default:
                                                    r && clearTimeout(r);
                                                    r = setTimeout(function () {
                                                        a()
                                                    }, 500)
                                            }
                                        }));
                                        break;
                                    case "custom":
                                        e("td:eq(1)", v).append("<span style='width:95%;padding:0px;' name='" + (p.index || p.name) + "' id='gs_" + p.name + "'/>");
                                        e(m).append(v);
                                        try {
                                            if (!e.isFunction(o.custom_element)) throw "e1";
                                            var I = o.custom_element.call(i, void 0 !== o.defaultValue ? o.defaultValue : "", o);
                                            if (!I) throw "e2";
                                            I = e(I).addClass("customelement");
                                            e(m).find("span[name='" + (p.index || p.name) + "']").append(I)
                                        } catch (T) {
                                            "e1" === T && e.jgrid.info_dialog(e.jgrid.errors.errcap, "function 'custom_element' " + e.jgrid.edit.msg.nodefined, e.jgrid.edit.bClose);
                                            "e2" === T ? e.jgrid.info_dialog(e.jgrid.errors.errcap, "function 'custom_element' " + e.jgrid.edit.msg.novalue, e.jgrid.edit.bClose) : e.jgrid.info_dialog(e.jgrid.errors.errcap, "string" == typeof T ? T : T.message, e.jgrid.edit.bClose)
                                        }
                                }
                            }
                            e(g).append(m);
                            e(l).append(g);
                            t.searchOperators || e("td:eq(0)", v).hide()
                        });
                        e("table thead", i.grid.hDiv).append(l);
                        if (t.searchOperators) {
                            e(".soptclass", l).click(function (t) {
                                var i = e(this).offset(),
                                    r = i.left,
                                    a = i.top;
                                n(this, r, a);
                                t.stopPropagation()
                            });
                            e("body").on("click", function (t) {
                                "soptclass" !== t.target.className && e("#sopt_menu").hide()
                            })
                        }
                        e(".clearsearchclass", l).click(function () {
                            var r = e(this).parents("tr:first"),
                                s = parseInt(e("td.ui-search-oper", r).attr("colindex"), 10),
                                o = e.extend({}, i.p.colModel[s].searchoptions || {}),
                                n = o.defaultValue ? o.defaultValue : "";
                            "select" === i.p.colModel[s].stype ? n ? e("td.ui-search-input select", r).val(n) : e("td.ui-search-input select", r)[0].selectedIndex = 0 : e("td.ui-search-input input", r).val(n);
                            t.autosearch === !0 && a()
                        });
                        this.ftoolbar = !0;
                        this.triggerToolbar = a;
                        this.clearToolbar = s;
                        this.toggleToolbar = o
                    }
                })
            },
            destroyFilterToolbar: function () {
                return this.each(function () {
                    if (this.ftoolbar) {
                        this.triggerToolbar = null;
                        this.clearToolbar = null;
                        this.toggleToolbar = null;
                        this.ftoolbar = !1;
                        e(this.grid.hDiv).find("table thead tr.ui-search-toolbar").remove()
                    }
                })
            },
            destroyGroupHeader: function (t) {
                void 0 === t && (t = !0);
                return this.each(function () {
                    var i, r, a, s, o, n, l, d = this,
                        c = d.grid,
                        u = e("table.ui-jqgrid-htable thead", c.hDiv),
                        p = d.p.colModel;
                    if (c) {
                        e(this).unbind(".setGroupHeaders");
                        i = e("<tr>", {
                            role: "rowheader"
                        }).addClass("ui-jqgrid-labels");
                        s = c.headers;
                        for (r = 0, a = s.length; a > r; r++) {
                            l = p[r].hidden ? "none" : "";
                            o = e(s[r].el).width(s[r].width).css("display", l);
                            try {
                                o.removeAttr("rowSpan")
                            } catch (h) {
                                o.attr("rowSpan", 1)
                            }
                            i.append(o);
                            n = o.children("span.ui-jqgrid-resize");
                            n.length > 0 && (n[0].style.height = "");
                            o.children("div")[0].style.top = ""
                        }
                        e(u).children("tr.ui-jqgrid-labels").remove();
                        e(u).prepend(i);
                        t === !0 && e(d).jqGrid("setGridParam", {
                            groupHeader: null
                        })
                    }
                })
            },
            setGroupHeaders: function (t) {
                t = e.extend({
                    useColSpanStyle: !1,
                    groupHeaders: []
                }, t || {});
                return this.each(function () {
                    this.p.groupHeader = t;
                    var i, r, a, s, o, n, l, d, c, u, p, h, f, g = this,
                        m = 0,
                        v = g.p.colModel,
                        b = v.length,
                        w = g.grid.headers,
                        y = e("table.ui-jqgrid-htable", g.grid.hDiv),
                        C = y.children("thead").children("tr.ui-jqgrid-labels:last").addClass("jqg-second-row-header"),
                        D = y.children("thead"),
                        N = y.find(".jqg-first-row-header");
                    void 0 === N[0] ? N = e("<tr>", {
                        role: "row",
                        "aria-hidden": "true"
                    }).addClass("jqg-first-row-header").css("height", "auto") : N.empty();
                    var $, _ = function (e, t) {
                        var i, r = t.length;
                        for (i = 0; r > i; i++) if (t[i].startColumnName === e) return i;
                        return -1
                    };
                    e(g).prepend(D);
                    a = e("<tr>", {
                        role: "rowheader"
                    }).addClass("ui-jqgrid-labels jqg-third-row-header");
                    for (i = 0; b > i; i++) {
                        o = w[i].el;
                        n = e(o);
                        r = v[i];
                        l = {
                            height: "0px",
                            width: w[i].width + "px",
                            display: r.hidden ? "none" : ""
                        };
                        e("<th>", {
                            role: "gridcell"
                        }).css(l).addClass("ui-first-th-" + g.p.direction).appendTo(N);
                        o.style.width = "";
                        d = _(r.name, t.groupHeaders);
                        if (d >= 0) {
                            c = t.groupHeaders[d];
                            u = c.numberOfColumns;
                            p = c.titleText;
                            for (h = 0, d = 0; u > d && b > i + d; d++) v[i + d].hidden || h++;
                            s = e("<th>").attr({
                                role: "columnheader"
                            }).addClass("ui-state-default ui-th-column-header ui-th-" + g.p.direction).css({
                                height: "22px",
                                "border-top": "0 none"
                            }).html(p);
                            h > 0 && s.attr("colspan", String(h));
                            g.p.headertitles && s.attr("title", s.text());
                            0 === h && s.hide();
                            n.before(s);
                            a.append(o);
                            m = u - 1
                        } else if (0 === m) if (t.useColSpanStyle) n.attr("rowspan", "2");
                        else {
                            e("<th>", {
                                role: "columnheader"
                            }).addClass("ui-state-default ui-th-column-header ui-th-" + g.p.direction).css({
                                display: r.hidden ? "none" : "",
                                "border-top": "0 none"
                            }).insertBefore(n);
                            a.append(o)
                        } else {
                            a.append(o);
                            m--
                        }
                    }
                    f = e(g).children("thead");
                    f.prepend(N);
                    a.insertAfter(C);
                    y.append(f);
                    if (t.useColSpanStyle) {
                        y.find("span.ui-jqgrid-resize").each(function () {
                            var t = e(this).parent();
                            t.is(":visible") && (this.style.cssText = "height: " + t.height() + "px !important; cursor: col-resize;")
                        });
                        y.find("div.ui-jqgrid-sortable").each(function () {
                            var t = e(this),
                                i = t.parent();
                            i.is(":visible") && i.is(":has(span.ui-jqgrid-resize)") && t.css("top", (i.height() - t.outerHeight()) / 2 + "px")
                        })
                    }
                    $ = f.find("tr.jqg-first-row-header");
                    e(g).bind("jqGridResizeStop.setGroupHeaders", function (e, t, i) {
                        $.find("th").eq(i).width(t)
                    })
                })
            },
            setFrozenColumns: function () {
                return this.each(function () {
                    if (this.grid) {
                        var t = this,
                            i = t.p.colModel,
                            r = 0,
                            a = i.length,
                            s = -1,
                            o = !1;
                        if (t.p.subGrid !== !0 && t.p.treeGrid !== !0 && t.p.cellEdit !== !0 && !t.p.sortable && !t.p.scroll) {
                            t.p.rownumbers && r++;
                            t.p.multiselect && r++;
                            for (; a > r && i[r].frozen === !0;) {
                                o = !0;
                                s = r;
                                r++
                            }
                            if (s >= 0 && o) {
                                var n = t.p.caption ? e(t.grid.cDiv).outerHeight() : 0,
                                    l = e(".ui-jqgrid-htable", "#gview_" + e.jgrid.jqID(t.p.id)).height();
                                t.p.toppager && (n += e(t.grid.topDiv).outerHeight());
                                t.p.toolbar[0] === !0 && "bottom" !== t.p.toolbar[1] && (n += e(t.grid.uDiv).outerHeight());
                                t.grid.fhDiv = e('<div style="position:absolute;left:0px;top:' + n + "px;height:" + l + 'px;" class="frozen-div ui-state-default ui-jqgrid-hdiv"></div>');
                                t.grid.fbDiv = e('<div style="position:absolute;left:0px;top:' + (parseInt(n, 10) + parseInt(l, 10) + 1) + 'px;overflow-y:hidden" class="frozen-bdiv ui-jqgrid-bdiv"></div>');
                                e("#gview_" + e.jgrid.jqID(t.p.id)).append(t.grid.fhDiv);
                                var d = e(".ui-jqgrid-htable", "#gview_" + e.jgrid.jqID(t.p.id)).clone(!0);
                                if (t.p.groupHeader) {
                                    e("tr.jqg-first-row-header, tr.jqg-third-row-header", d).each(function () {
                                        e("th:gt(" + s + ")", this).remove()
                                    });
                                    var c, u, p = -1,
                                        h = -1;
                                    e("tr.jqg-second-row-header th", d).each(function () {
                                        c = parseInt(e(this).attr("colspan"), 10);
                                        u = parseInt(e(this).attr("rowspan"), 10);
                                        if (u) {
                                            p++;
                                            h++
                                        }
                                        if (c) {
                                            p += c;
                                            h++
                                        }
                                        return p === s ? !1 : void 0
                                    });
                                    p !== s && (h = s);
                                    e("tr.jqg-second-row-header", d).each(function () {
                                        e("th:gt(" + h + ")", this).remove()
                                    })
                                } else e("tr", d).each(function () {
                                    e("th:gt(" + s + ")", this).remove()
                                });
                                e(d).width(1);
                                e(t.grid.fhDiv).append(d).mousemove(function (e) {
                                    if (t.grid.resizing) {
                                        t.grid.dragMove(e);
                                        return !1
                                    }
                                });
                                if (t.p.footerrow) {
                                    var f = e(".ui-jqgrid-bdiv", "#gview_" + e.jgrid.jqID(t.p.id)).height();
                                    t.grid.fsDiv = e('<div style="position:absolute;left:0px;top:' + (parseInt(n, 10) + parseInt(l, 10) + parseInt(f, 10) + 1) + 'px;" class="frozen-sdiv ui-jqgrid-sdiv"></div>');
                                    e("#gview_" + e.jgrid.jqID(t.p.id)).append(t.grid.fsDiv);
                                    var g = e(".ui-jqgrid-ftable", "#gview_" + e.jgrid.jqID(t.p.id)).clone(!0);
                                    e("tr", g).each(function () {
                                        e("td:gt(" + s + ")", this).remove()
                                    });
                                    e(g).width(1);
                                    e(t.grid.fsDiv).append(g)
                                }
                                e(t).bind("jqGridResizeStop.setFrozenColumns", function (i, r, a) {
                                    var s = e(".ui-jqgrid-htable", t.grid.fhDiv);
                                    e("th:eq(" + a + ")", s).width(r);
                                    var o = e(".ui-jqgrid-btable", t.grid.fbDiv);
                                    e("tr:first td:eq(" + a + ")", o).width(r);
                                    if (t.p.footerrow) {
                                        var n = e(".ui-jqgrid-ftable", t.grid.fsDiv);
                                        e("tr:first td:eq(" + a + ")", n).width(r)
                                    }
                                });
                                e(t).bind("jqGridSortCol.setFrozenColumns", function (i, r, a) {
                                    var s = e("tr.ui-jqgrid-labels:last th:eq(" + t.p.lastsort + ")", t.grid.fhDiv),
                                        o = e("tr.ui-jqgrid-labels:last th:eq(" + a + ")", t.grid.fhDiv);
                                    e("span.ui-grid-ico-sort", s).addClass("ui-state-disabled");
                                    e(s).attr("aria-selected", "false");
                                    e("span.ui-icon-" + t.p.sortorder, o).removeClass("ui-state-disabled");
                                    e(o).attr("aria-selected", "true");
                                    if (!t.p.viewsortcols[0] && t.p.lastsort !== a) {
                                        e("span.s-ico", s).hide();
                                        e("span.s-ico", o).show()
                                    }
                                });
                                e("#gview_" + e.jgrid.jqID(t.p.id)).append(t.grid.fbDiv);
                                e(t.grid.bDiv).scroll(function () {
                                    e(t.grid.fbDiv).scrollTop(e(this).scrollTop())
                                });
                                t.p.hoverrows === !0 && e("#" + e.jgrid.jqID(t.p.id)).unbind("mouseover").unbind("mouseout");
                                e(t).bind("jqGridAfterGridComplete.setFrozenColumns", function () {
                                    e("#" + e.jgrid.jqID(t.p.id) + "_frozen").remove();
                                    e(t.grid.fbDiv).height(e(t.grid.bDiv).height() - 16);
                                    var i = e("#" + e.jgrid.jqID(t.p.id)).clone(!0);
                                    e("tr[role=row]", i).each(function () {
                                        e("td[role=gridcell]:gt(" + s + ")", this).remove()
                                    });
                                    e(i).width(1).attr("id", t.p.id + "_frozen");
                                    e(t.grid.fbDiv).append(i);
                                    if (t.p.hoverrows === !0) {
                                        e("tr.jqgrow", i).hover(function () {
                                            e(this).addClass("ui-state-hover");
                                            e("#" + e.jgrid.jqID(this.id), "#" + e.jgrid.jqID(t.p.id)).addClass("ui-state-hover")
                                        }, function () {
                                            e(this).removeClass("ui-state-hover");
                                            e("#" + e.jgrid.jqID(this.id), "#" + e.jgrid.jqID(t.p.id)).removeClass("ui-state-hover")
                                        });
                                        e("tr.jqgrow", "#" + e.jgrid.jqID(t.p.id)).hover(function () {
                                            e(this).addClass("ui-state-hover");
                                            e("#" + e.jgrid.jqID(this.id), "#" + e.jgrid.jqID(t.p.id) + "_frozen").addClass("ui-state-hover")
                                        }, function () {
                                            e(this).removeClass("ui-state-hover");
                                            e("#" + e.jgrid.jqID(this.id), "#" + e.jgrid.jqID(t.p.id) + "_frozen").removeClass("ui-state-hover")
                                        })
                                    }
                                    i = null
                                });
                                t.grid.hDiv.loading || e(t).triggerHandler("jqGridAfterGridComplete");
                                t.p.frozenColumns = !0
                            }
                        }
                    }
                })
            },
            destroyFrozenColumns: function () {
                return this.each(function () {
                    if (this.grid && this.p.frozenColumns === !0) {
                        var t = this;
                        e(t.grid.fhDiv).remove();
                        e(t.grid.fbDiv).remove();
                        t.grid.fhDiv = null;
                        t.grid.fbDiv = null;
                        if (t.p.footerrow) {
                            e(t.grid.fsDiv).remove();
                            t.grid.fsDiv = null
                        }
                        e(this).unbind(".setFrozenColumns");
                        if (t.p.hoverrows === !0) {
                            var i;
                            e("#" + e.jgrid.jqID(t.p.id)).bind("mouseover", function (t) {
                                i = e(t.target).closest("tr.jqgrow");
                                "ui-subgrid" !== e(i).attr("class") && e(i).addClass("ui-state-hover")
                            }).bind("mouseout", function (t) {
                                i = e(t.target).closest("tr.jqgrow");
                                e(i).removeClass("ui-state-hover")
                            })
                        }
                        this.p.frozenColumns = !1
                    }
                })
            }
        })
    }(jQuery);
!
    function (e) {
        "use strict";
        e.extend(e.jgrid, {
            showModal: function (e) {
                e.w.show()
            },
            closeModal: function (e) {
                e.w.hide().attr("aria-hidden", "true");
                e.o && e.o.remove()
            },
            hideModal: function (t, i) {
                i = e.extend({
                    jqm: !0,
                    gb: ""
                }, i || {});
                if (i.onClose) {
                    var r = i.gb && "string" == typeof i.gb && "#gbox_" === i.gb.substr(0, 6) ? i.onClose.call(e("#" + i.gb.substr(6))[0], t) : i.onClose(t);
                    if ("boolean" == typeof r && !r) return
                }
                if (e.fn.jqm && i.jqm === !0) e(t).attr("aria-hidden", "true").jqmHide();
                else {
                    if ("" !== i.gb) try {
                        e(".jqgrid-overlay:first", i.gb).hide()
                    } catch (a) {}
                    e(t).hide().attr("aria-hidden", "true")
                }
            },
            findPos: function (e) {
                var t = 0,
                    i = 0;
                if (e.offsetParent) do {
                    t += e.offsetLeft;
                    i += e.offsetTop
                } while (e = e.offsetParent);
                return [t, i]
            },
            createModal: function (t, i, r, a, s, o, n) {
                r = e.extend(!0, {}, e.jgrid.jqModal || {}, r);
                var l, d = document.createElement("div"),
                    c = this;
                n = e.extend({}, n || {});
                l = "rtl" === e(r.gbox).attr("dir") ? !0 : !1;
                d.className = "ui-widget ui-widget-content ui-corner-all ui-jqdialog";
                d.id = t.themodal;
                var u = document.createElement("div");
                u.className = "ui-jqdialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix";
                u.id = t.modalhead;
                e(u).append("<span class='ui-jqdialog-title'>" + r.caption + "</span>");
                var p = e("<a href='javascript:void(0)' class='ui-jqdialog-titlebar-close ui-corner-all'></a>").hover(function () {
                    p.addClass("ui-state-hover")
                }, function () {
                    p.removeClass("ui-state-hover")
                }).append("<span class='ui-icon ui-icon-closethick'></span>");
                e(u).append(p);
                if (l) {
                    d.dir = "rtl";
                    e(".ui-jqdialog-title", u).css("float", "right");
                    e(".ui-jqdialog-titlebar-close", u).css("left", "0.3em")
                } else {
                    d.dir = "ltr";
                    e(".ui-jqdialog-title", u).css("float", "left");
                    e(".ui-jqdialog-titlebar-close", u).css("right", "0.3em")
                }
                var h = document.createElement("div");
                e(h).addClass("ui-jqdialog-content ui-widget-content").attr("id", t.modalcontent);
                e(h).append(i);
                d.appendChild(h);
                e(d).prepend(u);
                o === !0 ? e("body").append(d) : "string" == typeof o ? e(o).append(d) : e(d).insertBefore(a);
                e(d).css(n);
                void 0 === r.jqModal && (r.jqModal = !0);
                var f = {};
                if (e.fn.jqm && r.jqModal === !0) {
                    if (0 === r.left && 0 === r.top && r.overlay) {
                        var g = [];
                        g = e.jgrid.findPos(s);
                        r.left = g[0] + 4;
                        r.top = g[1] + 4
                    }
                    f.top = r.top + "px";
                    f.left = r.left
                } else if (0 !== r.left || 0 !== r.top) {
                    f.left = r.left;
                    f.top = r.top + "px"
                }
                e("a.ui-jqdialog-titlebar-close", u).click(function () {
                    var i = e("#" + e.jgrid.jqID(t.themodal)).data("onClose") || r.onClose,
                        a = e("#" + e.jgrid.jqID(t.themodal)).data("gbox") || r.gbox;
                    c.hideModal("#" + e.jgrid.jqID(t.themodal), {
                        gb: a,
                        jqm: r.jqModal,
                        onClose: i
                    });
                    return !1
                });
                0 !== r.width && r.width || (r.width = 300);
                0 !== r.height && r.height || (r.height = 200);
                if (!r.zIndex) {
                    var m = e(a).parents("*[role=dialog]").filter(":first").css("z-index");
                    r.zIndex = m ? parseInt(m, 10) + 2 : 950
                }
                var v = 0;
                if (l && f.left && !o) {
                    v = e(r.gbox).width() - (isNaN(r.width) ? 0 : parseInt(r.width, 10)) - 8;
                    f.left = parseInt(f.left, 10) + parseInt(v, 10)
                }
                f.left && (f.left += "px");
                e(d).css(e.extend({
                    width: isNaN(r.width) ? "auto" : r.width + "px",
                    height: isNaN(r.height) ? "auto" : r.height + "px",
                    zIndex: r.zIndex,
                    overflow: "hidden"
                }, f)).attr({
                    tabIndex: "-1",
                    role: "dialog",
                    "aria-labelledby": t.modalhead,
                    "aria-hidden": "true"
                });
                void 0 === r.drag && (r.drag = !0);
                void 0 === r.resize && (r.resize = !0);
                if (r.drag) {
                    e(u).css("cursor", "move");
                    if (e.fn.jqDrag) e(d).jqDrag(u);
                    else try {
                        e(d).draggable({
                            handle: e("#" + e.jgrid.jqID(u.id))
                        })
                    } catch (b) {}
                }
                if (r.resize) if (e.fn.jqResize) {
                    e(d).append("<div class='jqResize ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se'></div>");
                    e("#" + e.jgrid.jqID(t.themodal)).jqResize(".jqResize", t.scrollelm ? "#" + e.jgrid.jqID(t.scrollelm) : !1)
                } else try {
                    e(d).resizable({
                        handles: "se, sw",
                        alsoResize: t.scrollelm ? "#" + e.jgrid.jqID(t.scrollelm) : !1
                    })
                } catch (w) {}
                r.closeOnEscape === !0 && e(d).keydown(function (i) {
                    if (27 == i.which) {
                        var a = e("#" + e.jgrid.jqID(t.themodal)).data("onClose") || r.onClose;
                        c.hideModal("#" + e.jgrid.jqID(t.themodal), {
                            gb: r.gbox,
                            jqm: r.jqModal,
                            onClose: a
                        })
                    }
                })
            },
            viewModal: function (t, i) {
                i = e.extend({
                    toTop: !0,
                    overlay: 10,
                    modal: !1,
                    overlayClass: "ui-widget-overlay",
                    onShow: e.jgrid.showModal,
                    onHide: e.jgrid.closeModal,
                    gbox: "",
                    jqm: !0,
                    jqM: !0
                }, i || {});
                if (e.fn.jqm && i.jqm === !0) i.jqM ? e(t).attr("aria-hidden", "false").jqm(i).jqmShow() : e(t).attr("aria-hidden", "false").jqmShow();
                else {
                    if ("" !== i.gbox) {
                        e(".jqgrid-overlay:first", i.gbox).show();
                        e(t).data("gbox", i.gbox)
                    }
                    e(t).show().attr("aria-hidden", "false");
                    try {
                        e(":input:visible", t)[0].focus()
                    } catch (r) {}
                }
            },
            info_dialog: function (t, i, r, a) {
                var s = {
                    width: 290,
                    height: "auto",
                    dataheight: "auto",
                    drag: !0,
                    resize: !1,
                    left: 250,
                    top: 170,
                    zIndex: 1e3,
                    jqModal: !0,
                    modal: !1,
                    closeOnEscape: !0,
                    align: "center",
                    buttonalign: "center",
                    buttons: []
                };
                e.extend(!0, s, e.jgrid.jqModal || {}, {
                    caption: "<b>" + t + "</b>"
                }, a || {});
                var o = s.jqModal,
                    n = this;
                e.fn.jqm && !o && (o = !1);
                var l, d = "";
                if (s.buttons.length > 0) for (l = 0; l < s.buttons.length; l++) {
                    void 0 === s.buttons[l].id && (s.buttons[l].id = "info_button_" + l);
                    d += "<a href='javascript:void(0)' id='" + s.buttons[l].id + "' class='fm-button ui-state-default ui-corner-all'>" + s.buttons[l].text + "</a>"
                }
                var c = isNaN(s.dataheight) ? s.dataheight : s.dataheight + "px",
                    u = "text-align:" + s.align + ";",
                    p = "<div id='info_id'>";
                p += "<div id='infocnt' style='margin:0px;padding-bottom:1em;width:100%;overflow:auto;position:relative;height:" + c + ";" + u + "'>" + i + "</div>";
                p += r ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + s.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'><a href='javascript:void(0)' id='closedialog' class='fm-button ui-state-default ui-corner-all'>" + r + "</a>" + d + "</div>" : "" !== d ? "<div class='ui-widget-content ui-helper-clearfix' style='text-align:" + s.buttonalign + ";padding-bottom:0.8em;padding-top:0.5em;background-image: none;border-width: 1px 0 0 0;'>" + d + "</div>" : "";
                p += "</div>";
                try {
                    "false" === e("#info_dialog").attr("aria-hidden") && e.jgrid.hideModal("#info_dialog", {
                        jqm: o
                    });
                    e("#info_dialog").remove()
                } catch (h) {}
                e.jgrid.createModal({
                    themodal: "info_dialog",
                    modalhead: "info_head",
                    modalcontent: "info_content",
                    scrollelm: "infocnt"
                }, p, s, "", "", !0);
                d && e.each(s.buttons, function (t) {
                    e("#" + e.jgrid.jqID(this.id), "#info_id").bind("click", function () {
                        s.buttons[t].onClick.call(e("#info_dialog"));
                        return !1
                    })
                });
                e("#closedialog", "#info_id").click(function () {
                    n.hideModal("#info_dialog", {
                        jqm: o,
                        onClose: e("#info_dialog").data("onClose") || s.onClose,
                        gb: e("#info_dialog").data("gbox") || s.gbox
                    });
                    return !1
                });
                e(".fm-button", "#info_dialog").hover(function () {
                    e(this).addClass("ui-state-hover")
                }, function () {
                    e(this).removeClass("ui-state-hover")
                });
                e.isFunction(s.beforeOpen) && s.beforeOpen();
                e.jgrid.viewModal("#info_dialog", {
                    onHide: function (e) {
                        e.w.hide().remove();
                        e.o && e.o.remove()
                    },
                    modal: s.modal,
                    jqm: o
                });
                e.isFunction(s.afterOpen) && s.afterOpen();
                try {
                    e("#info_dialog").focus()
                } catch (f) {}
            },
            bindEv: function (t, i) {
                var r = this;
                e.isFunction(i.dataInit) && i.dataInit.call(r, t);
                i.dataEvents && e.each(i.dataEvents, function () {
                    void 0 !== this.data ? e(t).bind(this.type, this.data, this.fn) : e(t).bind(this.type, this.fn)
                })
            },
            createEl: function (t, i, r, a, s) {
                function o(t, i, r) {
                    var a = ["dataInit", "dataEvents", "dataUrl", "buildSelect", "sopt", "searchhidden", "defaultValue", "attr", "custom_element", "custom_value"];
                    void 0 !== r && e.isArray(r) && e.merge(a, r);
                    e.each(i, function (i, r) {
                        -1 === e.inArray(i, a) && e(t).attr(i, r)
                    });
                    i.hasOwnProperty("id") || e(t).attr("id", e.jgrid.randId())
                }
                var n = "",
                    l = this;
                switch (t) {
                    case "textarea":
                        n = document.createElement("textarea");
                        a ? i.cols || e(n).css({
                            width: "98%"
                        }) : i.cols || (i.cols = 20);
                        i.rows || (i.rows = 2);
                        ("&nbsp;" === r || "&#160;" === r || 1 === r.length && 160 === r.charCodeAt(0)) && (r = "");
                        n.value = r;
                        o(n, i);
                        e(n).attr({
                            role: "textbox",
                            multiline: "true"
                        });
                        break;
                    case "checkbox":
                        n = document.createElement("input");
                        n.type = "checkbox";
                        if (i.value) {
                            var d = i.value.split(":");
                            if (r === d[0]) {
                                n.checked = !0;
                                n.defaultChecked = !0
                            }
                            n.value = d[0];
                            e(n).attr("offval", d[1])
                        } else {
                            var c = r.toLowerCase();
                            if (c.search(/(false|f|0|no|n|off|undefined)/i) < 0 && "" !== c) {
                                n.checked = !0;
                                n.defaultChecked = !0;
                                n.value = r
                            } else n.value = "on";
                            e(n).attr("offval", "off")
                        }
                        o(n, i, ["value"]);
                        e(n).attr("role", "checkbox");
                        break;
                    case "select":
                        n = document.createElement("select");
                        n.setAttribute("role", "select");
                        var u, p = [];
                        if (i.multiple === !0) {
                            u = !0;
                            n.multiple = "multiple";
                            e(n).attr("aria-multiselectable", "true")
                        } else u = !1;
                        if (void 0 !== i.dataUrl) {
                            var h = i.name ? String(i.id).substring(0, String(i.id).length - String(i.name).length - 1) : String(i.id),
                                f = i.postData || s.postData;
                            l.p && l.p.idPrefix && (h = e.jgrid.stripPref(l.p.idPrefix, h));
                            e.ajax(e.extend({
                                url: e.isFunction(i.dataUrl) ? i.dataUrl.call(l, h, r, String(i.name)) : i.dataUrl,
                                type: "GET",
                                dataType: "html",
                                data: e.isFunction(f) ? f.call(l, h, r, String(i.name)) : f,
                                context: {
                                    elem: n,
                                    options: i,
                                    vl: r
                                },
                                success: function (t) {
                                    var i = [],
                                        r = this.elem,
                                        a = this.vl,
                                        s = e.extend({}, this.options),
                                        n = s.multiple === !0,
                                        d = e.isFunction(s.buildSelect) ? s.buildSelect.call(l, t) : t;
                                    "string" == typeof d && (d = e(e.trim(d)).html());
                                    if (d) {
                                        e(r).append(d);
                                        o(r, s, f ? ["postData"] : void 0);
                                        void 0 === s.size && (s.size = n ? 3 : 1);
                                        if (n) {
                                            i = a.split(",");
                                            i = e.map(i, function (t) {
                                                return e.trim(t)
                                            })
                                        } else i[0] = e.trim(a);
                                        setTimeout(function () {
                                            e("option", r).each(function (t) {
                                                0 === t && r.multiple && (this.selected = !1);
                                                e(this).attr("role", "option");
                                                (e.inArray(e.trim(e(this).text()), i) > -1 || e.inArray(e.trim(e(this).val()), i) > -1) && (this.selected = "selected")
                                            })
                                        }, 0)
                                    }
                                }
                            }, s || {}))
                        } else if (i.value) {
                            var g;
                            void 0 === i.size && (i.size = u ? 3 : 1);
                            if (u) {
                                p = r.split(",");
                                p = e.map(p, function (t) {
                                    return e.trim(t)
                                })
                            }
                            "function" == typeof i.value && (i.value = i.value());
                            var m, v, b, w = void 0 === i.separator ? ":" : i.separator,
                                y = void 0 === i.delimiter ? ";" : i.delimiter;
                            if ("string" == typeof i.value) {
                                m = i.value.split(y);
                                for (g = 0; g < m.length; g++) {
                                    v = m[g].split(w);
                                    v.length > 2 && (v[1] = e.map(v, function (e, t) {
                                        return t > 0 ? e : void 0
                                    }).join(w));
                                    b = document.createElement("option");
                                    b.setAttribute("role", "option");
                                    b.value = v[0];
                                    b.innerHTML = v[1];
                                    n.appendChild(b);
                                    u || e.trim(v[0]) !== e.trim(r) && e.trim(v[1]) !== e.trim(r) || (b.selected = "selected");
                                    u && (e.inArray(e.trim(v[1]), p) > -1 || e.inArray(e.trim(v[0]), p) > -1) && (b.selected = "selected")
                                }
                            } else if ("object" == typeof i.value) {
                                var C, D = i.value;
                                for (C in D) if (D.hasOwnProperty(C)) {
                                    b = document.createElement("option");
                                    b.setAttribute("role", "option");
                                    b.value = C;
                                    b.innerHTML = D[C];
                                    n.appendChild(b);
                                    u || e.trim(C) !== e.trim(r) && e.trim(D[C]) !== e.trim(r) || (b.selected = "selected");
                                    u && (e.inArray(e.trim(D[C]), p) > -1 || e.inArray(e.trim(C), p) > -1) && (b.selected = "selected")
                                }
                            }
                            o(n, i, ["value"])
                        }
                        break;
                    case "text":
                    case "password":
                    case "button":
                        var j;
                        j = "button" === t ? "button" : "textbox";
                        n = document.createElement("input");
                        n.type = t;
                        n.value = r;
                        o(n, i);
                        "button" !== t && (a ? i.size || e(n).css({
                            width: "100%"
                        }) : i.size || (i.size = 20));
                        e(n).attr("role", j).addClass(j);
                        break;
                    case "image":
                    case "file":
                        n = document.createElement("input");
                        n.type = t;
                        o(n, i);
                        break;
                    case "custom":
                        n = document.createElement("div");
                        try {
                            if (!e.isFunction(i.custom_element)) throw "e1";
                            var N = i.custom_element.call(l, r, i);
                            if (!N) throw "e2";
                            N = e(N).addClass("customelement").attr({
                                id: i.id,
                                name: i.name
                            });
                            e(n).addClass("pr").empty().append(N);
                            i.trigger && e(n).append('<span class="' + i.trigger + '"></span>')
                        } catch (_) {
                            "e1" === _ && e.jgrid.info_dialog(e.jgrid.errors.errcap, "function 'custom_element' " + e.jgrid.edit.msg.nodefined, e.jgrid.edit.bClose);
                            "e2" === _ ? e.jgrid.info_dialog(e.jgrid.errors.errcap, "function 'custom_element' " + e.jgrid.edit.msg.novalue, e.jgrid.edit.bClose) : e.jgrid.info_dialog(e.jgrid.errors.errcap, "string" == typeof _ ? _ : _.message, e.jgrid.edit.bClose)
                        }
                }
                return n
            },
            checkDate: function (e, t) {
                var i, r = function (e) {
                        return e % 4 !== 0 || e % 100 === 0 && e % 400 !== 0 ? 28 : 29
                    },
                    a = {};
                e = e.toLowerCase();
                i = -1 !== e.indexOf("/") ? "/" : -1 !== e.indexOf("-") ? "-" : -1 !== e.indexOf(".") ? "." : "/";
                e = e.split(i);
                t = t.split(i);
                if (3 !== t.length) return !1;
                var s, o, n = -1,
                    l = -1,
                    d = -1;
                for (o = 0; o < e.length; o++) {
                    var c = isNaN(t[o]) ? 0 : parseInt(t[o], 10);
                    a[e[o]] = c;
                    s = e[o]; - 1 !== s.indexOf("y") && (n = o); - 1 !== s.indexOf("m") && (d = o); - 1 !== s.indexOf("d") && (l = o)
                }
                s = "y" === e[n] || "yyyy" === e[n] ? 4 : "yy" === e[n] ? 2 : -1;
                var u, p = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (-1 === n) return !1;
                u = a[e[n]].toString();
                2 === s && 1 === u.length && (s = 1);
                if (u.length !== s || 0 === a[e[n]] && "00" !== t[n]) return !1;
                if (-1 === d) return !1;
                u = a[e[d]].toString();
                if (u.length < 1 || a[e[d]] < 1 || a[e[d]] > 12) return !1;
                if (-1 === l) return !1;
                u = a[e[l]].toString();
                return u.length < 1 || a[e[l]] < 1 || a[e[l]] > 31 || 2 === a[e[d]] && a[e[l]] > r(a[e[n]]) || a[e[l]] > p[a[e[d]]] ? !1 : !0
            },
            isEmpty: function (e) {
                return e.match(/^\s+$/) || "" === e ? !0 : !1
            },
            checkTime: function (t) {
                var i, r = /^(\d{1,2}):(\d{2})([apAP][Mm])?$/;
                if (!e.jgrid.isEmpty(t)) {
                    i = t.match(r);
                    if (!i) return !1;
                    if (i[3]) {
                        if (i[1] < 1 || i[1] > 12) return !1
                    } else if (i[1] > 23) return !1;
                    if (i[2] > 59) return !1
                }
                return !0
            },
            checkValues: function (t, i, r, a) {
                var s, o, n, l, d, c = this,
                    u = c.p.colModel;
                if (void 0 === r) if ("string" == typeof i) {
                    for (o = 0, d = u.length; d > o; o++) if (u[o].name === i) {
                        s = u[o].editrules;
                        i = o;
                        null != u[o].formoptions && (n = u[o].formoptions.label);
                        break
                    }
                } else i >= 0 && (s = u[i].editrules);
                else {
                    s = r;
                    n = void 0 === a ? "_" : a
                }
                if (s) {
                    n || (n = null != c.p.colNames ? c.p.colNames[i] : u[i].label);
                    if (s.required === !0 && e.jgrid.isEmpty(t)) return [!1, n + ": " + e.jgrid.edit.msg.required, ""];
                    var p = s.required === !1 ? !1 : !0;
                    if (s.number === !0 && (p !== !1 || !e.jgrid.isEmpty(t)) && isNaN(t)) return [!1, n + ": " + e.jgrid.edit.msg.number, ""];
                    if (void 0 !== s.minValue && !isNaN(s.minValue) && parseFloat(t) < parseFloat(s.minValue)) return [!1, n + ": " + e.jgrid.edit.msg.minValue + " " + s.minValue, ""];
                    if (void 0 !== s.maxValue && !isNaN(s.maxValue) && parseFloat(t) > parseFloat(s.maxValue)) return [!1, n + ": " + e.jgrid.edit.msg.maxValue + " " + s.maxValue, ""];
                    var h;
                    if (s.email === !0 && (p !== !1 || !e.jgrid.isEmpty(t))) {
                        h = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
                        if (!h.test(t)) return [!1, n + ": " + e.jgrid.edit.msg.email, ""]
                    }
                    if (s.integer === !0 && (p !== !1 || !e.jgrid.isEmpty(t))) {
                        if (isNaN(t)) return [!1, n + ": " + e.jgrid.edit.msg.integer, ""];
                        if (t % 1 !== 0 || -1 !== t.indexOf(".")) return [!1, n + ": " + e.jgrid.edit.msg.integer, ""]
                    }
                    if (s.date === !0 && (p !== !1 || !e.jgrid.isEmpty(t))) {
                        if (u[i].formatoptions && u[i].formatoptions.newformat) {
                            l = u[i].formatoptions.newformat;
                            e.jgrid.formatter.date.masks.hasOwnProperty(l) && (l = e.jgrid.formatter.date.masks[l])
                        } else l = u[i].datefmt || "Y-m-d";
                        if (!e.jgrid.checkDate(l, t)) return [!1, n + ": " + e.jgrid.edit.msg.date + " - " + l, ""]
                    }
                    if (s.time === !0 && !(p === !1 && e.jgrid.isEmpty(t) || e.jgrid.checkTime(t))) return [!1, n + ": " + e.jgrid.edit.msg.date + " - hh:mm (am/pm)", ""];
                    if (s.url === !0 && (p !== !1 || !e.jgrid.isEmpty(t))) {
                        h = /^(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;
                        if (!h.test(t)) return [!1, n + ": " + e.jgrid.edit.msg.url, ""]
                    }
                    if (s.custom === !0 && (p !== !1 || !e.jgrid.isEmpty(t))) {
                        if (e.isFunction(s.custom_func)) {
                            var f = s.custom_func.call(c, t, n, i);
                            return e.isArray(f) ? f : [!1, e.jgrid.edit.msg.customarray, ""]
                        }
                        return [!1, e.jgrid.edit.msg.customfcheck, ""]
                    }
                }
                return [!0, "", ""]
            }
        })
    }(jQuery);
!
    function (e) {
        "use strict";
        e.jgrid.extend({
            editCell: function (t, i, r) {
                return this.each(function () {
                    var a, s, o, n, l = this;
                    if (l.grid && l.p.cellEdit === !0) {
                        i = parseInt(i, 10);
                        l.p.selrow = l.rows[t].id;
                        l.p.knv || e(l).jqGrid("GridNav");
                        if (l.p.savedRow.length > 0) {
                            if (r === !0 && t == l.p.iRow && i == l.p.iCol) return;
                            e(l).jqGrid("saveCell", l.p.savedRow[0].id, l.p.savedRow[0].ic)
                        } else window.setTimeout(function () {
                            e("#" + e.jgrid.jqID(l.p.knv)).attr("tabindex", "-1").focus()
                        }, 0);
                        n = l.p.colModel[i];
                        a = n.name;
                        if ("subgrid" !== a && "cb" !== a && "rn" !== a) {
                            o = e("td:eq(" + i + ")", l.rows[t]);
                            if (n.editable !== !0 || r !== !0 || o.hasClass("not-editable-cell")) {
                                if (parseInt(l.p.iCol, 10) >= 0 && parseInt(l.p.iRow, 10) >= 0) {
                                    e("td:eq(" + l.p.iCol + ")", l.rows[l.p.iRow]).removeClass("edit-cell ui-state-highlight");
                                    e(l.rows[l.p.iRow]).removeClass("selected-row ui-state-hover")
                                }
                                o.addClass("edit-cell ui-state-highlight");
                                e(l.rows[t]).addClass("selected-row ui-state-hover");
                                s = o.html().replace(/\&#160\;/gi, "");
                                e(l).triggerHandler("jqGridSelectCell", [l.rows[t].id, a, s, t, i]);
                                e.isFunction(l.p.onSelectCell) && l.p.onSelectCell.call(l, l.rows[t].id, a, s, t, i)
                            } else {
                                if (parseInt(l.p.iCol, 10) >= 0 && parseInt(l.p.iRow, 10) >= 0) {
                                    e("td:eq(" + l.p.iCol + ")", l.rows[l.p.iRow]).removeClass("edit-cell ui-state-highlight");
                                    e(l.rows[l.p.iRow]).removeClass("selected-row ui-state-hover")
                                }
                                e(o).addClass("edit-cell ui-state-highlight");
                                e(l.rows[t]).addClass("selected-row ui-state-hover");
                                try {
                                    s = e.unformat.call(l, o, {
                                        rowId: l.rows[t].id,
                                        colModel: n
                                    }, i)
                                } catch (d) {
                                    s = n.edittype && "textarea" === n.edittype ? e(o).text() : e(o).html()
                                }
                                l.p.autoencode && (s = e.jgrid.htmlDecode(s));
                                n.edittype || (n.edittype = "text");
                                l.p.savedRow.push({
                                    id: t,
                                    ic: i,
                                    name: a,
                                    v: s
                                });
                                ("&nbsp;" === s || "&#160;" === s || 1 === s.length && 160 === s.charCodeAt(0)) && (s = "");
                                if (e.isFunction(l.p.formatCell)) {
                                    var c = l.p.formatCell.call(l, l.rows[t].id, a, s, t, i);
                                    void 0 !== c && (s = c)
                                }
                                var u = e.extend({}, n.editoptions || {}, {
                                        id: t + "_" + a,
                                        name: a
                                    }),
                                    p = e.jgrid.createEl.call(l, n.edittype, u, s, !0, e.extend({}, e.jgrid.ajaxOptions, l.p.ajaxSelectOptions || {}));
                                e(l).triggerHandler("jqGridBeforeEditCell", [l.rows[t].id, a, s, t, i]);
                                e.isFunction(l.p.beforeEditCell) && l.p.beforeEditCell.call(l, l.rows[t].id, a, s, t, i);
                                e(o).html("").append(p).attr("tabindex", "0");
                                e.jgrid.bindEv.call(l, p, u);
                                window.setTimeout(function () {
                                    e.isFunction(u.custom_element) ? e(":input", p).select().focus() : e(p).select().focus()
                                }, 20);
                                e("input, select, textarea", o).unbind("keydown.once").bind("keydown.once", function (r) {
                                    27 === r.keyCode && (e("input.hasDatepicker", o).length > 0 ? e(".ui-datepicker").is(":hidden") ? e(l).jqGrid("restoreCell", t, i) : e("input.hasDatepicker", o).datepicker("hide") : e(l).jqGrid("restoreCell", t, i));
                                    if (13 === r.keyCode) {
                                        if (l.grid.hDiv.loading) return !1;
                                        e(l).jqGrid("nextCell", t, i)
                                    }
                                    if (9 === r.keyCode) {
                                        if (l.grid.hDiv.loading) return !1;
                                        r.shiftKey ? e(l).jqGrid("prevCell", t, i) : e(l).jqGrid("nextCell", t, i)
                                    }
                                    r.stopPropagation()
                                }).bind("focus.once", function () {
                                    curRow = t;
                                    curCol = i
                                });
                                e(l).triggerHandler("jqGridAfterEditCell", [l.rows[t].id, a, s, t, i]);
                                e.isFunction(l.p.afterEditCell) && l.p.afterEditCell.call(l, l.rows[t].id, a, s, t, i)
                            }
                            l.p.iCol = i;
                            l.p.iRow = t
                        }
                    }
                })
            },
            saveCell: function (t, i) {
                return this.each(function () {
                    var r, a = this;
                    if (a.grid && a.p.cellEdit === !0) {
                        r = a.p.savedRow.length >= 1 ? 0 : null;
                        if (null !== r) {
                            var s, o, n = e("td:eq(" + i + ")", a.rows[t]),
                                l = a.p.colModel[i],
                                d = l.name,
                                c = e.jgrid.jqID(d);
                            switch (l.edittype) {
                                case "select":
                                    if (l.editoptions.multiple) {
                                        var u = e("#" + t + "_" + c, a.rows[t]),
                                            p = [];
                                        s = e(u).val();
                                        s ? s.join(",") : s = "";
                                        e("option:selected", u).each(function (t, i) {
                                            p[t] = e(i).text()
                                        });
                                        o = p.join(",")
                                    } else {
                                        s = e("#" + t + "_" + c + " option:selected", a.rows[t]).val();
                                        o = e("#" + t + "_" + c + " option:selected", a.rows[t]).text()
                                    }
                                    l.formatter && (o = s);
                                    break;
                                case "checkbox":
                                    var h = ["Yes", "No"];
                                    l.editoptions && (h = l.editoptions.value.split(":"));
                                    s = e("#" + t + "_" + c, a.rows[t]).is(":checked") ? h[0] : h[1];
                                    o = s;
                                    break;
                                case "password":
                                case "text":
                                case "textarea":
                                case "button":
                                    s = e("#" + t + "_" + c, a.rows[t]).val();
                                    o = s;
                                    break;
                                case "custom":
                                    try {
                                        if (!l.editoptions || !e.isFunction(l.editoptions.custom_value)) throw "e1";
                                        s = l.editoptions.custom_value.call(a, e(".customelement", n), "get");
                                        if (void 0 === s) throw "e2";
                                        o = s
                                    } catch (f) {
                                        "e1" === f && e.jgrid.info_dialog(e.jgrid.errors.errcap, "function 'custom_value' " + e.jgrid.edit.msg.nodefined, e.jgrid.edit.bClose);
                                        "e2" === f ? e.jgrid.info_dialog(e.jgrid.errors.errcap, "function 'custom_value' " + e.jgrid.edit.msg.novalue, e.jgrid.edit.bClose) : e.jgrid.info_dialog(e.jgrid.errors.errcap, f.message, e.jgrid.edit.bClose)
                                    }
                            }
                            if (o !== a.p.savedRow[r].v) {
                                var g = e(a).triggerHandler("jqGridBeforeSaveCell", [a.rows[t].id, d, s, t, i]);
                                if (g) {
                                    s = g;
                                    o = g
                                }
                                if (e.isFunction(a.p.beforeSaveCell)) {
                                    var m = a.p.beforeSaveCell.call(a, a.rows[t].id, d, s, t, i);
                                    if (m) {
                                        s = m;
                                        o = m
                                    }
                                }
                                var v = e.jgrid.checkValues.call(a, s, i);
                                if (v[0] === !0) {
                                    var b = e(a).triggerHandler("jqGridBeforeSubmitCell", [a.rows[t].id, d, s, t, i]) || {};
                                    if (e.isFunction(a.p.beforeSubmitCell)) {
                                        b = a.p.beforeSubmitCell.call(a, a.rows[t].id, d, s, t, i);
                                        b || (b = {})
                                    }
                                    e("input.hasDatepicker", n).length > 0 && e("input.hasDatepicker", n).datepicker("hide");
                                    if ("remote" === a.p.cellsubmit) if (a.p.cellurl) {
                                        var w = {};
                                        a.p.autoencode && (s = e.jgrid.htmlEncode(s));
                                        w[d] = s;
                                        var y, C, j;
                                        j = a.p.prmNames;
                                        y = j.id;
                                        C = j.oper;
                                        w[y] = e.jgrid.stripPref(a.p.idPrefix, a.rows[t].id);
                                        w[C] = j.editoper;
                                        w = e.extend(b, w);
                                        e("#lui_" + e.jgrid.jqID(a.p.id)).show();
                                        a.grid.hDiv.loading = !0;
                                        e.ajax(e.extend({
                                            url: a.p.cellurl,
                                            data: e.isFunction(a.p.serializeCellData) ? a.p.serializeCellData.call(a, w) : w,
                                            type: "POST",
                                            complete: function (r, l) {
                                                e("#lui_" + a.p.id).hide();
                                                a.grid.hDiv.loading = !1;
                                                if ("success" === l) {
                                                    var c = e(a).triggerHandler("jqGridAfterSubmitCell", [a, r, w.id, d, s, t, i]) || [!0, ""];
                                                    c[0] === !0 && e.isFunction(a.p.afterSubmitCell) && (c = a.p.afterSubmitCell.call(a, r, w.id, d, s, t, i));
                                                    if (c[0] === !0) {
                                                        e(n).empty();
                                                        e(a).jqGrid("setCell", a.rows[t].id, i, o, !1, !1, !0);
                                                        e(n).addClass("dirty-cell");
                                                        e(a.rows[t]).addClass("edited");
                                                        e(a).triggerHandler("jqGridAfterSaveCell", [a.rows[t].id, d, s, t, i]);
                                                        e.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[t].id, d, s, t, i);
                                                        a.p.savedRow.splice(0, 1)
                                                    } else {
                                                        e.jgrid.info_dialog(e.jgrid.errors.errcap, c[1], e.jgrid.edit.bClose);
                                                        e(a).jqGrid("restoreCell", t, i)
                                                    }
                                                }
                                            },
                                            error: function (r, s, o) {
                                                e("#lui_" + e.jgrid.jqID(a.p.id)).hide();
                                                a.grid.hDiv.loading = !1;
                                                e(a).triggerHandler("jqGridErrorCell", [r, s, o]);
                                                if (e.isFunction(a.p.errorCell)) {
                                                    a.p.errorCell.call(a, r, s, o);
                                                    e(a).jqGrid("restoreCell", t, i)
                                                } else {
                                                    e.jgrid.info_dialog(e.jgrid.errors.errcap, r.status + " : " + r.statusText + "<br/>" + s, e.jgrid.edit.bClose);
                                                    e(a).jqGrid("restoreCell", t, i)
                                                }
                                            }
                                        }, e.jgrid.ajaxOptions, a.p.ajaxCellOptions || {}))
                                    } else try {
                                        e.jgrid.info_dialog(e.jgrid.errors.errcap, e.jgrid.errors.nourl, e.jgrid.edit.bClose);
                                        e(a).jqGrid("restoreCell", t, i)
                                    } catch (f) {}
                                    if ("clientArray" === a.p.cellsubmit) {
                                        "custom" === l.edittype && e.isFunction(l.editoptions.handle) && l.editoptions.handle();
                                        e(n).empty();
                                        e(a).jqGrid("setCell", a.rows[t].id, i, o, !1, !1, !0);
                                        e(n).addClass("dirty-cell");
                                        e(a.rows[t]).addClass("edited");
                                        e(a).triggerHandler("jqGridAfterSaveCell", [a.rows[t].id, d, s, t, i]);
                                        e.isFunction(a.p.afterSaveCell) && a.p.afterSaveCell.call(a, a.rows[t].id, d, s, t, i);
                                        a.p.savedRow.splice(0, 1)
                                    }
                                } else try {
                                    window.setTimeout(function () {
                                        e.jgrid.info_dialog(e.jgrid.errors.errcap, s + " " + v[1], e.jgrid.edit.bClose)
                                    }, 100);
                                    e(a).jqGrid("restoreCell", t, i)
                                } catch (f) {}
                            } else e(a).jqGrid("restoreCell", t, i)
                        }
                        window.setTimeout(function () {
                            e("#" + e.jgrid.jqID(a.p.knv)).attr("tabindex", "-1");
                            e("td:eq(" + a.p.iCol + ")", a.rows[a.p.iRow]).removeClass("edit-cell ui-state-highlight")
                        }, 0)
                    }
                })
            },
            restoreCell: function (t, i) {
                return this.each(function () {
                    var r, a = this,
                        s = a.p.colModel[i];
                    if (a.grid && a.p.cellEdit === !0) {
                        r = a.p.savedRow.length >= 1 ? 0 : null;
                        if (null !== r) {
                            var o = e("td:eq(" + i + ")", a.rows[t]);
                            if (e.isFunction(e.fn.datepicker)) try {
                                e("input.hasDatepicker", o).datepicker("hide")
                            } catch (n) {}
                            "custom" === s.edittype && e.isFunction(s.editoptions.handle) && s.editoptions.handle();
                            e(o).empty().attr("tabindex", "-1");
                            e(a).jqGrid("setCell", a.rows[t].id, i, a.p.savedRow[r].v, !1, !1, !0);
                            e(a).triggerHandler("jqGridAfterRestoreCell", [a.rows[t].id, a.p.savedRow[r].v, t, i]);
                            e.isFunction(a.p.afterRestoreCell) && a.p.afterRestoreCell.call(a, a.rows[t].id, a.p.savedRow[r].v, t, i);
                            a.p.savedRow.splice(0, 1)
                        }
                        window.setTimeout(function () {
                            e("#" + a.p.knv).attr("tabindex", "-1");
                            e("td:eq(" + a.p.iCol + ")", a.rows[a.p.iRow]).removeClass("edit-cell ui-state-highlight")
                        }, 0)
                    }
                })
            },
            nextCell: function (t, i) {
                return this.each(function () {
                    var r, a = this,
                        s = !1;
                    if (a.grid && a.p.cellEdit === !0) {
                        for (r = i + 1; r < a.p.colModel.length; r++) if (a.p.colModel[r].editable === !0) {
                            s = r;
                            break
                        }
                        if (r === a.p.colModel.length) {
                            t += 1;
                            if (0 === e(a).find("tbody tr").eq(t).length) {
                                if (a.p.triggerAdd === !1) {
                                    t -= 1;
                                    e(a).jqGrid("saveCell", t, i);
                                    return
                                }
                                if (THISPAGE.newId) {
                                    e(a).jqGrid("addRowData", THISPAGE.newId, {
                                        id: THISPAGE.newId
                                    }, "last");
                                    THISPAGE.newId++
                                } else e(a).jqGrid("addRowData", t, {}, "last")
                            }
                            for (r = 0; r < a.p.colModel.length; r++) if (a.p.colModel[r].editable === !0) {
                                s = r;
                                break
                            }
                        }
                        s !== !1 ? e(a).jqGrid("editCell", t, s, !0) : a.p.savedRow.length > 0 && e(a).jqGrid("saveCell", t, i)
                    }
                })
            },
            prevCell: function (t, i) {
                return this.each(function () {
                    var r, a = this,
                        s = !1;
                    if (a.grid && a.p.cellEdit === !0) {
                        for (r = i - 1; r >= 0; r--) if (a.p.colModel[r].editable === !0) {
                            s = r;
                            break
                        }
                        s !== !1 ? e(a).jqGrid("editCell", t, s, !0) : a.p.savedRow.length > 0 && e(a).jqGrid("saveCell", t, i)
                    }
                })
            },
            GridNav: function () {
                return this.each(function () {
                    function t(t, i, a) {
                        if ("v" === a.substr(0, 1)) {
                            var s = e(r.grid.bDiv)[0].clientHeight,
                                o = e(r.grid.bDiv)[0].scrollTop,
                                n = r.rows[t].offsetTop + r.rows[t].clientHeight,
                                l = r.rows[t].offsetTop;
                            "vd" === a && n >= s && (e(r.grid.bDiv)[0].scrollTop = e(r.grid.bDiv)[0].scrollTop + r.rows[t].clientHeight);
                            "vu" === a && o > l && (e(r.grid.bDiv)[0].scrollTop = e(r.grid.bDiv)[0].scrollTop - r.rows[t].clientHeight)
                        }
                        if ("h" === a) {
                            var d = e(r.grid.bDiv)[0].clientWidth,
                                c = e(r.grid.bDiv)[0].scrollLeft,
                                u = r.rows[t].cells[i].offsetLeft + r.rows[t].cells[i].clientWidth,
                                p = r.rows[t].cells[i].offsetLeft;
                            u >= d + parseInt(c, 10) ? e(r.grid.bDiv)[0].scrollLeft = e(r.grid.bDiv)[0].scrollLeft + r.rows[t].cells[i].clientWidth : c > p && (e(r.grid.bDiv)[0].scrollLeft = e(r.grid.bDiv)[0].scrollLeft - r.rows[t].cells[i].clientWidth)
                        }
                    }
                    function i(e, t) {
                        var i, a;
                        if ("lft" === t) {
                            i = e + 1;
                            for (a = e; a >= 0; a--) if (r.p.colModel[a].hidden !== !0) {
                                i = a;
                                break
                            }
                        }
                        if ("rgt" === t) {
                            i = e - 1;
                            for (a = e; a < r.p.colModel.length; a++) if (r.p.colModel[a].hidden !== !0) {
                                i = a;
                                break
                            }
                        }
                        return i
                    }
                    var r = this;
                    if (r.grid && r.p.cellEdit === !0) {
                        r.p.knv = r.p.id + "_kn";
                        var a, s, o = e("<div style='position:fixed;top:0px;width:1px;height:1px;' tabindex='0'><div tabindex='-1' style='width:1px;height:1px;' id='" + r.p.knv + "'></div></div>");
                        e(o).insertBefore(r.grid.cDiv);
                        e("#" + r.p.knv).focus().keydown(function (o) {
                            s = o.keyCode;
                            "rtl" === r.p.direction && (37 === s ? s = 39 : 39 === s && (s = 37));
                            switch (s) {
                                case 38:
                                    if (r.p.iRow - 1 > 0) {
                                        t(r.p.iRow - 1, r.p.iCol, "vu");
                                        e(r).jqGrid("editCell", r.p.iRow - 1, r.p.iCol, !1)
                                    }
                                    break;
                                case 40:
                                    if (r.p.iRow + 1 <= r.rows.length - 1) {
                                        t(r.p.iRow + 1, r.p.iCol, "vd");
                                        e(r).jqGrid("editCell", r.p.iRow + 1, r.p.iCol, !1)
                                    }
                                    break;
                                case 37:
                                    if (r.p.iCol - 1 >= 0) {
                                        a = i(r.p.iCol - 1, "lft");
                                        t(r.p.iRow, a, "h");
                                        e(r).jqGrid("editCell", r.p.iRow, a, !1)
                                    }
                                    break;
                                case 39:
                                    if (r.p.iCol + 1 <= r.p.colModel.length - 1) {
                                        a = i(r.p.iCol + 1, "rgt");
                                        t(r.p.iRow, a, "h");
                                        e(r).jqGrid("editCell", r.p.iRow, a, !1)
                                    }
                                    break;
                                case 13:
                                    parseInt(r.p.iCol, 10) >= 0 && parseInt(r.p.iRow, 10) >= 0 && e(r).jqGrid("editCell", r.p.iRow, r.p.iCol, !0);
                                    break;
                                default:
                                    return !0
                            }
                            return !1
                        })
                    }
                })
            },
            getChangedCells: function (t) {
                var i = [];
                t || (t = "all");
                this.each(function () {
                    var r, a = this;
                    a.grid && a.p.cellEdit === !0 && e(a.rows).each(function (s) {
                        var o = {};
                        if (e(this).hasClass("edited")) {
                            e("td", this).each(function (i) {
                                r = a.p.colModel[i].name;
                                if ("cb" !== r && "subgrid" !== r) if ("dirty" === t) {
                                    if (e(this).hasClass("dirty-cell")) try {
                                        o[r] = e.unformat.call(a, this, {
                                            rowId: a.rows[s].id,
                                            colModel: a.p.colModel[i]
                                        }, i)
                                    } catch (n) {
                                        o[r] = e.jgrid.htmlDecode(e(this).html())
                                    }
                                } else try {
                                    o[r] = e.unformat.call(a, this, {
                                        rowId: a.rows[s].id,
                                        colModel: a.p.colModel[i]
                                    }, i)
                                } catch (n) {
                                    o[r] = e.jgrid.htmlDecode(e(this).html())
                                }
                            });
                            o.id = this.id;
                            i.push(o)
                        }
                    })
                });
                return i
            }
        })
    }(jQuery);
!
    function (e) {
        e.jgrid = e.jgrid || {};
        e.extend(e.jgrid, {
            defaults: {
                recordtext: "{0} - {1}　共 {2} 条",
                emptyrecords: "无数据显示",
                loadtext: "读取中...",
                pgtext: " {0} 共 {1} 页"
            },
            search: {
                caption: "搜索...",
                Find: "查找",
                Reset: "重置",
                odata: [{
                    oper: "eq",
                    text: "等于　　"
                },
                    {
                        oper: "ne",
                        text: "不等　　"
                    },
                    {
                        oper: "lt",
                        text: "小于　　"
                    },
                    {
                        oper: "le",
                        text: "小于等于"
                    },
                    {
                        oper: "gt",
                        text: "大于　　"
                    },
                    {
                        oper: "ge",
                        text: "大于等于"
                    },
                    {
                        oper: "bw",
                        text: "开始于"
                    },
                    {
                        oper: "bn",
                        text: "不开始于"
                    },
                    {
                        oper: "in",
                        text: "属于　　"
                    },
                    {
                        oper: "ni",
                        text: "不属于"
                    },
                    {
                        oper: "ew",
                        text: "结束于"
                    },
                    {
                        oper: "en",
                        text: "不结束于"
                    },
                    {
                        oper: "cn",
                        text: "包含　　"
                    },
                    {
                        oper: "nc",
                        text: "不包含"
                    }],
                groupOps: [{
                    op: "AND",
                    text: "所有"
                },
                    {
                        op: "OR",
                        text: "任一"
                    }]
            },
            edit: {
                addCaption: "添加记录",
                editCaption: "编辑记录",
                bSubmit: "提交",
                bCancel: "取消",
                bClose: "关闭",
                saveData: "数据已改变，是否保存？",
                bYes: "是",
                bNo: "否",
                bExit: "取消",
                msg: {
                    required: "此字段必需",
                    number: "请输入有效数字",
                    minValue: "输值必须大于等于 ",
                    maxValue: "输值必须小于等于 ",
                    email: "这不是有效的e-mail地址",
                    integer: "请输入有效整数",
                    date: "请输入有效时间",
                    url: "无效网址。前缀必须为 ('http://' 或 'https://')",
                    nodefined: " 未定义！",
                    novalue: " 需要返回值！",
                    customarray: "自定义函数需要返回数组！",
                    customfcheck: "Custom function should be present in case of custom checking!"
                }
            },
            view: {
                caption: "查看记录",
                bClose: "关闭"
            },
            del: {
                caption: "删除",
                msg: "删除所选记录？",
                bSubmit: "删除",
                bCancel: "取消"
            },
            nav: {
                edittext: "",
                edittitle: "编辑所选记录",
                addtext: "",
                addtitle: "添加新记录",
                deltext: "",
                deltitle: "删除所选记录",
                searchtext: "",
                searchtitle: "查找",
                refreshtext: "",
                refreshtitle: "刷新表格",
                alertcap: "注意",
                alerttext: "请选择记录",
                viewtext: "",
                viewtitle: "查看所选记录"
            },
            col: {
                caption: "选择列",
                bSubmit: "确定",
                bCancel: "取消"
            },
            errors: {
                errcap: "错误",
                nourl: "没有设置url",
                norecords: "没有要处理的记录",
                model: "colNames 和 colModel 长度不等！"
            },
            formatter: {
                integer: {
                    thousandsSeparator: ",",
                    defaultValue: "&#160;"
                },
                number: {
                    decimalSeparator: ".",
                    thousandsSeparator: ",",
                    decimalPlaces: 2,
                    defaultValue: "&#160;"
                },
                currency: {
                    decimalSeparator: ".",
                    thousandsSeparator: ",",
                    decimalPlaces: 2,
                    prefix: "",
                    suffix: "",
                    defaultValue: "&#160;"
                },
                date: {
                    dayNames: ["日", "一", "二", "三", "四", "五", "六", "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                    monthNames: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    AmPm: ["am", "pm", "上午", "下午"],
                    S: function (e) {
                        return 11 > e || e > 13 ? ["st", "nd", "rd", "th"][Math.min((e - 1) % 10, 3)] : "th"
                    },
                    srcformat: "Y-m-d",
                    newformat: "Y-m-d",
                    parseRe: /[Tt\\\/:_;.,\t\s-]/,
                    masks: {
                        ISO8601Long: "Y-m-d H:i:s",
                        ISO8601Short: "Y-m-d",
                        ShortDate: "n/j/Y",
                        LongDate: "l, F d, Y",
                        FullDateTime: "l, F d, Y g:i:s A",
                        MonthDay: "F d",
                        ShortTime: "g:i A",
                        LongTime: "g:i:s A",
                        SortableDateTime: "Y-m-d\\TH:i:s",
                        UniversalSortableDateTime: "Y-m-d H:i:sO",
                        YearMonth: "F, Y"
                    },
                    reformatAfterEdit: !1
                },
                baseLinkUrl: "",
                showAction: "",
                target: "",
                checkbox: {
                    disabled: !0
                },
                idName: "id"
            }
        })
    }(jQuery);
!
    function (e) {
        "use strict";
        e.fmatter = {};
        e.extend(e.fmatter, {
            isBoolean: function (e) {
                return "boolean" == typeof e
            },
            isObject: function (t) {
                return t && ("object" == typeof t || e.isFunction(t)) || !1
            },
            isString: function (e) {
                return "string" == typeof e
            },
            isNumber: function (e) {
                return "number" == typeof e && isFinite(e)
            },
            isValue: function (e) {
                return this.isObject(e) || this.isString(e) || this.isNumber(e) || this.isBoolean(e)
            },
            isEmpty: function (t) {
                if (!this.isString(t) && this.isValue(t)) return !1;
                if (!this.isValue(t)) return !0;
                t = e.trim(t).replace(/\&nbsp\;/gi, "").replace(/\&#160\;/gi, "");
                return "" === t
            }
        });
        e.fn.fmatter = function (t, i, r, a, o) {
            var s = i;
            r = e.extend({}, e.jgrid.formatter, r);
            try {
                s = e.fn.fmatter[t].call(this, i, r, a, o)
            } catch (n) {}
            return s
        };
        e.fmatter.util = {
            NumberFormat: function (t, i) {
                e.fmatter.isNumber(t) || (t *= 1);
                if (e.fmatter.isNumber(t)) {
                    var r, a = 0 > t,
                        o = String(t),
                        s = i.decimalSeparator || ".";
                    if (e.fmatter.isNumber(i.decimalPlaces)) {
                        var n = i.decimalPlaces,
                            l = Math.pow(10, n);
                        o = String(Math.round(t * l) / l);
                        r = o.lastIndexOf(".");
                        if (n > 0) {
                            if (0 > r) {
                                o += s;
                                r = o.length - 1
                            } else "." !== s && (o = o.replace(".", s));
                            for (; o.length - 1 - r < n;) o += "0"
                        }
                    }
                    if (i.thousandsSeparator) {
                        var d = i.thousandsSeparator;
                        r = o.lastIndexOf(s);
                        r = r > -1 ? r : o.length;
                        var c, u = o.substring(r),
                            p = -1;
                        for (c = r; c > 0; c--) {
                            p++;
                            p % 3 === 0 && c !== r && (!a || c > 1) && (u = d + u);
                            u = o.charAt(c - 1) + u
                        }
                        o = u
                    }
                    o = i.prefix ? i.prefix + o : o;
                    o = i.suffix ? o + i.suffix : o;
                    return o
                }
                return t
            }
        };
        e.fn.fmatter.defaultFormat = function (t, i) {
            return e.fmatter.isValue(t) && "" !== t ? t : i.defaultValue || "&#160;"
        };
        e.fn.fmatter.email = function (t, i) {
            return e.fmatter.isEmpty(t) ? e.fn.fmatter.defaultFormat(t, i) : '<a href="mailto:' + t + '">' + t + "</a>"
        };
        e.fn.fmatter.checkbox = function (t, i) {
            var r, a = e.extend({}, i.checkbox);
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (a = e.extend({}, a, i.colModel.formatoptions));
            r = a.disabled === !0 ? 'disabled="disabled"' : "";
            (e.fmatter.isEmpty(t) || void 0 === t) && (t = e.fn.fmatter.defaultFormat(t, a));
            t = String(t);
            t = t.toLowerCase();
            var o = t.search(/(false|f|0|no|n|off|undefined)/i) < 0 ? " checked='checked' " : "";
            return '<input type="checkbox" ' + o + ' value="' + t + '" offval="no" ' + r + "/>"
        };
        e.fn.fmatter.link = function (t, i) {
            var r = {
                    target: i.target
                },
                a = "";
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (r = e.extend({}, r, i.colModel.formatoptions));
            r.target && (a = "target=" + r.target);
            return e.fmatter.isEmpty(t) ? e.fn.fmatter.defaultFormat(t, i) : "<a " + a + ' href="' + t + '">' + t + "</a>"
        };
        e.fn.fmatter.showlink = function (t, i) {
            var r, a = {
                    baseLinkUrl: i.baseLinkUrl,
                    showAction: i.showAction,
                    addParam: i.addParam || "",
                    target: i.target,
                    idName: i.idName
                },
                o = "";
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (a = e.extend({}, a, i.colModel.formatoptions));
            a.target && (o = "target=" + a.target);
            r = a.baseLinkUrl + a.showAction + "?" + a.idName + "=" + i.rowId + a.addParam;
            if (e.fmatter.isString(t) || e.fmatter.isNumber(t)) {
                if (a.pageTab) {
                    var s = ["rel=pageTab"];
                    a.parentopen && s.push("parentopen=true", "tabtxt=" + a.tabtxt);
                    return "<a " + o + ' href="' + r + '"' + s.join(" ") + ">" + t + "</a>"
                }
                return "<a " + o + ' href="' + r + '">' + t + "</a>"
            }
            return e.fn.fmatter.defaultFormat(t, i)
        };
        e.fn.fmatter.integer = function (t, i) {
            var r = e.extend({}, i.integer);
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (r = e.extend({}, r, i.colModel.formatoptions));
            return e.fmatter.isEmpty(t) ? r.defaultValue : e.fmatter.util.NumberFormat(t, r)
        };
        e.fn.fmatter.number = function (t, i) {
            var r = e.extend({}, i.number);
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (r = e.extend({}, r, i.colModel.formatoptions));
            return e.fmatter.isEmpty(t) ? r.defaultValue : e.fmatter.util.NumberFormat(t, r)
        };
        e.fn.fmatter.currency = function (t, i) {
            var r = e.extend({}, i.currency);
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (r = e.extend({}, r, i.colModel.formatoptions));
            return e.fmatter.isEmpty(t) ? r.defaultValue : 0 !== Number(t) || r.showZero ? e.fmatter.util.NumberFormat(t, r) : "&#160;"
        };
        e.fn.fmatter.date = function (t, i, r, a) {
            var o = e.extend({}, i.date);
            void 0 !== i.colModel && void 0 !== i.colModel.formatoptions && (o = e.extend({}, o, i.colModel.formatoptions));
            return o.reformatAfterEdit || "edit" !== a ? e.fmatter.isEmpty(t) ? e.fn.fmatter.defaultFormat(t, i) : e.jgrid.parseDate(o.srcformat, t, o.newformat, o) : e.fn.fmatter.defaultFormat(t, i)
        };
        e.fn.fmatter.select = function (t, i) {
            t = String(t);
            var r, a, o = !1,
                s = [];
            if (void 0 !== i.colModel.formatoptions) {
                o = i.colModel.formatoptions.value;
                r = void 0 === i.colModel.formatoptions.separator ? ":" : i.colModel.formatoptions.separator;
                a = void 0 === i.colModel.formatoptions.delimiter ? ";" : i.colModel.formatoptions.delimiter
            } else if (void 0 !== i.colModel.editoptions) {
                o = i.colModel.editoptions.value;
                r = void 0 === i.colModel.editoptions.separator ? ":" : i.colModel.editoptions.separator;
                a = void 0 === i.colModel.editoptions.delimiter ? ";" : i.colModel.editoptions.delimiter
            }
            if (o) {
                var n, l = i.colModel.editoptions.multiple === !0 ? !0 : !1,
                    d = [];
                if (l) {
                    d = t.split(",");
                    d = e.map(d, function (t) {
                        return e.trim(t)
                    })
                }
                if (e.fmatter.isString(o)) {
                    var c, u = o.split(a),
                        p = 0;
                    for (c = 0; c < u.length; c++) {
                        n = u[c].split(r);
                        n.length > 2 && (n[1] = e.map(n, function (e, t) {
                            return t > 0 ? e : void 0
                        }).join(r));
                        if (l) {
                            if (e.inArray(n[0], d) > -1) {
                                s[p] = n[1];
                                p++
                            }
                        } else if (e.trim(n[0]) === e.trim(t)) {
                            s[0] = n[1];
                            break
                        }
                    }
                } else e.fmatter.isObject(o) && (l ? s = e.map(d, function (e) {
                    return o[e]
                }) : s[0] = o[t] || "")
            }
            t = s.join(", ");
            return "" === t ? e.fn.fmatter.defaultFormat(t, i) : t
        };
        e.fn.fmatter.rowactions = function (t) {
            var i = e(this).closest("tr.jqgrow"),
                r = i.attr("id"),
                a = e(this).closest("table.ui-jqgrid-btable").attr("id").replace(/_frozen([^_]*)$/, "$1"),
                o = e("#" + a),
                s = o[0],
                n = s.p,
                l = n.colModel[e.jgrid.getCellIndex(this)],
                d = l.frozen ? e("tr#" + r + " td:eq(" + e.jgrid.getCellIndex(this) + ") > div", o) : e(this).parent(),
                c = {
                    keys: !1,
                    onEdit: null,
                    onSuccess: null,
                    afterSave: null,
                    onError: null,
                    afterRestore: null,
                    extraparam: {},
                    url: null,
                    restoreAfterError: !0,
                    mtype: "POST",
                    delOptions: {},
                    editOptions: {}
                },
                u = function (t, i) {
                    e.isFunction(c.afterSave) && c.afterSave.call(s, t, i);
                    d.find("div.ui-inline-edit,div.ui-inline-del").show();
                    d.find("div.ui-inline-save,div.ui-inline-cancel").hide()
                },
                p = function (t) {
                    e.isFunction(c.afterRestore) && c.afterRestore.call(s, t);
                    d.find("div.ui-inline-edit,div.ui-inline-del").show();
                    d.find("div.ui-inline-save,div.ui-inline-cancel").hide()
                };
            void 0 !== l.formatoptions && (c = e.extend(c, l.formatoptions));
            void 0 !== n.editOptions && (c.editOptions = n.editOptions);
            void 0 !== n.delOptions && (c.delOptions = n.delOptions);
            i.hasClass("jqgrid-new-row") && (c.extraparam[n.prmNames.oper] = n.prmNames.addoper);
            var h = {
                keys: c.keys,
                oneditfunc: c.onEdit,
                successfunc: c.onSuccess,
                url: c.url,
                extraparam: c.extraparam,
                aftersavefunc: u,
                errorfunc: c.onError,
                afterrestorefunc: p,
                restoreAfterError: c.restoreAfterError,
                mtype: c.mtype
            };
            switch (t) {
                case "edit":
                    o.jqGrid("editRow", r, h);
                    d.find("div.ui-inline-edit,div.ui-inline-del").hide();
                    d.find("div.ui-inline-save,div.ui-inline-cancel").show();
                    o.triggerHandler("jqGridAfterGridComplete");
                    break;
                case "save":
                    if (o.jqGrid("saveRow", r, h)) {
                        d.find("div.ui-inline-edit,div.ui-inline-del").show();
                        d.find("div.ui-inline-save,div.ui-inline-cancel").hide();
                        o.triggerHandler("jqGridAfterGridComplete")
                    }
                    break;
                case "cancel":
                    o.jqGrid("restoreRow", r, p);
                    d.find("div.ui-inline-edit,div.ui-inline-del").show();
                    d.find("div.ui-inline-save,div.ui-inline-cancel").hide();
                    o.triggerHandler("jqGridAfterGridComplete");
                    break;
                case "del":
                    o.jqGrid("delGridRow", r, c.delOptions);
                    break;
                case "formedit":
                    o.jqGrid("setSelection", r);
                    o.jqGrid("editGridRow", r, c.editOptions)
            }
        };
        e.fn.fmatter.actions = function (t, i) {
            var r, a = {
                    keys: !1,
                    editbutton: !0,
                    delbutton: !0,
                    editformbutton: !1
                },
                o = i.rowId,
                s = "";
            void 0 !== i.colModel.formatoptions && (a = e.extend(a, i.colModel.formatoptions));
            if (void 0 === o || e.fmatter.isEmpty(o)) return "";
            if (a.editformbutton) {
                r = "id='jEditButton_" + o + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'formedit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
                s += "<div title='" + e.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + r + "><span class='ui-icon ui-icon-pencil'></span></div>"
            } else if (a.editbutton) {
                r = "id='jEditButton_" + o + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'edit'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover') ";
                s += "<div title='" + e.jgrid.nav.edittitle + "' style='float:left;cursor:pointer;' class='ui-pg-div ui-inline-edit' " + r + "><span class='ui-icon ui-icon-pencil'></span></div>"
            }
            if (a.delbutton) {
                r = "id='jDeleteButton_" + o + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'del'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
                s += "<div title='" + e.jgrid.nav.deltitle + "' style='float:left;margin-left:5px;' class='ui-pg-div ui-inline-del' " + r + "><span class='ui-icon ui-icon-trash'></span></div>"
            }
            r = "id='jSaveButton_" + o + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'save'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
            s += "<div title='" + e.jgrid.edit.bSubmit + "' style='float:left;display:none' class='ui-pg-div ui-inline-save' " + r + "><span class='ui-icon ui-icon-disk'></span></div>";
            r = "id='jCancelButton_" + o + "' onclick=jQuery.fn.fmatter.rowactions.call(this,'cancel'); onmouseover=jQuery(this).addClass('ui-state-hover'); onmouseout=jQuery(this).removeClass('ui-state-hover'); ";
            s += "<div title='" + e.jgrid.edit.bCancel + "' style='float:left;display:none;margin-left:5px;' class='ui-pg-div ui-inline-cancel' " + r + "><span class='ui-icon ui-icon-cancel'></span></div>";
            return "<div style='margin-left:8px;'>" + s + "</div>"
        };
        e.unformat = function (t, i, r, a) {
            var o, s, n = i.colModel.formatter,
                l = i.colModel.formatoptions || {},
                d = /([\.\*\_\'\(\)\{\}\+\?\\])/g,
                c = i.colModel.unformat || e.fn.fmatter[n] && e.fn.fmatter[n].unformat;
            if (void 0 !== c && e.isFunction(c)) o = c.call(this, e(t).text(), i, t);
            else if (void 0 !== n && e.fmatter.isString(n)) {
                var u, p = e.jgrid.formatter || {};
                switch (n) {
                    case "integer":
                        l = e.extend({}, p.integer, l);
                        s = l.thousandsSeparator.replace(d, "\\$1");
                        u = new RegExp(s, "g");
                        o = e(t).text().replace(u, "");
                        break;
                    case "number":
                        l = e.extend({}, p.number, l);
                        s = l.thousandsSeparator.replace(d, "\\$1");
                        u = new RegExp(s, "g");
                        o = e(t).text().replace(u, "").replace(l.decimalSeparator, ".");
                        break;
                    case "currency":
                        l = e.extend({}, p.currency, l);
                        s = l.thousandsSeparator.replace(d, "\\$1");
                        u = new RegExp(s, "g");
                        o = e(t).text();
                        l.prefix && l.prefix.length && (o = o.substr(l.prefix.length));
                        l.suffix && l.suffix.length && (o = o.substr(0, o.length - l.suffix.length));
                        o = o.replace(u, "").replace(l.decimalSeparator, ".");
                        break;
                    case "checkbox":
                        var h = i.colModel.editoptions ? i.colModel.editoptions.value.split(":") : ["Yes", "No"];
                        o = e("input", t).is(":checked") ? h[0] : h[1];
                        break;
                    case "select":
                        o = e.unformat.select(t, i, r, a);
                        break;
                    case "actions":
                        return "";
                    default:
                        o = e(t).text()
                }
            }
            "" === e.jgrid.htmlDecode(o) && (o = "");
            return void 0 !== o ? o : a === !0 ? e(t).text() : e.jgrid.htmlDecode(e(t).html())
        };
        e.unformat.select = function (t, i, r, a) {
            var o = [],
                s = e(t).text();
            if (a === !0) return s;
            var n = e.extend({}, void 0 !== i.colModel.formatoptions ? i.colModel.formatoptions : i.colModel.editoptions),
                l = void 0 === n.separator ? ":" : n.separator,
                d = void 0 === n.delimiter ? ";" : n.delimiter;
            if (n.value) {
                var c, u = n.value,
                    p = n.multiple === !0 ? !0 : !1,
                    h = [];
                if (p) {
                    h = s.split(",");
                    h = e.map(h, function (t) {
                        return e.trim(t)
                    })
                }
                if (e.fmatter.isString(u)) {
                    var f, g = u.split(d),
                        m = 0;
                    for (f = 0; f < g.length; f++) {
                        c = g[f].split(l);
                        c.length > 2 && (c[1] = e.map(c, function (e, t) {
                            return t > 0 ? e : void 0
                        }).join(l));
                        if (p) {
                            if (e.inArray(c[1], h) > -1) {
                                o[m] = c[0];
                                m++
                            }
                        } else if (e.trim(c[1]) === e.trim(s)) {
                            o[0] = c[0];
                            break
                        }
                    }
                } else if (e.fmatter.isObject(u) || e.isArray(u)) {
                    p || (h[0] = s);
                    o = e.map(h, function (t) {
                        var i;
                        e.each(u, function (e, r) {
                            if (r === t) {
                                i = e;
                                return !1
                            }
                        });
                        return void 0 !== i ? i : void 0
                    })
                }
                return o.join(", ")
            }
            return s || ""
        };
        e.unformat.date = function (t, i) {
            var r = e.jgrid.formatter.date || {};
            void 0 !== i.formatoptions && (r = e.extend({}, r, i.formatoptions));
            return e.fmatter.isEmpty(t) ? e.fn.fmatter.defaultFormat(t, i) : e.jgrid.parseDate(r.newformat, t, r.srcformat, r)
        }
    }(jQuery);
