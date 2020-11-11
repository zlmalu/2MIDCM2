var queryConditions = {
        matchCon: ""
    },
    SYSTEM = system = parent.SYSTEM,
    hiddenAmount = !1,
    billRequiredCheck = system.billRequiredCheck,
    THISPAGE = {
        init: function() {
            SYSTEM.isAdmin !== !1 || SYSTEM.rights.AMOUNT_INAMOUNT || (hiddenAmount = !0);
            this.initDom();
            this.loadGrid();
            this.addEvent()
        },
        initDom: function() {
            this.$_matchCon = $("#matchCon");
            this.$_beginDate = $("#beginDate").val(system.beginDate);
            this.$_endDate = $("#endDate").val(system.endDate);
            this.$_matchCon.placeholder();
            this.$_beginDate.datepicker();
            this.$_endDate.datepicker()
        },
        loadGrid: function() {
            function t(t, e, i) {
                var a = '<div id="aaa" class="operating" data-id="' + i.id + '" data-billno="' + i.PK_OP_ID + '"><a class="ui-icon ui-icon-search" title="查看"></a><a class="pass">通过</a>&nbsp;&nbsp;<a class="fail">不通过</a></div>';
                return a
            }
            function e(t, e, i) {
                //if (150501 === t) return "购货";
                if (1 === t) return "购货";
                a.markRow.push(i.id);
                return "退货"
            }
            var i = Public.setGrid(),
                a = this;
            queryConditions.beginDate = this.$_beginDate.val();
            queryConditions.endDate = this.$_endDate.val();
            a.markRow = [];
            $("#grid").jqGrid({
                //url: "/scm/invPu.do?action=list",
                url: invpu_purchaseReviewList,
                postData: queryConditions,
                datatype: "json",
                autowidth: !0,
                height: i.h,
                altRows: !0,
                gridview: !0,
                multiselect: !0,
                colNames: ["操作", "订单日期", "订单编号","订单名称", "厂家", "订单总金额", "付款条件", "制单人"],
                colModel: [{
                    name: "operating",
                    width: 100,
                    fixed: !0,
                    formatter: t,
                    align: "center"
                }, {
                    name: "Create_Date",
                    index: "Create_Date",
                    width: 120,
                    align: "center"
                }, {
                    name: "PK_OP_ID",
                    index: "PK_OP_ID",
                    width: 150,
                    align: "center"
                },{
                    name: "orderName",
                    index: "orderName",
                    width: 200,
                    align: "center"
                },{
                    name: "Supplier_Name",
                    index: "Supplier_Name",
                    width: 200,
                    align: "center"
                }, {
                    name: "PurOrder_Total",
                    index: "PurOrder_Total",
                    hidden: hiddenAmount,
                    width: 100,
                    align: "right",
                    formatter: "currency"
                }, {
                    name: "PurOrder_Payment",
                    index: "PurOrder_Payment",
                    width: 200,
                    align: "center"
                }, {
                    name: "Username",
                    index: "Username",
                    width: 80,
                    fixed: !0,
                    align: "center",
                    title: !0,
                    classes: "ui-ellipsis"
                }],
                cmTemplate: {
                    sortable: !1,
                    title: !1
                },
                page: 1,
                sortname: "number",
                sortorder: "desc",
                pager: "#page",
                rowNum: 100,
                rowList: [100, 200, 500],
                viewrecords: !0,
                shrinkToFit: !1,
                forceFit: !1,
                jsonReader: {
                    root: "data.rows",
                    records: "data.records",
                    total: "data.total",
                    repeatitems: !1,
                    id: "id"
                },
                loadComplete: function() {
                    var t = a.markRow.length;
                    if (t > 0) for (var e = 0; t > e; e++) $("#" + a.markRow[e]).addClass("red")
                },
                loadError: function() {},
                ondblClickRow: function(t) {
                    $("#" + t).find(".ui-icon-pencil").trigger("click")
                }
            })
        },
        reloadData: function(t) {
            this.markRow = [];
            $("#grid").jqGrid("setGridParam", {
                url: invpu_purchaseReviewList,
                //url: "/scm/invPu.do?action=list",
                datatype: "json",
                postData: t
            }).trigger("reloadGrid")
        },
        addEvent: function() {
            var t = this;
            $(".grid-wrap").on("click", ".pass", function(t) {
                t.preventDefault();
                    var e = $(this).parent().data("id");
                    var b = $(this).parent().data("billno");
                    $.dialog.confirm("确定要审核<span style='color: red;'>通过</span>"+b+"购货单吗？", function() {
                        //Public.ajaxGet("/scm/invPu.do?action=delete", {
                        Public.ajaxGet(invpu_review, {
                            id: e,
                            r:2,
                            billno:b
                        }, function(t) {
                            if (200 === t.status) {
                                $("#grid").jqGrid("delRowData", e);
                                parent.Public.tips({
                                    content: "审核通过成功！"
                                });
                                THISPAGE.reloadData(queryConditions)
                            } else parent.Public.tips({
                                type: 1,
                                content: t.msg
                            })
                        })
                    })
            });
            $(".grid-wrap").on("click", ".fail", function(t) {
                t.preventDefault();
                var e = $(this).parent().data("id");
                var b = $(this).parent().data("billno");
                $.dialog.confirm("确定要审核<span style='color: red;'>不通过</span>"+b+"购货单吗？", function() {
                    //Public.ajaxGet("/scm/invPu.do?action=delete", {
                    Public.ajaxGet(invpu_review, {
                        id: e,
                        r:3,
                        billno:b
                    }, function(t) {
                        if (200 === t.status) {
                            $("#grid").jqGrid("delRowData", e);
                            parent.Public.tips({
                                content: "审核不通过成功！"
                            });
                            THISPAGE.reloadData(queryConditions)
                        } else parent.Public.tips({
                            type: 1,
                            content: t.msg
                        })
                    })
                })
            });
            $(".grid-wrap").on("click", ".ui-icon-search", function(e) {
                e.preventDefault();
                var t = $(this).parent().data("billno");
                Business.forPurchaseReviewSearch(t, $(this).parent().data("billno"))
            });



            $("#search").click(function() {
                queryConditions.matchCon = "请输入订单编号或订单名称或付款条件" === t.$_matchCon.val() ? "" : t.$_matchCon.val();
                queryConditions.beginDate = t.$_beginDate.val();
                queryConditions.endDate = t.$_endDate.val();
                THISPAGE.reloadData(queryConditions)
            });

            $(window).resize(function() {
                Public.resizeGrid()
            })
        },

    };
THISPAGE.init();