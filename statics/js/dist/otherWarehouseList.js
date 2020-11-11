var queryConditions = {
	matchCon: "",
	locationId: -1,
	transTypeId: -1
},
	hiddenAmount = !1,
	SYSTEM = system = parent.SYSTEM,
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
			function e(e, t, i) {
				var a = '<div class="operating" data-id="' + i.PK_BOM_SO_ID + '"  data-type="' + i.type + '"><span class="ui-icon ui-icon-search" title="查看"></span><span class="ui-icon ui-icon-trash" title="删除"></span></div>';
				return a
			}

            function p(e, t, i) {
				if(i.state === 1){
                    var a = '<div>入库完成</div>';
                }else if(i.state === 2){
                    var a = '<div>正在盘点...等待自动入库</div>';
                }else if(i.state === 3){
                    var a = '<div class="operating" data-id="' + i.PK_BOM_SO_ID + '">自动入库失败...<a class="in">点击手动入库</a></div>';

                }
                 return a
            }

			function t(e) {
				var t;
				switch (e) {
				case 2:
					t = "盘盈";
					break;
				case 1:
					t = "其他入库";
					break;
				}
				return t
			}
			var i = Public.setGrid();
			queryConditions.beginDate = this.$_beginDate.val();
			queryConditions.endDate = this.$_endDate.val();
			$("#grid").jqGrid({
				//url: "/scm/invOi.do?action=listIn&type=in",
				url: invoi_inlist,
				postData: queryConditions,
				datatype: "json",
				autowidth: !0,
				height: i.h,
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
					label: "入库日期",
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
                },
                    {
                        name: "state",
                        label: "状态",
                        width: 200,
                        fixed: !0,
                        formatter: p,
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
					repeatitems: !1,
					total: "data.total",
					id: "id"
				},
				loadError: function() {},
				ondblClickRow: function(e) {
					$("#" + e).find(".ui-icon-search").trigger("click")
				}
			})
		},
		reloadData: function(e) {
			$("#grid").jqGrid("setGridParam", {
				//url: "/scm/invOi.do?action=listIn&type=in",
				url: invoi_inlist+"?type=1",
				datatype: "json",
				postData: e
			}).trigger("reloadGrid")
		},
		addEvent: function() {
			var e = this;
			$(".grid-wrap").on("click", ".in", function(e) {
                e.preventDefault();
                var i = $(this).parent().data("id");
                $.dialog.confirm("确定要手动入库吗？", function() {
                    //Public.ajaxGet("/scm/invPu.do?action=delete", {
                    Public.ajaxGet(invoi_manualImport, {
                        id: i
                    }, function(t) {
                        if (200 === t.status) {
                            parent.Public.tips({
                                content: "手动入库成功！"
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
				var t = $(this).parent().data("id");
                var y = $(this).parent().data("type");
				parent.tab.addTabItem({
					tabid: "storage-otherWarehouse",
					text: "其他入库",
					url: invoi_inedit+"?id=" + t + "&type=" + y
					
				});
				$("#grid").jqGrid("getDataIDs");
				parent.salesListIds = $("#grid").jqGrid("getDataIDs")
			});
			$(".grid-wrap").on("click", ".ui-icon-trash", function(e) {
				e.preventDefault();
					var t = $(this).parent().data("id");
					$.dialog.confirm("您确定要删除该入库记录吗？", function() {
						Public.ajaxGet(invoi_del, {			   
							id: t
						}, function(e) {
							if (200 === e.status) {
								$("#grid").jqGrid("delRowData", t);
								parent.Public.tips({
									content: "删除成功！"
								});
                                THISPAGE.reloadData(queryConditions)
							} else parent.Public.tips({
								type: 1,
								content: e.msg
							})
						})
					})
			});
            $(".wrapper").on("click", "#export", function(t) {
                    var e = $("#grid").jqGrid("getGridParam", "selarrrow"),
                        i = e.join();
                    if (i) $(this).attr("href", invoi_export+"?type=in&id=" + i);
                    else {
                        parent.Public.tips({
                            type: 2,
                            content: "请先选择需要导出的项！"
                        });
                        t.preventDefault()
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
			$("#moreCon").click(function() {
				queryConditions.matchCon = "请输入单据号" === e.$_matchCon.val() ? "" : e.$_matchCon.val();
				queryConditions.beginDate = e.$_beginDate.val();
				queryConditions.endDate = e.$_endDate.val();
				$.dialog({
					id: "moreCon",
					width: 480,
					height: 330,
					min: !1,
					max: !1,
					title: "高级搜索",
					button: [{
						name: "确定",
						focus: !0,
						callback: function() {
							queryConditions = this.content.handle();
							THISPAGE.reloadData(queryConditions);
							"" !== queryConditions.matchCon && e.$_matchCon.val(queryConditions.matchCon);
							e.$_beginDate.val(queryConditions.beginDate);
							e.$_endDate.val(queryConditions.endDate)
						}
					}, {
						name: "取消"
					}],
					resize: !1,
					content: "url:"+settings_other_search,
					data: queryConditions
				})
			});
			$("#add").click(function(e) {
				e.preventDefault();
				parent.tab.addTabItem({
					tabid: "storage-otherWarehouse",
					text: "其他入库",
					url: invoi_in
				})
			});
			$(window).resize(function() {
				Public.resizeGrid()
			})
		}
	};
THISPAGE.init();
