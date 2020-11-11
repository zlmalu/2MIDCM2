function initGrid() {
    var e = Public.setGrid(),
        t = ["操作", "编号","bom设计","描述","工作流程模板设计名称","上位物料id", "上位物料", "下位物料id", "下位物料", "下位物料数量",
            "函数描述",  "因子描述"],
        i = !(parent.SYSTEM.isAdmin || parent.SYSTEM.rights.AMOUNT_OUTAMOUNT),
        a = [{
            name: "operating",
            width: 60,
            fixed: !0,
            formatter: Public.operFmatter,
            title: !1

        }, {
            name: "id",
            index: "id",
            width: 100,
            align: "center"
        },{
            name: "Name",
            index: "Name",
            width: 100,
            align: "center"
        },{
            name: "Desc",
            index: "Desc",
            width: 200,
            align: "center"
        },{
            name: "WC_Name",
            index: "WC_Name",
            width: 200,
            align: "center"
        },{
            name: "up_bom_id",
            label: "上位物料id",
            width: 10,
            hidden:true,
            title: !0,
            editable: !1
        },{
            name: "UpBOM_Name",
            index: "UpBOM_Name",
            width: 100,
            align: "center"
        },{
            name: "down_bom_id",
            label: "下位物料id",
            width: 10,
            hidden:true,
            title: !0,
            editable: !1
        },{
            name: "DownBOM_Name",
            index: "DownBOM_Name",
            width: 80,
            align: "center"

        },{
            name: "DownAmount",
            index: "DownAmount",
            width: 80,
            align: "center"

        },{
            name: "F0",
            index: "F0",
            width: 80,
            align: "center",
            formatter: function(e, t, i) {
                var a = '<div class="operating" data-name="' + i.Name + '" data-F0="' + i.F0 + '"  data-F1="' + i.F1 + '" data-F2="' + i.F2 + '"  data-F3="' + i.F3 + '" data-F4="' + i.F4 + '"  data-F5="' + i.F5 + '"  data-F6="' + i.F6 + '"  data-F7="' + i.F7 + '"  data-F8="' + i.F8 + '"  data-F9="' + i.F9 + '"  data-F10="' + i.F10 + '"  data-F11="' + i.F11 + '"  data-F12="' + i.F12 + '"  data-F13="' + i.F13 + '"  data-F14="' + i.F14 + '"  data-F15="' + i.F15 + '"  data-F16="' + i.F16 + '"  data-F17="' + i.F17 + '"  data-F18="' + i.F18 + '"  data-F19="' + i.F19 + '"><span class="ui-icon ui-icon-search" id="f" title="查看"></span></div>';
                //var a = '<div class="operating" data-id="' + i.id + '"><span class="ui-icon ui-icon-pencil" title="修改"></span><span class="ui-icon ui-icon-trash" title="删除"></span><span class="ui-icon ui-icon-pic" title="商品图片"></span></div>';
                return a
            }
        },{
            name: "Coef",
            index: "Coef",
            width: 80,
            align: "center",
            formatter: function(e, t, i) {
                var a = '<div class="operating" data-name="' + i.Name + '" data-coef="' + i.Coef + '"  data-c0="' + i.C0 + '" data-c1="' + i.C1 + '" data-c2="' + i.C2 + '" data-c3="' + i.C3 + '" data-c4="' + i.C4 + '" data-c5="' + i.C5 + '" data-c6="' + i.C6 + '" data-c7="' + i.C7 + '" data-c8="' + i.C8 + '" data-c9="' + i.C9 + '" data-c10="' + i.C10 + '"><span class="ui-icon ui-icon-search" id="c" title="查看"></span></div>';
                //var a = '<div class="operating" data-id="' + i.id + '"><span class="ui-icon ui-icon-pencil" title="修改"></span><span class="ui-icon ui-icon-trash" title="删除"></span><span class="ui-icon ui-icon-pic" title="商品图片"></span></div>';
                return a
            }
        }];
    $("#grid").jqGrid({
        //url: "../basedata/contact.do?action=list&isDelete=2",
        url: matTemDesign_lists,
        datatype: "json",
        autowidth: !0,
        height: e.h,
        altRows: !0,
        gridview: !0,
        onselectrow: !1,
        multiselect: !0,
        colNames: t,
        colModel: a,
        pager: "#page",
        viewrecords: !0,
        cmTemplate: {
            sortable: !1
        },
        rowNum: 100,
        rowList: [100, 200, 500],
        shrinkToFit: !0,
        jsonReader: {
            root: "data.rows",
            records: "data.records",
            total: "data.total",
            repeatitems: !1,
            id: "id"
        },
        loadComplete: function(e) {
            if (e && 200 == e.status) {
                var t = {};
                e = e.data;
                for (var i = 0; i < e.rows.length; i++) {
                    var a = e.rows[i];
                    t[a.id] = a
                }
                $("#grid").data("gridData", t)
            } else {
                var r = 250 === e.status ? searchFlag ? "没有满足条件的结果哦！" : "没有客户数据哦！" : e.msg;
                parent.Public.tips({
                    type: 2,
                    content: r
                })
            }
        },
        loadError: function() {
            parent.Public.tips({
                type: 1,
                content: "操作失败了哦，请检查您的网络链接！"
            })
        }
    })
}
function initEvent() {
    $_matchCon = $("#matchCon");
    $_matchCon.placeholder();
    $("#search").on("click", function(e) {
        e.preventDefault();
        var t = "输入bom设计 / 工作流程模板设计名称 / 上位物料 / 下位物料 查询" === $_matchCon.val() ? "" : $.trim($_matchCon.val());
        $("#grid").jqGrid("setGridParam", {
            page: 1,
            postData: {
                skey: t
            }
        }).trigger("reloadGrid")
    });

    $("#btn-add").click(function(t) {
        t.preventDefault();
        handle.operate("add")
    });

    $("#btn-print").on("click", function(e) {
        e.preventDefault()
    });
    $("#btn-export").on("click", function() {
        if (Business.verifyRight("BU_EXPORT")) {
            var e = "输入单位编号/ 名称 / 电话查询" === $_matchCon.val() ? "" : $.trim($_matchCon.val());
            $(this).attr("href", customer_export+"?skey=" + e)
        }
    });
    $("#grid").on("click", ".operating .ui-icon-pencil", function(e) {
        e.preventDefault();
        if (Business.verifyRight("BU_UPDATE")) {
            var t = $(this).parent().data("id");
            handle.operate("edit", t)
        }
    });
    $("#grid").on("click", ".operating .ui-icon-trash", function(e) {
        e.preventDefault();
        if (Business.verifyRight("BU_DELETE")) {
            var t = $(this).parent().data("id");
            handle.del(t + "")
        }
    });
    $("#btn-batchDel").click(function(e) {
        e.preventDefault();
        if (Business.verifyRight("BU_DELETE")) {
            var t = $("#grid").jqGrid("getGridParam", "selarrrow");
            t.length ? handle.del(t.join()) : parent.Public.tips({
                type: 2,
                content: "请选择需要删除的项"
            })
        }
    });
    $(window).resize(function() {
        Public.resizeGrid()
    })
}
var searchFlag = !1,
    filterClassCombo, handle = {
        operate: function(e, t) {
            if ("add" == e) var i = "新增物料模板设计",
                a = {
                    oper: e,
                    callback: this.callback
                };
            else var i = "修改物料模板设计",
                a = {
                    oper: e,
                    rowData: $("#grid").data("gridData")[t],
                    callback: this.callback
                };
            $.dialog({
                title: i,
                content: "url:"+settings_matTem_Design_manage,
                data: a,
                width: 640,
                height: 422,
                max: !1,
                min: !1,
                cache: !1,
                lock: !0
            })
        },
        del: function(e) {
            $.dialog.confirm("删除的单位将不能恢复，请确认是否删除？", function() {
                Public.ajaxPost(matTemDesign_del, {
                    id: e
                }, function(t) {
                    if (t && 200 == t.status) {
                        var i = t.data.id || [];
                        parent.Public.tips(e.split(",").length === i.length ? {
                            content: "成功删除" + i.length + "个单位！"
                        } : {
                            type: 2,
                            content: t.data.msg
                        });
                        for (var a = 0, r = i.length; r > a; a++) {
                            $("#grid").jqGrid("setSelection", i[a]);
                            $("#grid").jqGrid("delRowData", i[a])
                        }
                    } else parent.Public.tips({
                        type: 1,
                        content: "删除单位失败！" + t.msg
                    })
                })
            })
        },
        callback: function(e, t, i) {
            var a = $("#grid").data("gridData");
            console.log(a);
            if (!a) {
                a = {};
                $("#grid").data("gridData", a)
            }
//			var s = "";
//  for (var property in e) {
//   s = s + "\n "+property +": " + e[property] ;
//  }
//  alert(s);

            e.difMoney = e.amount - e.periodMoney;
            a[e.id] = e;
            if ("edit" == t) {
                $("#grid").jqGrid("setRowData", e.id, e);
                i && i.api.close()
            } else {
                $("#grid").jqGrid("addRowData", e.id, e, "first");
                i && i.resetForm(e)
            }
        }
    };
