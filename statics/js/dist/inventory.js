var curRow, curCol, loading = null,
	import_dialog = null,
	queryConditions = {
		goods: "",
		showZero: 0
	},
	THISPAGE = {
		init: function(e) {
			this.initDom(e);
			this.addEvent();
			this.loaded = !1;
			this.loadGrid();
		},
		initDom: function() {
			this.$_category = $("#category");
			this.$_goods = $("#goods");
			this.$_note = $("#note");
			this.showZero = $("#showZero").cssCheckbox();
			this.categoryTree = Public.categoryTree(this.$_category, {
				rootTxt: "所有类别",
				width: 200
			})
		},
		loadGrid: function(e) {
			function t(e) {
				return parseFloat(e) < 0 ? '<span class="red">' + e + "</span>" : 0 === parseFloat(e) ? 0 : e || "&#160;"
			}
			function i(e) {
				return e.replace('<span class="red">', "").replace("</span>", "")
			}
            function getUser(){
                var getUser = "";
                var i;
                var list;
                var contentType;
                $.ajax({
                    type:"get",
                    async:false,
                    url:basedata_getUser,
                    contentType:"application/json;charset=UTF-8",
                    data:JSON.stringify(list),
                    success:function(result){
                        var result = eval('(' + result + ')');
                        for (i = 0; i< result.length;i++ ){
                            if(i != result.length-1){
                                getUser += result[i].key + ":" + result[i].name +";";
                            }else{
                                getUser += result[i].key + ":" + result[i].name;
                            }
                        }
                    },
                    error: function(e){
                        console.log(e.status);
                        console.log(e.responseText);
                    }
                });
                return getUser;
            }

			$("#grid").jqGrid("GridUnload");
			var a = $(window).height() - $(".grid-wrap").offset().top - 94;
			$("#grid").jqGrid({
				url:inventory_lists,
				datatype:"json",
				//data: e.rows,
				//datatype: "clientSide",
				autowidth: !0,
				height: a,
				rownumbers: !0,
				altRows: !0,
				gridview: !0,
				colModel: [
					{
					name: "BOM_ID",
					label: "物料名称",
					width: 200,
					hidden:true
                },{
					name: "BOMName",
					label: "物料名称",
                    width: 200
					}
                    ,{
                        name: "BOMModel",
                        label: "型号",
                        width: 200
                    },
 {
                                        name: "Stock_ID",
                                        label: "物料名称",
                                        width: 200,
                                        hidden:true
                },
					{	name: "Stock_Name",
                        label: "仓库",
                        width: 100
                    }, {
                        name: "MInAccount",
                        label: "最低库存量",
                        width: 100,
                        align: "right"
                    }, {
					name: "Account",
					label: "系统库存",
					width: 100,
					align: "right",
						editable: !1
				}, {
					name: "checkInventory",
					label: "盘点库存",
					width: 100,
					title: !1,
					align: "right",
					editable: !0
				},{
					name: "change",
					label: "盘盈盘亏",
					width: 100,
					align: "right",
					formatter: t,
					unformat: i
				}, {
                        name: "Cost",
                        label: "盘点单位成本",
                        width: 100,
                        align: "right",
						editable : !0
                    }],
				cmTemplate: {
					sortable: !1
				},
				page: 1,
				sortname: "number",
				sortorder: "desc",
				pager: "#page",
				rowNum: 2e3,
				rowList: [300, 500, 1e3],
				loadonce: !0,
				viewrecords: !0,
				shrinkToFit: !1,
				forceFit: !1,
				cellEdit: !0,
				triggerAdd: !1,
				cellsubmit: "clientArray",
				localReader: {
					root: "data.rows",
					records: "data.records",
					repeatitems: !1,
					id: "-1"
				},
				jsonReader: {
					root: "data.rows",
					records: "data.records",
					repeatitems: !1,
					id: "-1"
				},
				gridComplete: function() {
					$("tr#1").find("td:eq(11)").trigger("click")
				},
				afterSaveCell: function(e, t, i, a, r) {
					if ("checkInventory" == t) {
						var n = $("#grid").jqGrid("getCell", e, r - 1);
						if (!isNaN(parseFloat(n))) {
							$("#grid").jqGrid("setRowData", e, {
								change: parseFloat(i) - parseFloat(n)
							})
						}
					}
				},
				loadError: function() {}
			})
		},
		reloadData: function(e) {
			$("#grid").jqGrid("setGridParam", {
				//url: "/scm/invOi.do?action=queryToPD",
				url: inventory_lists,
				datatype: "json",
				postData: e,
				loadonce: !0
			}).trigger("reloadGrid")
		},
		_getEntriesData: function() {
			if (null !== curRow && null !== curCol) {
				$("#grid").jqGrid("saveCell", curRow, curCol);
				curRow = null;
				curCol = null
			}
			for (var e = [], t = $("#grid").jqGrid("getDataIDs"), i = 0, a = t.length; a > i; i++) {
				var r, n = t[i],
					o = $("#grid").jqGrid("getRowData", n);
				r = {
					BOM_ID: o.BOM_ID,
					Stock_ID: o.Stock_ID,
					Cost: o.Cost,
                    //: o.MInAccount,
					change: o.change,
                    checkInventory : o.checkInventory
				};
				e.push(r)
			}
			return e
		},
		addEvent: function() {
			var t = this;
			$("#search").click(function() {
				 queryConditions ={
					 // $("#goods").val() ;
					//{ locationId: t.storageCombo.getValue(),
					// categoryId: t.categoryTree.getValue(),
					goods: t.$_goods.val(),
					showZero: t.showZero.chkVal().join() ? 1 : 0
			};

             // queryConditions=JSON.stringify(queryConditions);
				// console.log(queryConditions);
				//t.loaded ? t.reloadData(queryConditions) : Public.ajaxGet("/scm/invOi.do?action=queryToPD", queryConditions, function(e) {
				t.loaded ? t.reloadData(queryConditions) : Public.ajaxGet(inventory_lists, queryConditions, function(e) {																													  																										  
					if (200 === e.status) {
                        THISPAGE.reloadData(queryConditions)
/*						$(".grid-wrap").removeClass("no-query");
						t.loadGrid(e.data);
						t.loaded = !0;
						$("#handleDom").show();
						$(".mod-search .fr").show()*/
					} else parent.Public.tips({
						type: 1,
						content: msg
					})
				})
			});
			$("#save").click(function() {
				var e = t._getEntriesData();
				if (!(e.length > 0)) {
					parent.Public.tips({
						type: 2,
						content: "物料信息不能为空！"
					});
					$("#grid").jqGrid("editCell", 1, 2, !0);
					return !1
				}
				var i = {
					entries: e,
					description: $.trim(t.$_note.val())
				};
				//Public.ajaxPost("/scm/invOi.do?action=generatorPD", {
				Public.ajaxPost(inventory_generator, {
								
					postData: JSON.stringify(i)
				}, function(e) {
					if (200 === e.status) {
						parent.Public.tips({
							content: e.msg
						});
						$("#search").trigger("click");
                        $("#btn").val("开始盘点")
					} else parent.Public.tips({
						type: 1,
						content: e.msg
					})
				})
			});
			$("#export").click(function(e) {
                queryConditions ={
                    goods: t.$_goods.val(),
                    showZero: t.showZero.chkVal().join() ? 1 : 0
                };
				Business.verifyRight("PD_EXPORT") ? $(this).attr("href", inventory_export + "?goods=" + queryConditions.goods + "&showZero=" + queryConditions.showZero) : e.preventDefault()
			});
			$(document).bind("click.cancel", function(e) {
				if (!$(e.target).closest(".ui-jqgrid-btable").length > 0 && null !== curRow && null !== curCol) {
					$("#grid").jqGrid("saveCell", curRow, curCol);
					curRow = null;
					curCol = null
				}
			});
			$(window).resize(function() {
				Public.resizeGrid(94)
			})
		}
	};
THISPAGE.init();
