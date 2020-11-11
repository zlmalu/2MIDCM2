function initTree() {
    Public.zTree.init($("#tree"), {
        defaultClass: "innerTree",
        showRoot: !0,
        rootTxt: "全部"
    }, {
        callback: {
            beforeClick: function(e, t) {
                $("#currentCategory").data("id", t.id).html(t.name);
                $("#search").data('id',t.id).trigger("click")
            }
        }
    })
}
function initGrid() {
    var e = Public.setGrid(ajustH, ajustW),
        t = ["操作","仓库编号", "仓库名称","描述","负责人"],
        o = [{
            name: "operate",
            width: 60,
            fixed: !0,
            align: "center",
            formatter: Public.operFmatter
        },{
            name: "id",
            index: "id",
            width: 100
        },{
            name: "Stock_Name",
            index: "Stock_Name",
            width: 200
        },{
            name: "Desc",
            index: "Desc",
            width: 400
        },{
            name: "headName",
            index: "headName",
            width: 100
        }];
    $("#grid").jqGrid({
        //url: "/basedata/inventory.do?action=list&isDelete=2",
        url: stock_lists,
        datatype: "json",
        width: e.w,
        height: e.h,
        altRows: !0,
        gridview: !0,
        onselectrow: !1,
        colNames: t,
        colModel: o,
        pager: "#page",
        viewrecords: !0,
        multiselect: !0,
        cmTemplate: {
            sortable: !1
        },
        rowNum: 100,
        rowList: [100, 200, 500],
        shrinkToFit: !0,
        jsonReader: {
            root: "data.items",
            records: "data.totalsize",
            repeatitems: !1,
            id: "id"
        },
        loadComplete: function(e) {
            if (e && 200 == e.status) {
                var t = {};
                e = e.data;
                for (var i = 0; i < e.items.length; i++) {
                    var a = e.items[i];
                    t[a.id] = a
                }
                $("#grid").data("gridData", t)
            }
        },
        loadError: function() {
            parent.Public.tips({
                type: 1,
                // content: "操作失败了哦，请检查您的网络链接！"
            })
        }
    })
}
function initEvent() {
    $("#btn-add").click(function(t) {
        t.preventDefault();
        handle.operate("add")
    });
    $("#grid").on("click", ".operating .ui-icon-pencil", function(t) {
        t.preventDefault();
        var e = $(this).parent().data("id");
        handle.operate("edit", e)
    });
    $("#grid").on("click", ".operating .ui-icon-trash", function(t) {
        t.preventDefault();
        var e = $(this).parent().data("id");
        handle.del(e)
    });
    $("#btn-refresh").click(function(t) {
        t.preventDefault();
        $("#grid").trigger("reloadGrid")
    });
    $(window).resize(function() {
        Public.resizeGrid(ajustH, ajustW);
        $(".innerTree").height($("#ztree").height() - 95)
    });
    Public.setAutoHeight($("#ztree"));
    $(".innerTree").height($("#ztree").height() - 95)
}
var  ajustH = 95,
    ajustW = 70,
    thisTree;
/*var bomCombo = $("#BOM_ID").combo({
    text: "name",
    value: "id",
    width: 200,
    data: stock_bomList,

    ajaxOptions: {
        formatData: function(e) {
            e.data.items.unshift({
                id: "",
                name: ""
            });
            return e.data.items
        }
    }

}).getCombo();*/
var handle = {
    operate: function(t, e) {
        if ("add" == t) var i = "新增仓库",
            a = {
                oper: t,
                callback: this.callback
            };
        else var i = "修改仓库",
            a = {
                oper: t,
                rowData: $("#grid").data("gridData")[e],
                callback: this.callback
            };
        $.dialog({
            title: i,
            content: "url:"+settings_stock_manage,
            data: a,
            width: 400,
            height: 300,
            max: !1,
            min: !1,
            cache: !1,
            lock: !0
        })
    },
    del: function(t) {
        $.dialog.confirm("删除的仓库将不能恢复，请确认是否删除？", function() {
            Public.ajaxPost(stock_del, {
                id: t
            }, function(e) {
                if (e && 200 == e.status) {
                    parent.Public.tips({
                        content: "删除仓库成功！"
                    });
                    $("#grid").jqGrid("delRowData", t)
                } else parent.Public.tips({
                    type: 1,
                    content: "删除仓库失败！" + e.msg
                })
            })
        })
    },
    callback: function(t, e, i) {
        var a = $("#grid").data("gridData");
        if (!a) {
            a = {};
            $("#grid").data("gridData", a)
        }
        a[t.id] = t;
        if ("edit" == e) {
            $("#grid").jqGrid("setRowData", t.id, t);
            i && i.api.close()
        } else {
            $("#grid").jqGrid("addRowData", t.id, t, "last");
            i && i.resetForm(t)
        }
    }
};
initGrid();
initEvent();
initTree();

function shareFormatter(val, opt, row) {
    if (row.flag==1) {
                return '<div class="operating" ><span data-id="' + row.id + '" class="delete ui-label ui-label-success">已启用</span></div>';
    } else {
        return '<div class="operate-wrap"><span class="authorize ui-label ui-label-default" data-id="' + row.id + '"  data-flag=0 data-id="false">已停用</span></div>';
    }
}