initGrid();
initEvent();

$(".grid-wrap").on("click", "#f", function(e) {
    e.preventDefault();
    var name = $(this).parent().data("name");
    var F0 = $(this).parent().data("f0").toString().replace(/\+/g, "%2B") || '';
    var F1 = $(this).parent().data("f1").toString().replace(/\+/g, "%2B") || '';
    var F2 = $(this).parent().data("f2").toString().replace(/\+/g, "%2B") || '';
    var F3 = $(this).parent().data("f3").toString().replace(/\+/g, "%2B") || '';
    var F4 = $(this).parent().data("f4").toString().replace(/\+/g, "%2B") || '';
    var F5 = $(this).parent().data("f5").toString().replace(/\+/g, "%2B") || '';
    var F6 = $(this).parent().data("f6").toString().replace(/\+/g, "%2B") || '';
    var F7 = $(this).parent().data("f7").toString().replace(/\+/g, "%2B") || '';
    var F8 = $(this).parent().data("f8").toString().replace(/\+/g, "%2B") || '';
    var F9 = $(this).parent().data("f9").toString().replace(/\+/g, "%2B") || '';
    var F10 = $(this).parent().data("f10").toString().replace(/\+/g, "%2B") || '';
    var F11 = $(this).parent().data("f11").toString().replace(/\+/g, "%2B") || '';
    var F12 = $(this).parent().data("f12").toString().replace(/\+/g, "%2B") || '';
    var F13 = $(this).parent().data("f13").toString().replace(/\+/g, "%2B") || '';
    var F14 = $(this).parent().data("f14").toString().replace(/\+/g, "%2B") || '';
    var F15 = $(this).parent().data("f15").toString().replace(/\+/g, "%2B") || '';
    var F16 = $(this).parent().data("f16").toString().replace(/\+/g, "%2B") || '';
    var F17 = $(this).parent().data("f17").toString().replace(/\+/g, "%2B") || '';
    var F18 = $(this).parent().data("f18").toString().replace(/\+/g, "%2B") || '';
    var F19 = $(this).parent().data("f19").toString().replace(/\+/g, "%2B") || '';
    var url = settings_spec_info1+"?F0=" + F0+"&F1=" + F1+"&F2=" + F2+"&F3=" + F3+"&F4=" + F4+"&F5=" + F5+"&F6=" + F6+"&F7=" + F7+"&F8=" + F8+"&F9=" + F9+"&F10=" + F10+"&F11=" + F11+"&F12=" + F12+"&F13=" + F13+"&F14=" + F14+"&F15=" + F15+"&F16=" + F16+"&F17=" + F17+"&F18=" + F18+"&F19=" + F19;
    if(name) {
        $.dialog({
            width: 600,
            height: 410,
            title: name + '函数信息',
	    content: 'url:'+encodeURI(url),
            //content: 'url:'+settings_spec_info1+"?F0=" + F0+"&F1=" + F1+"&F2=" + F2+"&F3=" + F3+"&F4=" + F4+"&F5=" + F5+"&F6=" + F6+"&F7=" + F7+"&F8=" + F8+"&F9=" + F9+"&F10=" + F10+"&F11=" + F11+"&F12=" + F12+"&F13=" + F13+"&F14=" + F14+"&F15=" + F15+"&F16=" + F16+"&F17=" + F17+"&F18=" + F18+"&F19=" + F19,
            data: {F0:F0,F1:F1,F2:F2,F3:F3,F4:F4,F5:F5,F6:F6,F7:F7,F8:F8,F9:F9,F10:F10,F11:F11,F12:F12,F13:F13,F14:F14,F15:F15,F16:F16,F17:F17,F18:F18,F19:F19},
            cancel: true,
            //lock: true,
            cancelVal: '关闭'

        });
        //goodsCombo.removeSelected(false);
    } else {
        parent.Public.tips({type: 2, content : '请先选择一个商品！'});
    };
});
$(".grid-wrap").on("click", "#c", function(e) {
    e.preventDefault();
    var name = $(this).parent().data("name");
    var F0 = $(this).parent().data("c0") || '';
    var F1 = $(this).parent().data("c1") || '';
    var F2 = $(this).parent().data("c2") || '';
    var F3 = $(this).parent().data("c3") || '';
    var F4 = $(this).parent().data("c4") || '';
    var F5 = $(this).parent().data("c5") || '';
    var F6 = $(this).parent().data("c6") || '';
    var F7 = $(this).parent().data("c7") || '';
    var F8 = $(this).parent().data("c8") || '';
    var F9 = $(this).parent().data("c9") || '';
    var F10 = $(this).parent().data("c10") || '';
    var Coef = $(this).parent().data("coef") || '';
    if(name) {
        $.dialog({
            width: 600,
            height: 410,
            title: name + '因子信息',
            content: 'url:'+settings_spec_info2+"?F0=" + F0+"&F1=" + F1+"&F2=" + F2+"&F3=" + F3+"&F4=" + F4+"&F5=" + F5+"&F6=" + F6+"&F7=" + F7+"&F8=" + F8+"&F9=" + F9+"&F10=" + F10+"&Coef=" + Coef,
            data: {F0:F0,F1:F1,F2:F2,F3:F3,F4:F4,F5:F5,F6:F6,F7:F7,F8:F8,F9:F9,F10:F10,Coef:Coef},
            cancel: true,
            //lock: true,
            cancelVal: '关闭'

        });
        //goodsCombo.removeSelected(false);
    } else {
        parent.Public.tips({type: 2, content : '请先选择一个商品！'});
    };
});
