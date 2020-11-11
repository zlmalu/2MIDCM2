var queryConditions = {
        matchCon: ""
    },
    SYSTEM = system = parent.SYSTEM,
    hiddenAmount = !1,
    billRequiredCheck = system.billRequiredCheck,
    qtyPlaces = Number(parent.SYSTEM.qtyPlaces),
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
                var a = '<div class="operating" data-id="' + i.Date + '"><a class="ui-icon ui-icon-pencil" title="修改"></a><a class="ui-icon ui-icon-trash" title="删除"></a></div>';
                return a
            }
            var i = Public.setGrid(),
                a = this;
            queryConditions.beginDate = this.$_beginDate.val();
            queryConditions.endDate = this.$_endDate.val();
            a.markRow = [];
            $("#grid").jqGrid({
                url: matEst_lists,
                postData: queryConditions,
                datatype: "json",
                autowidth: !0,
                height: i.h,
                altRows: !0,
                gridview: !0,
                multiselect: !0,
                colNames: ["操作", "日期","物料名称","总需求量","库存量", "需生产量", "需采购量"],
                colModel: [{
                    name: "operating",
                    width: 60,
                    fixed: !0,
                    formatter: t,
                    align: "center"
                }, {
                    name: "Date",
                    index: "Date",
                    width: 100,
                    align: "center"
                },{
                    name: "BOMName",
                    index: "BOMName",
                    width: 100,
                    align: "center"
                },{
                    name: "AmOfDem",
                    index: "AmOfDem",
                    width: 200,
                    align: "center"
                },{
                    name: "AmOfSto",
                    index: "AmOfSto",
                    width: 100,
                    align: "center"
                },{
                    name: "AmOfPro",
                    index: "AmOfPro",
                    width: 100,
                    align: "center"
                },{
                    name: "AmOfPro",
                    index: "AmOfPro",
                    width: 80,
                    align: "center"

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
                url: matEst_lists,
                datatype: "json",
                postData: t
            }).trigger("reloadGrid")
        },
        addEvent: function() {
            var t = this;
            $(".grid-wrap").on("click", ".ui-icon-pencil", function(t) {
                t.preventDefault();
                var e = $(this).parent().data("id"),
                    i = $("#grid").jqGrid("getRowData", e),
                    a = 1 == i.disEditable ? "&disEditable=true" : "";
                parent.tab.addTabItem({
                    tabid: "settings-settings",
                    text: "编辑物料生产预估",
                    url: matEst_edit+"?id=" + e + "&flag=list"
                });
                $("#grid").jqGrid("getDataIDs");
                parent.cacheList.purchaseId = $("#grid").jqGrid("getDataIDs")
            });

            $(".grid-wrap").on("click", ".ui-icon-trash", function(t) {
                t.preventDefault();
                var e = $(this).parent().data("id");
                $.dialog.confirm("您确定要该BOM设计信息吗？", function() {
                    Public.ajaxGet(wPTemDesign_del, {
                        id: e
                    }, function(t) {
                        if (200 === t.status) {
                            $("#grid").jqGrid("delRowData", e);
                            parent.Public.tips({
                                content: "删除成功！"
                            })
                        } else parent.Public.tips({
                            type: 1,
                            content: t.msg
                        })
                    })
                })
            });

            $("#search").click(function() {
                queryConditions.matchCon = "请输入上位物料或下位物料或设计名称" === t.$_matchCon.val() ? "" : t.$_matchCon.val();
                THISPAGE.reloadData(queryConditions)
            });
            $("#add").click(function(t) {
                t.preventDefault();
                parent.tab.addTabItem({
                    tabid: "storage",
                    text: "新增物料模板设计",
                    //url: "/scm/invPu.do?action=initPur"
                    url: wPTemDesign_add
                    // url: http://localhost/2MIDCM2/index.php/wPTemDesign/add
                })
            });
            $(window).resize(function() {
                Public.resizeGrid()
            })
        }
    };
THISPAGE.init();
