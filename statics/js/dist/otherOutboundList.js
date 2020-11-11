var queryConditions = {
	matchCon: "",
	locationId: -1,
	transTypeId: -1
},
	hiddenAmount = !1,
	SYSTEM = system = parent.SYSTEM,
	THISPAGE = {
		init: function() {
			SYSTEM.isAdmin !== !1 || SYSTEM.rights.AMOUNT_COSTAMOUNT || (hiddenAmount = !0);
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
			function e(e, t, i) {
				var a = '<div class="operating" data-id="' + i.PK_BOM_SO_ID + '" data-type="' + i.Type + '"><span class="ui-icon ui-icon-search" title="查看"></span><span class="ui-icon ui-icon-trash" title="删除"></span></div>';
				return a
			}
			var t = Public.setGrid();
			queryConditions.beginDate = this.$_beginDate.val();
			queryConditions.endDate = this.$_endDate.val();
			$("#grid").jqGrid({
				url: invoi_outlist,
				postData: queryConditions,
				datatype: "json",
				autowidth: !0,
				height: t.h,
				altRows: !0,
				gridview: !0,
				multiselect: !0,
				multiboxonly: !0,
                colModel: [{
                    name: "operating",
                    label: "操作",
                    width: 60,
                    fixed: !0,
                    formatter: e,
                    align: "center"
                }, {
                    name: "Create_Date",
                    label: "出库日期",
                    width: 150,
                    align: "center"
				}, {
					name: "Stock_ID",
					label: "仓库",
					width: 150,
					align: "center"
                }, {
                    name: "PK_BOM_SO_ID",
                    label: "库存变更编号",
                    width: 150,
                    align: "center"
                }, {
                    name: "Creator",
                    label: "制单人",
                    index: "Creator",
                    width: 100,
                    fixed: !0,
                    align: "center",
                    title: !1
                }, {
                    name: "typeName",
                    label: "类型",
                    index: "typeName",
                    width: 100,
                    fixed: !0,
                    align: "center",
                    title: !1
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
					repeatitems: !1,
					total: "data.total",
					id: "id"
				},
				loadError: function() {},
				ondblClickRow: function(e) {
					$("#" + e).find(".ui-icon-pencil").trigger("click")
				}
			})
		},
		reloadData: function(e) {
			$("#grid").jqGrid("setGridParam", {
				url: invoi_outlist+"?Type=2",
				datatype: "json",
				postData: e
			}).trigger("reloadGrid")
		},
		addEvent: function() {
			var e = this;
			$(".grid-wrap").on("click", ".ui-icon-pencil", function(e) {
				e.preventDefault();
				var t = $(this).parent().data("id");
				parent.tab.addTabItem({
					tabid: "storage-otherOutbound",
					text: "其他出库",
					url: invoi_outedit+"?id=" + t
				});
				$("#grid").jqGrid("getDataIDs");
				parent.salesListIds = $("#grid").jqGrid("getDataIDs")
			});
            $(".grid-wrap").on("click", ".ui-icon-search", function(e) {
                e.preventDefault();
                var t = $(this).parent().data("id");
                var y = $(this).parent().data("type");
                parent.tab.addTabItem({
                    tabid: "storage-otherWarehouse",
                    text: "其他出库",
                    url: invoi_inedit+"?id=" + t + "&type=" + y

                });
                $("#grid").jqGrid("getDataIDs");
                parent.salesListIds = $("#grid").jqGrid("getDataIDs")
            });
			$(".grid-wrap").on("click", ".ui-icon-trash", function(e) {
				e.preventDefault();
				if (Business.verifyRight("OO_DELETE")) {
					var t = $(this).parent().data("id");
					$.dialog.confirm("您确定要删除该出库记录吗？", function() {
						Public.ajaxGet(invoi_del, {			   
							id: t
						}, function(e) {
							if (200 === e.status) {
								$("#grid").jqGrid("delRowData", t);
								parent.Public.tips({
									content: "删除成功！"
								})
							} else parent.Public.tips({
								type: 1,
								content: e.msg
							})
						})
					})
				}
			});
			$("#search").click(function() {
				queryConditions.matchCon = "请输入单据号" === e.$_matchCon.val() ? "" : e.$_matchCon.val();
				queryConditions.beginDate = e.$_beginDate.val();
				queryConditions.endDate = e.$_endDate.val();
				queryConditions.locationId = -1;
				queryConditions.transTypeId = -1;
				THISPAGE.reloadData(queryConditions)
			});
			$("#add").click(function(e) {
				e.preventDefault();
				Business.verifyRight("OO_ADD") && parent.tab.addTabItem({
					tabid: "storage-otherOutbound",
					text: "其他出库",
					url: invoi_out
				})
			});
			$(window).resize(function() {
				Public.resizeGrid()
			})
		}
	};
THISPAGE.init();
